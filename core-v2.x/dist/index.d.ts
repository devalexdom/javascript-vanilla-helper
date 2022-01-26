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
export declare class JSVanillaHelper {
    version: number;
    about: string;
    gitSourceUrl: string;
    t: any;
    tData: any;
    hData: IJSVHData;
    helperExtensions: object;
    hexts: object;
    buildType: JSVHBuildType;
    constructor(target?: any, targetData?: {}, helperData?: IJSVHData);
    setTarget(t?: any, tData?: object): this;
    toInt(t?: any): number;
    toFloat(t?: any): number;
    data(dataObjKey: string, t?: HTMLElement): this;
    _v(): this;
    _(): JSVanillaHelper;
    val(setValue: string, t?: HTMLInputElement): string;
    child(query: string, t?: Element): JSVanillaHelper;
    getChild(query: string, t?: Element): Element;
    children(query: string, t?: Element): JSVanillaHelper;
    getChildren(query: string, t?: Element): NodeListOf<Element>;
    hasOverflow(queryChildrens?: string, overflowCallback?: (el: any) => void, t?: HTMLElement): boolean;
    findElementIn(parent: HTMLElement, t?: any): Element;
    mergeObj(sources: Array<Object>, t?: Object): any;
    clone(t?: Object): any;
    alterFontSize(pixelsIn?: number, t?: any): void;
    setMaxViewportScale(maximumScale?: string, initialScale?: string): JSVanillaHelper;
    preventNativeTouchGestures(prevent?: boolean, t?: any): void;
    getData(t?: any): object;
    getArray(t?: any): Array<any>;
    capitalize(t?: any): string;
    hideIf(condition: boolean, displayValue?: string, t?: any): JSVanillaHelper;
    showIf(condition: boolean, displayValue?: string, t?: any): JSVanillaHelper;
    scrollToTarget(yOffset?: number, behavior?: ScrollBehavior, t?: any): void;
    getItemsCountPerRow(t?: any): number;
    scrollContainerToTarget({ yOffset, xOffset, behavior }: {
        yOffset?: number;
        xOffset?: number;
        behavior?: string;
    }, parentEl?: any, t?: any): void;
    onFalseEmptyString(t?: any): string;
    isIterable(t?: any): boolean;
    isDateObj(t?: Date): boolean;
    isZeroLength(t?: any): boolean;
    isEmpty(t?: any): boolean;
    onEvent(eventName: string, actionCallback: Function, t?: any): object;
    onEvents(eventName: Array<string>, actionCallback: any, t?: any): JSVanillaHelper;
    $$(newScope: Function): void;
    get(index: number): any;
    sel(index: number): JSVanillaHelper;
    log(t?: any): JSVanillaHelper;
    addHelperExtension(extension: IJSVanillaHelper_Extension): JSVanillaHelper;
    removeHelperExtension(extensionName: string): JSVanillaHelper;
    clearLocationHash(): JSVanillaHelper;
    getTextRenderedSize(font?: string, widthLimit?: number, t?: any): object;
    getFontUsed(property?: string, t?: any): string;
    getRenderedStyle(property?: string, t?: any): string;
    forEach(iteration: Function, t?: any): JSVanillaHelper;
    whileEach(iteration: Function, t?: any): JSVanillaHelper;
    reverseEach(iteration: Function, t?: any): JSVanillaHelper;
    eachOne(helperFunction?: string, args?: any[]): void;
    waitFor(timeInMs?: number, helperFunction?: string, args?: any[]): JSVanillaHelper;
    objForEach(iteration: Function, t?: any): JSVanillaHelper;
    setAttr(attrName?: string, attrValue?: string, t?: any): JSVanillaHelper;
    setId(id?: string, t?: any): JSVanillaHelper;
    setClass(className?: string, t?: any): JSVanillaHelper;
    addBrowserClass(t?: any): void;
    detectBrowser(): string;
    nextQuerySign(t?: any): "?" | "&";
    newEl(tag?: string): this;
    hasChildren(t?: any): boolean;
    firstOrDefault(arrayObj?: any): any;
    show(displayValue?: string, t?: any): this;
    hide(t?: any): this;
    hideIn(timeInMs?: number, t?: any): this;
    addClass(className: any, t?: any): this;
    addClasses(classNames?: any[], t?: any): this;
    addMeta(name?: string, content?: string, t?: any): void;
    addScriptFile(src?: string, onload?: () => void, id?: string, t?: any): void;
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
    N(objPropertyStr: any, t?: any): any;
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
    resizeObserver(onResize: any, t?: any): void;
    hasAttribute(AttributeName?: string, t?: any): boolean;
    isVisible(verticalOffset?: number, t?: any): any;
    isRendered(verticalOffset?: number, t?: any): any;
    isElementBound(child: any, padding: any, t?: any): boolean;
    getVisibilityData(verticalOffset?: number, t?: any): any;
    addAnimation(elProperty?: string, value?: string, durationInS?: number, t?: any): void;
    dispatchEvent(eventName: any, t?: any): this;
    isBrowserES6Compatible(): boolean;
    isPlainObject(t?: any): boolean;
    getCookie(cName?: string): string;
    setCookie(cName: any, cValue: any, exDays: any): void;
    noSourceConsole(logType?: string, t?: any): void;
    console(logType?: string, t?: any): void;
    getPageHeight(): number;
    makeInmutable(t?: any): any;
    onScroll({ offsetTop, top: topCallback, down: downCallback, up: upCallback, disableFlagMode, }: {
        offsetTop?: number;
        top: any;
        down: any;
        up: any;
        disableFlagMode?: boolean;
    }, t?: any): void;
    initializeApp(setAsMainApp: boolean): void;
}
export declare const defaultHelperInstance: JSVanillaHelper;
export declare const V: (target?: any) => JSVanillaHelper;
export declare const V$C: (className?: string) => JSVanillaHelper;
export declare const V$I: (id?: string) => JSVanillaHelper;
export declare const V$: (query?: string) => JSVanillaHelper;
export declare const _V: (target?: any) => JSVanillaHelper;
export declare const _V$: (query?: string) => JSVanillaHelper;
export {};
