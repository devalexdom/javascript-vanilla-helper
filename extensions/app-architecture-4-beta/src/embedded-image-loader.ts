import { AppArchitectureHelper } from "./models";


export interface EmbeddedImageLoaderServiceConfig {
    loadImagesOnViewportVisible?: boolean;
    forceImageToHaveDomain?: boolean;
    viewportMobileSizes?: Array<string>;
    viewportSizesMapping?: () => string;
}

export class EmbeddedImageLoaderService {
    #config: EmbeddedImageLoaderServiceConfig;
    #allImages: Array<HTMLElement>;
    #viewportSize: string;
    #appHelper: AppArchitectureHelper;
    constructor(appHelper: AppArchitectureHelper) {
        this.#appHelper = appHelper;
        this.#viewportSize = '';
        this.#config = {
            loadImagesOnViewportVisible: true,
            forceImageToHaveDomain: true,
            viewportMobileSizes: ["xs", "sm"],
            viewportSizesMapping: () => {
                if (window.innerWidth <= 575) {
                    return 'xs';
                } if (window.innerWidth <= 991) {
                    return 'sm';
                } if (window.innerWidth <= 1199) {
                    return 'md';
                } if (window.innerWidth <= 1399) {
                    return 'lg';
                }
                return 'xl';
            }
        }

        const customConfig = appHelper.getConfig("imageLoader");

        if (customConfig) {
            this.#config = { ...this.#config, ...customConfig };
        }
        else if (customConfig === false) return;

        appHelper.subscribe("AppServicesInit", () => this.#init());
    }

    #init() {
        this.#queryAllDOMImages();
        this.#setInitialContextVars();
        if (this.#config.loadImagesOnViewportVisible) {
            this.#trackImagesVisibility();
        }
        else {
            this.#loadAllImages();
        }
        this.#handleViewportSizeChange();
    }

    #loadAllImages() {
        this.#allImages.forEach((image) => this.loadLazyElement(image));
    }

    #trackImagesVisibility() {
        const { V } = this.#appHelper;

        const imagesToTrack = this.#allImages.filter((image) => !image["activeVisibilityTracking"]).map(image => {
            image["activeVisibilityTracking"] = true;
            return image;
        });

        V(imagesToTrack).onViewportVisibleOnce((image) => {
            image["activeVisibilityTracking"] = false;
            this.loadLazyElement(image);
        }, { root: null, rootMargin: "0px", threshold: 0.1 });
    }

    #setInitialContextVars() {
        this.#viewportSize = this.#getViewportSize();
        this.#appHelper.setContextVar("viewportPredefinedSize", this.#viewportSize, true);
        this.#appHelper.setContextVar("isViewportSizeMobile", this.#config.viewportMobileSizes.includes(this.#viewportSize), true);
    }

    #queryAllDOMImages() {
        this.#allImages = [...document.body.querySelectorAll("[data-image-src]")] as Array<HTMLElement>;
    }

    #getImageUrl(src, el) {
        const optimizedImageUrl = this.#config.forceImageToHaveDomain ? new URL(src, document.baseURI) : new URL(src);
        return optimizedImageUrl.toString();
    }

    #getImageSrcByViewportSize(el, fallbackSrc) {
        if (this.#viewportSize !== 'xl') {
            const src = el.getAttribute(`data-src-${this.#viewportSize}`);
            if (src) {
                return src;
            }
        }
        return fallbackSrc;
    }

    #getViewportSize() {
        return this.#config.viewportSizesMapping();
    }

    #fetchSVGXML(src, successCallback = (xml) => { }) {
        let url = src;
        if (src.startsWith("/")) {
            url = `${document.location.origin}${src}`;
        }
        fetch(url).then(response => response.text()).then(xml => {
            successCallback(xml);
        }).catch(err => {
            console.error(`Cannot render SVG from ${src}`);
            console.error(err);
        });
    }

    #safeExtractSVGElementfromXML(xml) {
        const sandbox = document.createElement('div');
        sandbox.innerHTML = xml;
        const scripts = sandbox.getElementsByTagName('script');
        [...scripts].forEach((script) => {
            script.parentNode.removeChild(script);
        })
        const svg = sandbox.getElementsByTagName('svg')[0] ?? null;
        return svg;
    }

    #handleViewportSizeChange() {
        const { V } = this.#appHelper;
        V(window).onEvent('resize', () => {
            const currentViewportSize = this.#getViewportSize();
            if (currentViewportSize !== this.#viewportSize) {
                this.#viewportSize = currentViewportSize;
                this.#appHelper.setContextVar("viewportPredefinedSize", this.#viewportSize, true);
                this.#appHelper.setContextVar("isViewportSizeMobile", this.#config.viewportMobileSizes.includes(this.#viewportSize), true);

                if (this.#config.loadImagesOnViewportVisible) {
                    this.#trackImagesVisibility();
                }
                else {
                    this.#loadAllImages();
                }
            }
        });
    }

    loadLazyElement(element: HTMLElement) {
        const { V } = this.#appHelper;
        const originalSrc = element.getAttribute("data-image-src");
        if (!originalSrc) {
            element.removeAttribute("data-image-src");
            return;
        }
        const src = this.#getImageUrl(this.#getImageSrcByViewportSize(element, originalSrc), element);
        switch (element.tagName) {
            case "IMG":
                element.setAttribute("src", src);
                if (V(element).hasClass('load-feedback')) {
                    V(element).onEvent('load', () => {
                        element.classList.add('img-loaded');
                    });
                }
                break;

            case "DIV":
                const targetEl = (V(element).hasClass('parent-background-image')) ? element.parentNode as HTMLElement : element;
                targetEl.style.backgroundImage = `url("${src}")`;
                break;

            case "svg":
                this.#fetchSVGXML(src, (xml) => {
                    const svgEl = this.#safeExtractSVGElementfromXML(xml);
                    if (svgEl) {
                        const lazyloadCallback = element["lazyloadCallback"];

                        const hasViewBox = !!svgEl.getAttribute("viewBox");
                        if (!hasViewBox) {
                            const height = svgEl.getAttribute("height");
                            const width = svgEl.getAttribute("width");
                            if (height && width) {
                                svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);
                            }
                        }

                        element.classList.forEach((originClass) => {
                            svgEl.classList.add(originClass);
                        })
                        element.parentNode.replaceChild(svgEl, element);

                        if (lazyloadCallback) {
                            lazyloadCallback(svgEl);
                        }
                    }
                });
                break;

            default:
                this.#appHelper.reportError("Unsupported DOM element", element);
                break;
        }
    }
}