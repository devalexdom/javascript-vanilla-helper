import { AppArchitectureHelper } from "./models";
export interface EmbeddedImageLoaderServiceConfig {
    loadImagesOnViewportVisible?: boolean;
    forceImageToHaveDomain?: boolean;
    viewportMobileSizes?: Array<string>;
    viewportSizesMapping?: () => string;
}
export declare class EmbeddedImageLoaderService {
    #private;
    constructor(appHelper: AppArchitectureHelper);
    loadLazyElement(element: HTMLElement): void;
}
