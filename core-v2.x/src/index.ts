const lodashMerge: Function = require('lodash.merge');
const lodashCloneDeep: Function = require('lodash.clonedeep');

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

enum JSVHBuildType {
  stable = 1,
  beta,
  nightly
}


export class JSVanillaHelper {
  version: number;
  about: string;
  gitSourceUrl: string;
  t: any;
  tData: any;
  hData: IJSVHData;
  helperExtensions: object;
  hexts: object;
  buildType: JSVHBuildType;
  constructor(
    target: any = null,
    targetData = {},
    helperData: IJSVHData = { reg: { mainAppRef: null, appsRef: {}, workers: {}, pNTouchGesturesHelperFunc: null }, flags: {} }
  ) {
    this.version = 2.10;
    this.gitSourceUrl = "https://github.com/devalexdom/javascript-vanilla-helper/tree/master/core-v2.x";
    this.buildType = 2;
    this.about = `JSVanillaHelper Core ${this.version} ${JSVHBuildType[this.buildType]} || ${this.gitSourceUrl}`;
    this.t = target;
    this.tData = targetData;
    this.hData = helperData;
    this.helperExtensions = {};
    this.hexts = this.helperExtensions;
  }

  setTarget(t: any = null, tData: object = {}) {
    this.t = t;
    this.tData = tData;
    return this;
  }

  toInt(t: any = this.t) {
    return parseInt(t);
  }

  toFloat(t: any = this.t) {
    return parseFloat(t);
  }

  data(dataObjKey: string, t: HTMLElement = this.t) {
    if (!t || !t.dataset) {
      this.t = "";
      return this;
    }
    this.t = this.t.dataset[dataObjKey];
    return this;
  }

  _v() {
    return { ...this };
  }

  _() {
    return new JSVanillaHelper(this.t, this.hData);
  }

  val(setValue: string, t: HTMLInputElement = this.t) {
    if (setValue) {
      t.value = setValue;
    }
    return t.value;
  }

  child(query: string, t: Element = this.t): JSVanillaHelper {
    this.setTarget(t.querySelector(query));
    return this;
  }

  getChild(query: string, t: Element = this.t): Element {
    return t.querySelector(query);
  }

  children(query: string, t: Element = this.t): JSVanillaHelper {
    this.setTarget(t.querySelectorAll(query));
    return this;
  }

  getChildren(query: string, t: Element = this.t): NodeListOf<Element> {
    return t.querySelectorAll(query);
  }

  hasOverflow(queryChildrens: string = '', overflowCallback = (el) => { }, t: HTMLElement = this.t): boolean {
    let overflow = 0;
    const isOverflown = ({
      clientWidth,
      clientHeight,
      scrollWidth,
      scrollHeight,
    }) => {
      return scrollHeight > clientHeight || scrollWidth > clientWidth;
    };
    if (queryChildrens) {
      const currentChildrens = t.querySelectorAll(queryChildrens);
      this.forEach((child) => {
        if (isOverflown(child)) {
          overflowCallback(child);
          overflow |= 1;
        }
      }, currentChildrens);
    }
    return !(!overflow);
  }

  findElementIn(parent: HTMLElement, t: any = this.t): Element {
    const descendants = Array.from(parent.querySelectorAll('*'));
    return descendants.find((el) => el === t);
  }

  mergeObj(sources: Array<Object>, t: Object = this.t) {
    return lodashMerge(lodashCloneDeep(t), sources);
  }

  clone(t: Object = this.t) {
    return lodashCloneDeep(t);
  }

  alterFontSize(pixelsIn: number = -2, t: any = this.t): void {
    const fontSize = parseInt(
      window.getComputedStyle(t).fontSize.replace('px', '')
    );
    t.style.fontSize = `${fontSize + pixelsIn}px`;
  }

