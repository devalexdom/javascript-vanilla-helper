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

type SearchParameter = {
  name: string;
  value?: string;
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
    this.version = 3.01;
    this.gitSourceUrl = "https://github.com/devalexdom/javascript-vanilla-helper/tree/master/core-v3.x";
    this.buildType = 1;
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

  dynamicallyExtendThisHelper(extendCallback: (addMethodToHelper: (name: string, notLambdaFunction: Function) => void) => void) {
    const addMethodToHelper = (name: string, notLambdaFunction: Function) => {
      if (this[name]) return;
      this[name] = notLambdaFunction.bind(this);
    }
    extendCallback(addMethodToHelper);
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

  findElementIn(parent: HTMLElement, t: any = this.t): Element {
    const descendants = Array.from(parent.querySelectorAll('*'));
    return descendants.find((el) => el === t);
  }

  alterFontSize(pixelsIn: number = -2, t: any = this.t): void {
    const fontSize = parseInt(
      window.getComputedStyle(t).fontSize.replace('px', '')
    );
    t.style.fontSize = `${fontSize + pixelsIn}px`;
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

  onEvent(eventName: string, actionCallback: (event: Event, removeListener: () => void) => void, t: any = this.t): object {
    const removeListener = () => {
      t.removeEventListener(eventName, callback, false);
    };
    const callback = (e) => {
      actionCallback(e, removeListener);
    };
    t.addEventListener(eventName, callback, false);
    return { helper: this, removeListener };
  }

  onEvents(eventName: Array<string>, actionCallback: (event: Event, removeListener: () => void) => void, t: any = this.t): JSVanillaHelper {
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

  get(index?: number): any {
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

  clearLocationHash(): JSVanillaHelper {
    history.pushState("", document.title, window.location.pathname
      + window.location.search);
    return this;
  }

  getRenderedStyle(property: string = 'color', t: any = this.t): string {
    const computedStyle = window.getComputedStyle(t, null);
    return computedStyle.getPropertyValue(property);
  }

  forEach(iteration: Function, t: any = this.t): JSVanillaHelper {
    [].forEach.call(t, iteration);
    return this;
  }

  eachOne(helperFunction: string = '', args = []): void {
    const newInstance = new JSVanillaHelper();
    this.forEach((item) => {
      newInstance.setTarget(item);
      newInstance[helperFunction].apply(newInstance, args);
    }, this.t);
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

  URL(t: any = this.t) {
    return this.setTarget(new URL(t));
  }

  addGetParameter(name: string, value: string, t: URL = this.t) {
    t.searchParams.append(name, value);
    return this;
  }

  addGetParameters(parameters: Array<{ name: string, value: string }>, t: URL = this.t) {
    for (let i = 0; i < parameters.length; i++) {
      t.searchParams.append(parameters[i].name, parameters[i].value);
    }
    return this;
  }

  removeGetParameter(name: string, t: URL = this.t) {
    t.searchParams.delete(name);
    return this;
  }

  removeGetParameters(parameters: Array<{ name: string, value?: string }>, t: URL = this.t) {
    for (let i = 0; i < parameters.length; i++) {
      t.searchParams.delete(parameters[i].name);
    }
    return this;
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
    if (arrayObj?.length > 0) {
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
    setTimeout(() => this.hide(t), timeInMs);
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

  addScriptFile(src: string, onload = (e?: Event) => { }, id = '', attributes: Array<{ name: string, value: string }> = [], t: any = this.t) {
    const scriptEl = document.createElement('script');
    scriptEl.src = src;
    scriptEl.id = id;
    scriptEl.onload = onload;
    attributes.forEach(attribute => {
      scriptEl.setAttribute(attribute.name, attribute.value);
    });
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
    observeMultipleMutations = false, observerParameters = { attributes: true } } = {}, t: any = this.t) {
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
    observer.observe(t, observerParameters);
  }

  resizeObserver(onResize: (helper: JSVanillaHelper) => void, t: any = this.t) {
    const initialClientRect = t.getBoundingClientRect();
    let lastClientRect = initialClientRect;
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
  }

  onViewportVisibleOnce(isVisibleCallback = (element: HTMLElement, elementIndex: number) => { }, options = { root: null, rootMargin: "0px", threshold: 1.0 }, t: HTMLElement | Array<HTMLElement> = this.t) {
    const observer = new IntersectionObserver(function (entries, self) {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          isVisibleCallback(entry.target as HTMLElement, index);
          self.unobserve(entry.target)//observer passed as self
        }
      });
    }, options);

    if (Array.isArray(t) || NodeList.prototype.isPrototypeOf(t)) {
      [...<[]>t].forEach(element => { observer.observe(element); });
    }
    else if (t) {
      observer.observe(t);
    }

    const stopObserver = () => {
      if (Array.isArray(t) || NodeList.prototype.isPrototypeOf(t)) {
        [...<[]>t].forEach(element => { observer.unobserve(element); });
      }
      else if (t) {
        observer.unobserve(t);
      }
    }

    return {
      stopObserver,
      getObserver: () => observer
    }
  }

  traceViewportVisibility(isVisibleCallback = (element: HTMLElement, elementIndex: number) => { }, isHiddenCallback = (element: HTMLElement, elementIndex: number) => { }, options = { root: null, rootMargin: "0px", threshold: 1.0 }, t: HTMLElement | Array<HTMLElement> = this.t) {
    const observer = new IntersectionObserver(function (entries, self) {
      entries.forEach((entry, index) => {
        const isIntersecting = entry.isIntersecting;
        const wasIntersecting = entry.target["jsvh_isIntersecting"] ?? null;

        if (isIntersecting && !wasIntersecting) {
          entry.target["jsvh_isIntersecting"] = true;
          isVisibleCallback(entry.target as HTMLElement, index);
        }
        else if (!isIntersecting && (wasIntersecting || wasIntersecting === null)) {
          entry.target["jsvh_isIntersecting"] = false;
          isHiddenCallback(entry.target as HTMLElement, index);
        }
      });
    }, options);

    if (Array.isArray(t) || NodeList.prototype.isPrototypeOf(t)) {
      [...<[]>t].forEach(element => { observer.observe(element); });
    }
    else if (t) {
      observer.observe(t);
    }

    const stopObserver = () => {
      if (Array.isArray(t) || NodeList.prototype.isPrototypeOf(t)) {
        [...<[]>t].forEach(element => { observer.unobserve(element); });
      }
      else if (t) {
        observer.unobserve(t);
      }
    }

    return {
      stopObserver,
      getObserver: () => observer
    }
  }

  setLSWithExpiry(value: any, expiryDate: Date, readOnce = false, key = this.t) {
    const item = {
      value: value,
      expiry: expiryDate.getTime(),
      readOnce
    }
    localStorage.setItem(key, JSON.stringify(item))
  }

  getLSWithExpiry(key = this.t) {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (item.expiry && now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    if (item.readOnce) {
      localStorage.removeItem(key);
    }

    return item.value;
  }

  hasAttribute(AttributeName = '', t: any = this.t) {
    return !(t.getAttribute(AttributeName) == null);
  }

  isVisible(partiallyVisible = true, t: any = this.t) {
    const { top, left, bottom, right } = t.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
      ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  }

  isRendered(t: any = this.t) {
    return t.checkVisiblity();
  }

  dispatchEvent(eventName, t: any = this.t) {
    const event = new Event(eventName);
    t.dispatchEvent(event);
    return this;
  }

  isPlainObject(t: any = this.t) {
    return Object.prototype.toString.call(t) === '[object Object]';
  }

  getCookie(cName = '') {
    const cookies = document.cookie;
    const nameEQ = cName + '=';
    const cookieStart = cookies.indexOf(nameEQ);
    if (cookieStart !== -1) {
      const cookieValueStart = cookieStart + nameEQ.length;
      const cookieEnd = cookies.indexOf(';', cookieValueStart);
      const value = cookies.substring(
        cookieValueStart,
        cookieEnd !== -1 ? cookieEnd : undefined
      );
      return decodeURIComponent(value); // returns first found cookie
    }
    return null;
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

  setSearchParameters(parameters: Array<SearchParameter> = [], autoHistoryPushState: boolean = true, t: string | Window = this.t = window): string {
    const targetIsWindow = t === window;
    const url = new URL(targetIsWindow ? t["location"]["href"] : t as string);
    parameters.forEach(parameter => {
      url.searchParams.set(parameter["name"], parameter["value"]);
    });
    const urlStr = url.toString();
    if (targetIsWindow && autoHistoryPushState) {
      this.historyPushState(urlStr, null, "");
    }
    return urlStr;
  }

  setSearchParameter(name: string, value: string, autoHistoryPushState: boolean = true, t: string | Window = this.t = window) {
    return this.setSearchParameters([{ name, value }], autoHistoryPushState, t);
  }

  removeSearchParameters(parameters: Array<SearchParameter> = [], autoHistoryPushState: boolean = true, t: string | Window = this.t = window): string {
    const targetIsWindow = t === window;
    const url = new URL(targetIsWindow ? t["location"]["href"] : t as string);
    parameters.forEach(parameter => {
      url.searchParams.delete(parameter["name"]);
    });
    const urlStr = url.toString();
    if (targetIsWindow && autoHistoryPushState) {
      this.historyPushState(urlStr, null, "");
    }
    return urlStr;
  }

  removeSearchParameter(name: string, autoHistoryPushState: boolean = true, t: string | Window = this.t = window) {
    return this.removeSearchParameters([{ name }], autoHistoryPushState, t);
  }

  historyPushState(url: string, state: any = null, title: string = "") {
    const stateToPush = state ? state : { path: url };
    window.history.pushState(stateToPush, title, url);
    const popStateEvent = new PopStateEvent('popstate', { state: stateToPush });
    window.dispatchEvent(popStateEvent);
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

  createApp(): any {
    console.error("App Architecture v4 extension not found in this JSVanillaHelper (Core) instance")
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