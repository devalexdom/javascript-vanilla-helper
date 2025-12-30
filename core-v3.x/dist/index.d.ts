interface IJSVHReg {
    workers: object;
    pNTouchGesturesHelperFunc: Function;
    appsRef: object;
    mainAppRef: object;
}
interface IJSVHData {
    reg: IJSVHReg;
    flags: object;
}
export interface IJSVanillaHelper_Extension {
    version: number;
    extensionName: string;
    helperExtensionName?: string;
    parameters?: object;
    flags?: object;
    helper: JSVanillaHelper;
    onAddExtension?: Function;
    extendHelperInstance?: Function;
    extendHelperPrototype?: Function;
}
declare enum JSVHBuildType {
    stable = 1,
    beta = 2,
    nightly = 3
}
type SearchParameter = {
    name: string;
    value?: string;
};
export declare class JSVanillaHelper {
    version: number;
    about: string;
    gitSourceUrl: string;
    t: any;
    tData: {
        [key: string]: any;
    };
    hData: IJSVHData;
    helperExtensions: object;
    hexts: object;
    buildType: JSVHBuildType;
    constructor(target?: any, targetData?: {}, helperData?: IJSVHData);
    setTarget(t?: any, tData?: {
        [key: string]: any;
    }): this;
    dynamicallyExtendThisHelper(extendCallback: (addMethodToHelper: (name: string, notLambdaFunction: Function) => void) => void): void;
    attr(attributeName: string, t?: HTMLElement): this;
    toNumber(defaultValue?: number, t?: string | null | undefined): this;
    data(dataObjKey: string, t?: HTMLElement): this;
    _v(): this;
    _(): JSVanillaHelper;
    val(setValue?: string, t?: HTMLInputElement): string;
    child(query: string, t?: Element): JSVanillaHelper;
    getChild(query: string, t?: Element): Element;
    children(query: string, t?: Element): JSVanillaHelper;
    getChildren(query: string, t?: Element): NodeListOf<Element>;
    findElementIn(parent: HTMLElement, t?: any): Element;
    alterFontSize(pixelsIn?: number, t?: any): void;
    getData(t?: any): HTMLElement["dataset"];
    getArray(t?: any): Array<any>;
    capitalize(t?: any): string;
    hideIf(condition: boolean, displayValue?: string, t?: any): JSVanillaHelper;
    showIf(condition: boolean, displayValue?: string, t?: any): JSVanillaHelper;
    scrollToTarget(yOffset?: number, behavior?: ScrollBehavior, t?: any): void;
    scrollContainerToTarget({ yOffset, xOffset, behavior }: {
        yOffset?: number;
        xOffset?: number;
        behavior?: string;
    }, parentEl?: any, t?: any): void;
    isIterable(t?: any): boolean;
    isDateObj(t?: Date): boolean;
    isZeroLength(t?: any): boolean;
    isEmpty(t?: any): boolean;
    onEvent(eventName: string, actionCallback: (event: Event, removeListener: () => void) => void, t?: any): {
        helper: JSVanillaHelper;
        removeListener: () => void;
    };
    onEvents(eventName: Array<string>, actionCallback: (event: Event, removeListener: () => void) => void, t?: any): JSVanillaHelper;
    get(index?: number): any;
    sel(index: number): JSVanillaHelper;
    log(t?: any): JSVanillaHelper;
    addHelperExtension(extension: IJSVanillaHelper_Extension): JSVanillaHelper;
    removeHelperExtension(extensionName: string): JSVanillaHelper;
    clearLocationHash(): JSVanillaHelper;
    getRenderedStyle(property?: string, t?: any): string;
    forEach(iteration: Function, t?: any): JSVanillaHelper;
    eachOne(helperFunction?: string, args?: any[]): void;
    objForEach(iteration: Function, t?: any): JSVanillaHelper;
    setAttr(attrName?: string, attrValue?: string, t?: any): JSVanillaHelper;
    setId(id?: string, t?: any): JSVanillaHelper;
    setClass(className?: string, t?: any): JSVanillaHelper;
    URL(t?: any): this;
    addGetParameter(name: string, value: string, t?: URL): this;
    addGetParameters(parameters: Array<{
        name: string;
        value: string;
    }>, t?: URL): this;
    removeGetParameter(name: string, t?: URL): this;
    removeGetParameters(parameters: Array<{
        name: string;
        value?: string;
    }>, t?: URL): this;
    newElement(t?: string): JSVanillaHelper;
    appendChild(childElement: Element, t?: Element): JSVanillaHelper;
    setHtml(innerHTML: string, t?: any): JSVanillaHelper;
    hasChildren(t?: any): boolean;
    firstOrDefault(arrayObj?: any): any;
    show(displayValue?: string, t?: any): this;
    hide(t?: any): this;
    hideIn(timeInMs?: number, t?: any): this;
    addClass(className: any, t?: any): this;
    addClasses(classNames?: any[], t?: any): this;
    addMeta(name?: string, content?: string, t?: any): void;
    addScriptFile(src: string, onload?: (e?: Event) => void, id?: string, attributes?: Array<{
        name: string;
        value: string;
    }>, t?: any): void;
    addStyleInline(css?: string, t?: any): void;
    isScriptLoaded(src?: string): boolean;
    delayFunc(): (callback: any, ms: any) => void;
    removeClass(className: any, t?: any): this;
    toggleClass(className: any, t?: any): this;
    swapClass(className: any, className2: any, t?: any): this;
    replaceClass(className: any, className2: any, t?: any): this;
    flagClass(condition: boolean, className: any, t?: any): this;
    hasClass(className: any, t?: any): any;
    hasClasses(classNamesArr?: any[], t?: any): boolean;
    removeAllChildren(t?: any): this;
    sortArrayByProperty(property?: string, order?: number, t?: any): void;
    sortArray(order?: number, t?: any): void;
    sortNodeChildsByProperty(property?: string, order?: number, t?: any): void;
    mutationObserver(actionCallback: any, { observeAttributes, observeMutationTypes, observeMultipleMutations, observerParameters }?: {
        observeAttributes?: string[];
        observeMutationTypes?: any[];
        observeMultipleMutations?: boolean;
        observerParameters?: {
            attributes: boolean;
        };
    }, t?: any): void;
    resizeObserver(onResize: (helper: JSVanillaHelper) => void, t?: any): void;
    onViewportVisibleOnce(isVisibleCallback?: (element: HTMLElement, elementIndex: number) => void, options?: {
        root: any;
        rootMargin: string;
        threshold: number;
    }, t?: HTMLElement | Array<HTMLElement>): {
        stopObserver: () => void;
        getObserver: () => IntersectionObserver;
    };
    traceViewportVisibility(isVisibleCallback?: (element: HTMLElement, elementIndex: number) => void, isHiddenCallback?: (element: HTMLElement, elementIndex: number) => void, options?: {
        root: any;
        rootMargin: string;
        threshold: number;
    }, t?: HTMLElement | Array<HTMLElement>): {
        stopObserver: () => void;
        getObserver: () => IntersectionObserver;
    };
    setLSWithExpiry(value: any, expiryDate: Date, readOnce?: boolean, key?: any): void;
    getLSWithExpiry(key?: any): any;
    hasAttribute(AttributeName?: string, t?: any): boolean;
    isVisible(partiallyVisible?: boolean, t?: any): boolean;
    isRendered(t?: any): any;
    dispatchEvent(eventName: any, t?: any): this;
    isPlainObject(t?: any): boolean;
    getCookie(cName?: string): string;
    setCookie(cName: any, cValue: any, exDays: any): void;
    noSourceConsole(logType?: string, t?: any): void;
    console(logType?: string, t?: any): void;
    getPageHeight(): number;
    setSearchParameters(parameters?: Array<SearchParameter>, autoHistoryPushState?: boolean, t?: string | Window): string;
    setSearchParameter(name: string, value: string, autoHistoryPushState?: boolean, t?: string | Window): string;
    removeSearchParameters(parameters?: Array<SearchParameter>, autoHistoryPushState?: boolean, t?: string | Window): string;
    removeSearchParameter(name: string, autoHistoryPushState?: boolean, t?: string | Window): string;
    historyPushState(url: string, state?: any, title?: string): void;
    makeInmutable(t?: any): any;
    createApp(): any;
}
export declare const defaultHelperInstance: JSVanillaHelper;
export declare const V: (target?: any) => JSVanillaHelper;
export declare const V$C: (className?: string) => JSVanillaHelper;
export declare const V$I: (id?: string) => JSVanillaHelper;
export declare const V$: (query?: string) => JSVanillaHelper;
export declare const _V: (target?: any) => JSVanillaHelper;
export declare const _V$: (query?: string) => JSVanillaHelper;
export {};