  setMaxViewportScale(maximumScale: string = '', initialScale: string = '1.0'): JSVanillaHelper {
    const maxScale = maximumScale
      ? `, maximum-scale=${maximumScale}`
      : '';
    const userScalable =
      maximumScale === initialScale ? ', user-scalable=no' : '';
    const vMetaContent = `width=device-width, initial-scale=${initialScale}${maxScale}${userScalable}`;
    const viewportMeta = document.querySelector('meta[name=viewport]');
    if (viewportMeta) {
      viewportMeta.setAttribute("content", vMetaContent);
    } else {
      this.addMeta('viewport', vMetaContent, document.head);
    }
    if (maximumScale === initialScale) {
      this.preventNativeTouchGestures(true, document);
    } else {
      this.preventNativeTouchGestures(false, document);
    }
    return this;
  }

  preventNativeTouchGestures(prevent: boolean = true, t: any = this.t): void {
    if (!this.hData.reg.pNTouchGesturesHelperFunc) {
      this.hData.reg.pNTouchGesturesHelperFunc = (e) => {
        e.preventDefault();
      };
    }
    const listenerOptions = { passive: false };
    if (prevent) {
      t.addEventListener(
        'touchmove',
        this.hData.reg.pNTouchGesturesHelperFunc,
        listenerOptions
      );
    } else {
      t.removeEventListener(
        'touchmove',
        this.hData.reg.pNTouchGesturesHelperFunc,
        listenerOptions
      );
    }
  }

  getData(t: any = this.t): object {
    return t.dataset;
  }

  getArray(t: any = this.t): Array<any> {
    return Array.from(t);
  }

  capitalize(t: any = this.t): string {
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  hideIf(condition: boolean, displayValue: string = '', t: any = this.t): JSVanillaHelper {
    condition ? this.hide(t) : this.show(displayValue, t);
    return this;
  }

  showIf(condition: boolean, displayValue: string = 'block', t: any = this.t): JSVanillaHelper {
    !condition ? this.hide(t) : this.show(displayValue, t);
    return this;
  }

  scrollToTarget(yOffset = 0, behavior: ScrollBehavior = "smooth", t: any = this.t): void {
    const y = t.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: behavior });
  }

  getItemsCountPerRow(t: any = this.t): number {
    let lastXPos = 0;
    let itemsCount = 0;
    for (const item of t) {
      const itemXPos = item.getBoundingClientRect().top;
      if (itemXPos !== lastXPos && lastXPos !== 0) {
        return itemsCount;
      }

      lastXPos = itemXPos;
      itemsCount++;

    }
  }

  scrollContainerToTarget(
    { yOffset = 0, xOffset = 0, behavior = 'smooth' },
    parentEl = null,
    t: any = this.t
  ): void {
    const containerEl = !parentEl ? t.parentNode : parentEl;
    const y = t.offsetTop + yOffset;
    const x = t.offsetLeft + xOffset;
    containerEl.scrollTo({ top: y, left: x, behavior });
  }

  onFalseEmptyString(t: any = this.t): string {
    return !t ? '' : t;
  }

  isIterable(t: any = this.t): boolean {
    return Symbol.iterator in Object(t);
  }

  isDateObj(t: Date = this.t): boolean {
    return t instanceof Date && Object.prototype.toString.call(t) === "[object Date]";
  }

  isZeroLength(t: any = this.t): boolean {
    return t.length === 0;
  }

  isEmpty(t: any = this.t): boolean {
    if (t == null) return true;
    const type = typeof t;
    if (type === 'string' || Array.isArray(t)) return this.isZeroLength(t);
    return this.isZeroLength(Object.keys(t));
  }

  onEvent(eventName: string, actionCallback: Function, t: any = this.t): object {
    const removeListener = () => {
      t.removeEventListener(eventName, callback, false);
    };
    const callback = (e) => {
      actionCallback(e, removeListener);
    };
    t.addEventListener(eventName, callback, false);
    return { helper: this, removeListener };
  }

  onEvents(eventName: Array<string>, actionCallback, t: any = this.t): JSVanillaHelper {
    const removeListener = () => {
      this.forEach((eventName) => {
        t.removeEventListener(eventName, callback, false);
      }, eventName);
    };
    const callback = (e) => {
      actionCallback(e, removeListener);
    };
    this.forEach((eventName) => {
      t.addEventListener(eventName, callback, false);
    }, eventName);
    return this;
  }

  $$(newScope: Function): void {
    newScope(new JSVanillaHelper(this.t, this.tData));
  }

  get(index: number): any {
    return index || index === 0 ? this.t[index] : this.t;
  }

  sel(index: number): JSVanillaHelper {
    if (index || index === 0) {
      this.t = this.t[index];
    }
    return this;
  }

  log(t: any = this.t): JSVanillaHelper {
    console.log(t);
    return this;
  }

  addHelperExtension(extension: IJSVanillaHelper_Extension): JSVanillaHelper {
    const doneFeedbackFunction = () => {
      return "callbackDone";
    };

    const extensionName = extension.extensionName || extension.helperExtensionName;
    if (!this.hexts[extensionName]) {
      extension.helper = this;
      this.hexts[extensionName] = extension;

      if (typeof extension.onAddExtension === "function") {
        extension.onAddExtension.bind(extension)();
        extension.onAddExtension = doneFeedbackFunction;
      }
      if (typeof extension.extendHelperInstance === "function") {
        extension.extendHelperInstance.bind(extension)(this);
        extension.extendHelperInstance = doneFeedbackFunction;
      }
      if (typeof extension.extendHelperPrototype === "function") {
        extension.extendHelperPrototype.bind(extension)(JSVanillaHelper.prototype);
        extension.extendHelperPrototype = doneFeedbackFunction;
      }
    }
    else {
      console.error(`JSVanillaHelper Core: Extension alias "${extensionName}" already added`);
    }
    return this;
  }

  removeHelperExtension(extensionName: string): JSVanillaHelper {
    delete this.hexts[extensionName];
    return this;
  }

  getTextRenderedSize(font: string = '16px Arial', widthLimit: number = 0, t: any = this.t): object {
    // Max font-size will only work in px
    const changeFontSize = (newSize, contextFont) => {
      return (contextFont = contextFont.replace(/\d+px/, newSize));
    };
    const textEl = document.createElement('canvas');
    const context = textEl.getContext('2d');
    context.font = font;
    const textMesure = context.measureText(t);
    const height =
      textMesure.actualBoundingBoxAscent + textMesure.actualBoundingBoxDescent;

    let maxFontSizePX = parseFloat(font.match(/\d+px/)[0].replace('px', ''));
    if (widthLimit > 0) {
      while (context.measureText(t).width > widthLimit && maxFontSizePX > 0) {
        maxFontSizePX--;
        context.font = changeFontSize(`${maxFontSizePX}px`, context.font);
      }
    }
    return { width: textMesure.width, height, maxFontSizePX };
  }

  getFontUsed(property: string = 'font', t: any = this.t): string {
    return this.getRenderedStyle(property, t);
  }

  getRenderedStyle(property: string = 'color', t: any = this.t): string {
    const computedStyle = window.getComputedStyle(t, null);
    return computedStyle.getPropertyValue(property);
  }

  forEach(iteration: Function, t: any = this.t): JSVanillaHelper {
    [].forEach.call(t, iteration);
    return this;
  }

  whileEach(iteration: Function, t: any = this.t): JSVanillaHelper {
    const iterableLength = t.length;
    let i = 0;
    let loop = true;
    const stop = () => {
      loop = false;
      return t[i];
    };
    while (loop && i < iterableLength) {
      iteration(t[i], i, stop);
      i++;
    }
    return this;
  }

  reverseEach(iteration: Function, t: any = this.t): JSVanillaHelper {
    let i = t.length;
    while (i--) {
      iteration(t[i], i);
    }
    return this;
  }

  eachOne(helperFunction: string = '', args = []): void {
    const newInstance = new JSVanillaHelper();
    this.forEach((item) => {
      newInstance.setTarget(item);
      newInstance[helperFunction].apply(newInstance, args);
    }, this.t);
  }

  waitFor(timeInMs: number = 0, helperFunction: string = '', args = []): JSVanillaHelper {
    const newInstance = new JSVanillaHelper(this.t, this.tData);
    setTimeout(() => {
      newInstance[helperFunction].apply(newInstance, args);
    }, timeInMs);
    return this;
  }

  objForEach(iteration: Function, t: any = this.t): JSVanillaHelper {
    [].forEach.call(Object.keys(t), (value, index) =>
      iteration(t[value], value, index)
    );
    return this;
  }

  setAttr(attrName: string = 'src', attrValue: string = '', t: any = this.t): JSVanillaHelper {
    this.t.setAttribute(attrName, attrValue);
    return this;
  }

  setId(id: string = '', t: any = this.t): JSVanillaHelper {
    this.t.id = id;
    return this;
  }

  setClass(className: string = '', t: any = this.t): JSVanillaHelper {
    this.t.className = className;
    return this;
  }

  addBrowserClass(t: any = this.t): void {
    t.classList.add(this.detectBrowser());
  }

  detectBrowser(): string {
    const uA = navigator.userAgent;
    if (uA.includes('Edge')) {
      return 'ms-edge';
    }
    if (uA.includes('Edg')) {
      return 'ms-edge-chromium';
    }
    if (uA.includes('Chrome')) {
      return 'chrome';
    }
    if (uA.includes('Safari') && !uA.includes('Chrome')) {
      return 'safari';
    }
    if (uA.includes('Firefox')) {
      return 'firefox';
    }
    if (uA.includes('MSIE') || !!uA.match(/Trident.*rv\:11\./)) {
      return 'ms-ie';
    }
    return 'other-browser';
  }

  nextQuerySign(t: any = this.t) {
    return t.includes('?') ? '&' : '?';
  }

  newElement(t: string = this.t): JSVanillaHelper {
    return this.setTarget(document.createElement(t));
  }

  appendChild(childElement: Element, t: Element = this.t): JSVanillaHelper {
    t.appendChild(childElement);
    return this;
  }

  setHtml(innerHTML: string, t = this.t): JSVanillaHelper {
    t.innerHTML = innerHTML;
    return this;
  }

  hasChildren(t: any = this.t) {
    return t.children.length > 0;
  }

  firstOrDefault(arrayObj = this.t) {
    if (arrayObj.length > 0) {
      return arrayObj[0];
    }
    return null;
  }

  show(displayValue = '', t: any = this.t) {
    t.style.display = displayValue;
    return this;
  }

  hide(t: any = this.t) {
    t.style.display = 'none';
    return this;
  }

  hideIn(timeInMs = 0, t: any = this.t) {
    this.waitFor(timeInMs, 'hide', [t]);
    return this;
  }

  addClass(className, t: any = this.t) {
    t.classList.add(className);
    return this;
  }

  addClasses(classNames = [], t: any = this.t) {
    t.classList.add.apply(t.classList, classNames);
    return this;
  }

  addMeta(name = '', content = '', t: any = this.t) {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    t.appendChild(meta);
  }

  addScriptFile(src = '', onload = () => { }, id = '', t: any = this.t) {
    const scriptEl = document.createElement('script');
    scriptEl.src = src;
    scriptEl.id = id;
    scriptEl.onload = onload;
    t.appendChild(scriptEl);
  }

  addStyleInline(css = '', t: any = this.t) {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    t.appendChild(styleEl);
  }

  isScriptLoaded(src = '') {
    return document.querySelectorAll(`[src="${src}"]`).length > 0;
  }

  delayFunc() {
    return (function () {
      let timer = null;
      return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
      };
    })();
  }

  removeClass(className, t: any = this.t) {
    t.classList.remove(className);
    return this;
  }

  toggleClass(className, t: any = this.t) {
    t.classList.toggle(className);
    return this;
  }

  swapClass(className, className2, t: any = this.t) {
    this.toggleClass(className, t);
    this.toggleClass(className2, t);
    return this;
  }

  replaceClass(className, className2, t: any = this.t) {
    t.classList.replace(className, className2);
    return this;
  }

  flagClass(condition = false, className, t: any = this.t) {
    condition ? t.classList.add(className) : t.classList.remove(className);
    return this;
  }

  hasClass(className, t: any = this.t) {
    return t.classList.contains(className);
  }

  /* The correct implementation is to use Logical OR assignment (||=) but is not supported on Safari < 14 and generates critical syntax error. */
  hasClasses(classNamesArr = [], t: any = this.t) {
    return !(!classNamesArr.reduce((has, item) => {
      return has |= t.classList.contains(item);
    }, false));
  }

  removeAllChildren(t: any = this.t) {
    while (t.firstChild) {
      t.removeChild(t.firstChild);
    }
    return this;
  }

  /* Nullable helper method, V(obj).N('maybeUndefinedProperty') equals to obj?.maybeUndefinedProperty */
  N(objPropertyStr, t: any = this.t) {
    if (!t) {
      return null;
    }
    if (typeof t[objPropertyStr] === 'undefined') {
      return null;
    }
    return t[objPropertyStr];
  }

  sortArrayByProperty(property = '', order = 1, t: any = this.t) {
    t.sort((a, b) => (a[property] > b[property] ? 1 : -1 * order));
  }

  sortArray(order = 1, t: any = this.t) {
    t.sort((a, b) => (a > b ? 1 : -1 * order));
  }

  sortNodeChildsByProperty(property = '', order = 1, t: any = this.t) {
    [...t.children]
      .sort((a, b) => (a[property] > b[property] ? 1 : -1 * order))
      .map((node) => t.appendChild(node));
  }

  mutationObserver(actionCallback, { observeAttributes = ["class"], observeMutationTypes = [],
    observeMultipleMutations = false, nativeObserverConfig = { attributes: true } } = {}, t: any = this.t) {
    const stopObserver = () => {
      observer.disconnect();
    };
    const callback = (mutation) => {
      actionCallback(mutation, stopObserver);
    };
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (observeAttributes.includes(mutation.attributeName) || observeMutationTypes.includes(mutation.type)) {
          callback(mutation);
          if (!observeMultipleMutations) break;
        }
      }
    });
    observer.observe(t, nativeObserverConfig);
  }

  resizeObserver(onResize, t: any = this.t) {
    const initialClientRect = t.getBoundingClientRect();
    let lastClientRect = initialClientRect;
    if (typeof ResizeObserver === 'function') {
      const nativeResizeObserver = new ResizeObserver((entries) => {
        const clientRect = t.getBoundingClientRect();
        if (
          lastClientRect.width !== clientRect.width ||
          lastClientRect.height !== clientRect.height
        ) {
          // To avoid false positive on observation start
          lastClientRect = clientRect;
          this.tData = {
            initialClientRect,
            clientRect,
          };
          onResize(this);
        }
      });
      nativeResizeObserver.observe(t);
    } else {
      window.addEventListener('resize', () => {
        const clientRect = t.getBoundingClientRect();
        if (
          lastClientRect.width !== clientRect.width ||
          lastClientRect.height !== clientRect.height
        ) {
          lastClientRect = clientRect;
          this.tData = {
            initialClientRect,
            clientRect,
          };
          onResize(this);
        }
      });
    }
  }

  hasAttribute(AttributeName = '', t: any = this.t) {
    return !(t.getAttribute(AttributeName) == null);
  }

  isVisible(verticalOffset = 0, t: any = this.t) {
    return this.getVisibilityData(verticalOffset, t).visible;
  }

  isRendered(verticalOffset = 0, t: any = this.t) {
    return this.getVisibilityData(verticalOffset, t).rendered;
  }

  isElementBound(child, padding, t: any = this.t) {
    return (
      t.getBoundingClientRect().right >=
      child.getBoundingClientRect().right + padding
    ); // helper t as parent
  }

  getVisibilityData(verticalOffset = 0, t: any = this.t) {
    let visible = false;
    let rendered = false;
    const cR = t.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;
    if (!(cR.height == 0 && cR.width == 0 && cR.top == 0 && cR.left == 0)) {
      rendered = true;
      const vertInView =
        cR.top - verticalOffset <= windowHeight &&
        cR.top + cR.height + verticalOffset >= 0;
      const horInView = cR.left <= windowWidth && cR.left + cR.width >= 0;
      visible = vertInView && horInView;
    }

    this.tData.rendered = rendered;
    this.tData.visible = visible;
    this.tData.clientRect = cR;

    return this.tData;
  }

  addAnimation(
    elProperty = 'margin-top',
    value = '50px',
    durationInS = 0.5,
    t: any = this.t
  ) {
    if (t.style.transition !== '') {
      if (!t.style.transition.includes(elProperty)) {
        t.style.transition += `, ${elProperty} ${durationInS}s`;
      }
    } else {
      t.style.transition = `${elProperty} ${durationInS}s`;
    }

    const hyphen = elProperty.indexOf('-');
    if (hyphen > -1) {
      elProperty =
        elProperty.substr(0, hyphen) +
        elProperty.charAt(hyphen + 1).toUpperCase() +
        elProperty.substr(hyphen + 2, elProperty.length);
    }
    t.style[elProperty] = value;
  }

  dispatchEvent(eventName, t: any = this.t) {
    const event = new Event(eventName);
    t.dispatchEvent(event);
    return this;
  }

  isBrowserES6Compatible() {
    try {
      eval('"use strict"; class appLoaderES6Check {}');
    } catch (e) {
      return false;
    }
    return true;
  }

  isPlainObject(t: any = this.t) {
    return Object.prototype.toString.call(t) === '[object Object]';
  }

  getCookie(cName = '') {
    const name = `${cName}=`;
    let value = '';
    this.whileEach((c, i, stop) => {
      c = c.trim();
      if (c.indexOf(name) === 0) {
        value = c.substring(name.length, c.length);
        stop();
      }
    }, document.cookie.split(';'));
    return value;
  }

  setCookie(cName, cValue, exDays) {
    const d = new Date();
    d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cName}=${cValue}; ${expires};path=/`;
  }

  noSourceConsole(logType = 'log', t: any = this.t) {
    setTimeout(console[logType].bind(console, t));
  }

  console(logType = 'log', t: any = this.t) {
    console[logType](t);
  }

  getPageHeight() {
    const { body } = document;
    const html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  }

  makeInmutable(t: any = this.t) {
    const propNames = Object.getOwnPropertyNames(t);
    let i = propNames.length;
    while (i--) {
      const value = t[propNames[i]];
      if (typeof value === 'object') {
        this.makeInmutable(value);
      }
    }
    return Object.freeze(t);
  }

  onScroll(
    {
      offsetTop = 0,
      top: topCallback,
      down: downCallback,
      up: upCallback,
      disableFlagMode = false,
    },
    t: any = this.t
  ) {
    let downFlag = false;
    let lastScroll = 0;
    const setOffsetTop = (newOffsetTop) => {
      offsetTop = newOffsetTop;
    };

    t.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll < offsetTop) {
        if (topCallback) topCallback(setOffsetTop);
        return;
      }
      if (!disableFlagMode) {
        if (currentScroll > lastScroll && !downFlag) {
          // down
          downFlag = true;
          if (downCallback) downCallback(setOffsetTop);
        } else if (currentScroll < lastScroll && downFlag) {
          // up
          downFlag = false;
          if (upCallback) upCallback(setOffsetTop);
        }
      } else if (currentScroll > lastScroll) {
        // down
        if (downCallback) downCallback(setOffsetTop);
      } else if (currentScroll < lastScroll) {
        // up
        if (upCallback) upCallback(setOffsetTop);
      }

      lastScroll = currentScroll;
    });
  }

  initializeApp(setAsMainApp: boolean): void {
    console.error("App Architecture extension not found in this JSVanillaHelper (Core) instance")
  }
}

export const defaultHelperInstance = new JSVanillaHelper();

export const V = (target: any = null) => {
  return defaultHelperInstance.setTarget(target);
};

export const V$C = (className: string = '') => {
  return defaultHelperInstance.setTarget(document.getElementsByClassName(className));
};

export const V$I = (id: string = '') => {
  return defaultHelperInstance.setTarget(document.getElementById(id));
};

export const V$ = (query: string = null) => {
  return defaultHelperInstance.setTarget(document.querySelectorAll(query));
};

export const _V = (target: any = null) => {
  return new JSVanillaHelper(target);
};

export const _V$ = (query: string = null) => {
  return new JSVanillaHelper(document.querySelectorAll(query));
};