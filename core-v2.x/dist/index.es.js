var JSVHBuildType;

(function (JSVHBuildType) {
  JSVHBuildType[JSVHBuildType["stable"] = 1] = "stable";
  JSVHBuildType[JSVHBuildType["beta"] = 2] = "beta";
  JSVHBuildType[JSVHBuildType["nightly"] = 3] = "nightly";
})(JSVHBuildType || (JSVHBuildType = {}));

class JSVanillaHelper {
  constructor(target = null, targetData = {}, helperData = {
    reg: {
      mainAppRef: null,
      appsRef: {},
      workers: {},
      pNTouchGesturesHelperFunc: null
    },
    flags: {}
  }) {
    this.version = 2.04;
    this.gitSourceUrl = "https://github.com/devalexdom/javascript-vanilla-helper";
    this.buildType = 2;
    this.about = `JSVanillaHelper Core ${this.version} ${JSVHBuildType[this.buildType]} || ${this.gitSourceUrl}`;
    this.t = target;
    this.tData = targetData;
    this.hData = helperData;
    this.helperExtensions = {};
    this.hexts = this.helperExtensions;
  }

  setTarget(t = null, tData = {}) {
    this.t = t;
    this.tData = tData;
    return this;
  }

  toInt(t = this.t) {
    return parseInt(t);
  }

  data(dataObjKey, t = this.t) {
    if (!t || !t.dataset) {
      this.t = "";
      return this;
    }

    this.t = this.t.dataset[dataObjKey];
    return this;
  }

  val(setValue, t = this.t) {
    if (setValue) {
      t.value = setValue;
    }

    return t.value;
  }

  firstChildren(query, t = this.t) {
    this.setTarget(t.querySelector(query));
    return this;
  }

  children(query, t = this.t) {
    this.setTarget(t.querySelectorAll(query));
    return this;
  }

  hasOverflow(queryChildrens = '', overflowCallback = el => {}, t = this.t) {
    let overflow = 0;

    const isOverflown = ({
      clientWidth,
      clientHeight,
      scrollWidth,
      scrollHeight
    }) => {
      return scrollHeight > clientHeight || scrollWidth > clientWidth;
    };

    if (queryChildrens) {
      const currentChildrens = t.querySelectorAll(queryChildrens);
      this.forEach(child => {
        if (isOverflown(child)) {
          overflowCallback(child);
          overflow |= 1;
        }
      }, currentChildrens);
    }

    return !!overflow;
  }

  findElementIn(parent, t = this.t) {
    const descendants = Array.from(parent.querySelectorAll('*'));
    return descendants.find(el => el === t);
  }

  alterFontSize(pixelsIn = -2, t = this.t) {
    const fontSize = parseInt(window.getComputedStyle(t).fontSize.replace('px', ''));
    t.style.fontSize = `${fontSize + pixelsIn}px`;
  }

  setMaxViewportScale(maximumScale = '', initialScale = '1.0') {
    const maxScale = maximumScale ? `, maximum-scale=${maximumScale}` : '';
    const userScalable = maximumScale === initialScale ? ', user-scalable=no' : '';
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

  preventNativeTouchGestures(prevent = true, t = this.t) {
    if (!this.hData.reg.pNTouchGesturesHelperFunc) {
      this.hData.reg.pNTouchGesturesHelperFunc = e => {
        e.preventDefault();
      };
    }

    const listenerOptions = {
      passive: false
    };

    if (prevent) {
      t.addEventListener('touchmove', this.hData.reg.pNTouchGesturesHelperFunc, listenerOptions);
    } else {
      t.removeEventListener('touchmove', this.hData.reg.pNTouchGesturesHelperFunc, listenerOptions);
    }
  }

  getData(t = this.t) {
    return t.dataset;
  }

  capitalize(t = this.t) {
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  hideIf(condition, displayValue = '', t = this.t) {
    condition ? this.hide(t) : this.show(displayValue, t);
    return this;
  }

  showIf(condition, displayValue = 'block', t = this.t) {
    !condition ? this.hide(t) : this.show(displayValue, t);
    return this;
  }

  scrollToTarget(yOffset = 0, behavior = "smooth", t = this.t) {
    const y = t.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({
      top: y,
      behavior: behavior
    });
  }

  getItemsCountPerRow(t = this.t) {
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

  scrollContainerToTarget({
    yOffset = 0,
    xOffset = 0,
    behavior = 'smooth'
  }, parentEl = null, t = this.t) {
    const containerEl = !parentEl ? t.parentNode : parentEl;
    const y = t.offsetTop + yOffset;
    const x = t.offsetLeft + xOffset;
    containerEl.scrollTo({
      top: y,
      left: x,
      behavior
    });
  }

  onFalseEmptyString(t = this.t) {
    return !t ? '' : t;
  }

  isIterable(t = this.t) {
    return Symbol.iterator in Object(t);
  }

  isDateObj(t = this.t) {
    return t instanceof Date && Object.prototype.toString.call(t) === "[object Date]";
  }

  isZeroLength(t = this.t) {
    return t.length === 0;
  }

  isEmpty(t = this.t) {
    if (t == null) return true;
    const type = typeof t;
    if (type === 'string' || Array.isArray(t)) return this.isZeroLength(t);
    return this.isZeroLength(Object.keys(t));
  }

  onEvent(eventName, actionCallback, t = this.t) {
    const removeListener = () => {
      t.removeEventListener(eventName, callback, false);
    };

    const callback = e => {
      actionCallback(e, removeListener);
    };

    t.addEventListener(eventName, callback, false);
    return {
      helper: this,
      removeListener
    };
  }

  onEvents(eventName, actionCallback, t = this.t) {
    const removeListener = () => {
      this.forEach(eventName => {
        t.removeEventListener(eventName, callback, false);
      }, eventName);
    };

    const callback = e => {
      actionCallback(e, removeListener);
    };

    this.forEach(eventName => {
      t.addEventListener(eventName, callback, false);
    }, eventName);
    return this;
  }

  $$(newScope) {
    newScope(new JSVanillaHelper(this.t, this.tData));
  }

  get(index) {
    return index || index === 0 ? this.t[index] : this.t;
  }

  sel(index) {
    if (index || index === 0) {
      this.t = this.t[index];
    }

    return this;
  }

  log(t = this.t) {
    console.log(t);
    return this;
  }

  addHelperExtension(extension) {
    const extensionName = extension.extensionName || extension.helperExtensionName;

    if (!this.hexts[extensionName]) {
      extension.helper = this;
      this.hexts[extensionName] = extension;

      if (typeof this.hexts[extensionName].onAddExtension === "function") {
        const bindedFunc = this.hexts[extensionName].onAddExtension.bind(extension);
        bindedFunc();
      }
    }

    return this;
  }

  removeHelperExtension(extensionName) {
    delete this.hexts[extensionName];
    return this;
  }

  getTextRenderedSize(font = '16px Arial', widthLimit = 0, t = this.t) {
    // Max font-size will only work in px
    const changeFontSize = (newSize, contextFont) => {
      return contextFont = contextFont.replace(/\d+px/, newSize);
    };

    const textEl = document.createElement('canvas');
    const context = textEl.getContext('2d');
    context.font = font;
    const textMesure = context.measureText(t);
    const height = textMesure.actualBoundingBoxAscent + textMesure.actualBoundingBoxDescent;
    let maxFontSizePX = parseFloat(font.match(/\d+px/)[0].replace('px', ''));

    if (widthLimit > 0) {
      while (context.measureText(t).width > widthLimit && maxFontSizePX > 0) {
        maxFontSizePX--;
        context.font = changeFontSize(`${maxFontSizePX}px`, context.font);
      }
    }

    return {
      width: textMesure.width,
      height,
      maxFontSizePX
    };
  }

  getFontUsed(property = 'font', t = this.t) {
    return this.getRenderedStyle(property, t);
  }

  getRenderedStyle(property = 'color', t = this.t) {
    const computedStyle = window.getComputedStyle(t, null);
    return computedStyle.getPropertyValue(property);
  }

  forEach(iteration, t = this.t) {
    [].forEach.call(t, iteration);
    return this;
  }

  whileEach(iteration, t = this.t) {
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

  reverseEach(iteration, t = this.t) {
    let i = t.length;

    while (i--) {
      iteration(t[i], i);
    }

    return this;
  }

  eachOne(helperFunction = '', args = []) {
    const newInstance = new JSVanillaHelper();
    this.forEach(item => {
      newInstance.setTarget(item);
      newInstance[helperFunction].apply(newInstance, args);
    }, this.t);
  }

  waitFor(timeInMs = 0, helperFunction = '', args = []) {
    const newInstance = new JSVanillaHelper(this.t, this.tData);
    setTimeout(() => {
      newInstance[helperFunction].apply(newInstance, args);
    }, timeInMs);
    return this;
  }

  waitThen(timeInMs = 0, timeoutCallback) {
    const newInstance = new JSVanillaHelper(this.t, this.tData);
    const timeout = setTimeout(() => {
      timeoutCallback(newInstance);
    }, timeInMs);

    const clear = () => {
      clearTimeout(timeout);
    };

    return {
      helper: newInstance,
      clear,
      timeout
    };
  }

  objForEach(iteration, t = this.t) {
    [].forEach.call(Object.keys(t), (value, index) => iteration(t[value], value, index));
    return this;
  }

  toggleMaximize(t = this.t) {
    if (!t.classList.contains('vjs-helper-maximized')) {
      t.style.height = `${window.innerHeight}px`;
      t.style.width = `${window.innerWidth}px`;
    } else {
      t.style.height = '';
      t.style.width = '';
    }

    this.toggleClass('vjs-helper-maximized', t);
    return this;
  }

  setAttr(attrName = 'src', attrValue = '', t = this.t) {
    this.t.setAttribute(attrName, attrValue);
    return this;
  }

  setId(id = '', t = this.t) {
    this.t.id = id;
    return this;
  }

  setClass(className = '', t = this.t) {
    this.t.className = className;
    return this;
  }

  addBrowserClass(t = this.t) {
    t.classList.add(this.detectBrowser());
  }

  detectBrowser() {
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

  nextQuerySign(t = this.t) {
    return t.includes('?') ? '&' : '?';
  }

  newEl(tag = 'div') {
    return this.setTarget(document.createElement(tag));
  }

  hasChildren(t = this.t) {
    return t.children.length > 0;
  }

  firstOrDefault(arrayObj = this.t) {
    if (arrayObj.length > 0) {
      return arrayObj[0];
    }

    return null;
  }

  show(displayValue = '', t = this.t) {
    t.style.display = displayValue;
    return this;
  }

  hide(t = this.t) {
    t.style.display = 'none';
    return this;
  }

  hideIn(timeInMs = 0, t = this.t) {
    this.waitFor(timeInMs, 'hide', [t]);
    return this;
  }

  addClass(className, t = this.t) {
    t.classList.add(className);
    return this;
  }

  addClasses(classNames = [], t = this.t) {
    t.classList.add.apply(t.classList, classNames);
    return this;
  }

  addMeta(name = '', content = '', t = this.t) {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    t.appendChild(meta);
  }

  addScriptFile(src = '', onload = () => {}, id = '', t = this.t) {
    const scriptEl = document.createElement('script');
    scriptEl.src = src;
    scriptEl.id = id;
    scriptEl.onload = onload;
    t.appendChild(scriptEl);
  }

  addStyleInline(css = '', t = this.t) {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    t.appendChild(styleEl);
  }

  isScriptLoaded(src = '') {
    return document.querySelectorAll(`[src="${src}"]`).length > 0;
  }

  delayFunc() {
    return function () {
      let timer = null;
      return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
      };
    }();
  }

  removeClass(className, t = this.t) {
    t.classList.remove(className);
    return this;
  }

  toggleClass(className, t = this.t) {
    t.classList.toggle(className);
    return this;
  }

  swapClass(className, className2, t = this.t) {
    this.toggleClass(className, t);
    this.toggleClass(className2, t);
    return this;
  }

  replaceClass(className, className2, t = this.t) {
    t.classList.replace(className, className2);
    return this;
  }

  flagClass(condition = false, className, t = this.t) {
    condition ? t.classList.add(className) : t.classList.remove(className);
    return this;
  }

  hasClass(className, t = this.t) {
    return t.classList.contains(className);
  }
  /* The correct implementation is to use Logical OR assignment (||=) but is not supported on Safari < 14 and generates critical syntax error. */


  hasClasses(classNamesArr = [], t = this.t) {
    return !!classNamesArr.reduce((has, item) => {
      return has |= t.classList.contains(item);
    }, false);
  }

  removeAllChildren(t = this.t) {
    while (t.firstChild) {
      t.removeChild(t.firstChild);
    }

    return this;
  }
  /* Nullable helper method, V(obj).N('maybeUndefinedProperty') equals to obj?.maybeUndefinedProperty */


  N(objPropertyStr, t = this.t) {
    if (!t) {
      return null;
    }

    if (typeof t[objPropertyStr] === 'undefined') {
      return null;
    }

    return t[objPropertyStr];
  }

  sortArrayByProperty(property = '', order = 1, t = this.t) {
    t.sort((a, b) => a[property] > b[property] ? 1 : -1 * order);
  }

  sortArray(order = 1, t = this.t) {
    t.sort((a, b) => a > b ? 1 : -1 * order);
  }

  sortNodeChildsByProperty(property = '', order = 1, t = this.t) {
    [...t.children].sort((a, b) => a[property] > b[property] ? 1 : -1 * order).map(node => t.appendChild(node));
  }

  mutationObserver(actionCallback, {
    observeAttributes = ["class"],
    observeMutationTypes = [],
    observeMultipleMutations = false,
    nativeObserverConfig = {
      attributes: true
    }
  } = {}, t = this.t) {
    const stopObserver = () => {
      observer.disconnect();
    };

    const callback = mutation => {
      actionCallback(mutation, stopObserver);
    };

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (observeAttributes.includes(mutation.attributeName) || observeMutationTypes.includes(mutation.type)) {
          callback(mutation);
          if (!observeMultipleMutations) break;
        }
      }
    });
    observer.observe(t, nativeObserverConfig);
  }

  resizeObserver(onResize, t = this.t) {
    const initialClientRect = t.getBoundingClientRect();
    let lastClientRect = initialClientRect;

    if (typeof ResizeObserver === 'function') {
      const nativeResizeObserver = new ResizeObserver(entries => {
        const clientRect = t.getBoundingClientRect();

        if (lastClientRect.width !== clientRect.width || lastClientRect.height !== clientRect.height) {
          // To avoid false positive on observation start
          lastClientRect = clientRect;
          this.tData = {
            initialClientRect,
            clientRect
          };
          onResize(this);
        }
      });
      nativeResizeObserver.observe(t);
    } else {
      window.addEventListener('resize', () => {
        const clientRect = t.getBoundingClientRect();

        if (lastClientRect.width !== clientRect.width || lastClientRect.height !== clientRect.height) {
          lastClientRect = clientRect;
          this.tData = {
            initialClientRect,
            clientRect
          };
          onResize(this);
        }
      });
    }
  }

  hasAttribute(AttributeName = '', t = this.t) {
    return !(t.getAttribute(AttributeName) == null);
  }

  isVisible(verticalOffset = 0, t = this.t) {
    return this.getVisibilityData(verticalOffset, t).visible;
  }

  isRendered(verticalOffset = 0, t = this.t) {
    return this.getVisibilityData(verticalOffset, t).rendered;
  }

  isElementBound(child, padding, t = this.t) {
    return t.getBoundingClientRect().right >= child.getBoundingClientRect().right + padding; // helper t as parent
  }

  getVisibilityData(verticalOffset = 0, t = this.t) {
    let visible = false;
    let rendered = false;
    const cR = t.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    if (!(cR.height == 0 && cR.width == 0 && cR.top == 0 && cR.left == 0)) {
      rendered = true;
      const vertInView = cR.top - verticalOffset <= windowHeight && cR.top + cR.height + verticalOffset >= 0;
      const horInView = cR.left <= windowWidth && cR.left + cR.width >= 0;
      visible = vertInView && horInView;
    }

    this.tData.rendered = rendered;
    this.tData.visible = visible;
    this.tData.clientRect = cR;
    return this.tData;
  }

  addAnimation(elProperty = 'margin-top', value = '50px', durationInS = 0.5, t = this.t) {
    if (t.style.transition !== '') {
      if (!t.style.transition.includes(elProperty)) {
        t.style.transition += `, ${elProperty} ${durationInS}s`;
      }
    } else {
      t.style.transition = `${elProperty} ${durationInS}s`;
    }

    const hyphen = elProperty.indexOf('-');

    if (hyphen > -1) {
      elProperty = elProperty.substr(0, hyphen) + elProperty.charAt(hyphen + 1).toUpperCase() + elProperty.substr(hyphen + 2, elProperty.length);
    }

    t.style[elProperty] = value;
  }

  dispatchEvent(eventName, t = this.t) {
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

  isPlainObject(t = this.t) {
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

  basicImageLazyLoader(imagedataAttrName = '[data-image-src]', bgImagedataAttrName = '[data-bgimage-src]', t = this.t) {
    const imagesLazyLoad = t.querySelectorAll(imagedataAttrName);
    const bgimagesLazyLoad = t.querySelectorAll(bgImagedataAttrName);
    this.forEach(el => {
      el.src = el.dataset.imageSrc;
    }, imagesLazyLoad);
    this.forEach(el => {
      el.style.backgroundImage = `url("${el.dataset.bgimageSrc}")`;
    }, bgimagesLazyLoad);
  }

  noSourceConsole(logType = 'log', t = this.t) {
    setTimeout(console[logType].bind(console, t));
  }

  console(logType = 'log', t = this.t) {
    console[logType](t);
  }

  getPageHeight() {
    const {
      body
    } = document;
    const html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  }

  makeInmutable(t = this.t) {
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

  onScroll({
    offsetTop = 0,
    top: topCallback,
    down: downCallback,
    up: upCallback,
    disableFlagMode = false
  }, t = this.t) {
    let downFlag = false;
    let lastScroll = 0;

    const setOffsetTop = newOffsetTop => {
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

  getJSONObject(url = '', actions, parameters = {
    url: "",
    dataToSend: null,
    withCredentials: false,
    requestMethod: 'GET',
    enableJson: {
      onResponse: true,
      onSend: false,
      onError: true
    }
  }) {
    parameters.url = url;
    this.AJAX(parameters, actions);
  }

  postJSONObject(url = "", data = {}, actions, parameters = {
    url: "",
    dataToSend: {},
    withCredentials: false,
    requestMethod: 'POST',
    enableJson: {
      onResponse: true,
      onSend: true,
      onError: true
    },
    requestContent: 'json'
  }) {
    parameters.url = url;
    parameters.dataToSend = data;
    this.AJAX(parameters, actions);
  }

  AJAX({
    url = '',
    requestMethod = 'POST',
    withCredentials = false,
    dataToSend = null,
    async = true,
    enableJson = {
      onResponse: false,
      onSend: false,
      onError: false
    },
    requestContent = 'text',
    timeoutError = 10000
  }, actions = {
    onSuccess: callback => {},
    onError: callback => {},
    onOtherStatus: callback => {}
  }) {
    const xhr = new XMLHttpRequest();
    let errorThrown = false;
    let fd = null;
    let dataOutgoing = null;
    let timeout = null;

    if (timeoutError) {
      timeout = setTimeout(() => {
        ajaxHelperObj.xhrStatusCode = 408;
        ajaxHelperObj.errorType = 'TIMEOUT';
        ajaxHelperObj.errorDetails += `Response time exceeded ${timeoutError}ms` + '\n';
        actions.onError(ajaxHelperObj);
        errorThrown = true;
      }, timeoutError);
    }

    const ajaxHelperObj = {
      xhrStatusCode: null,
      xhrResponseText: null,
      errorType: null,
      errorDetails: '',
      response: null
    };

    const handleJson = (value, parse) => {
      try {
        return parse ? JSON.parse(value) : JSON.stringify(value);
      } catch (e) {
        ajaxHelperObj.errorType = 'JSON';
        ajaxHelperObj.errorDetails += `${e}\n`;
      }

      actions.onError(ajaxHelperObj);
      errorThrown = true;
      return null;
    };

    const handleResponse = enableJsonOption => {
      ajaxHelperObj.response = enableJsonOption ? handleJson(ajaxHelperObj.xhrResponseText, true) : ajaxHelperObj.xhrResponseText;
    };

    xhr.open(requestMethod, url, async);

    if (requestMethod === 'POST') {
      requestContent = enableJson.onSend ? 'json' : requestContent;

      switch (requestContent) {
        case 'json':
          xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          dataOutgoing = handleJson(dataToSend, false);
          break;

        case 'form':
          fd = new FormData();

          for (const name in dataToSend) {
            fd.append(name, dataToSend[name]);
          }

          xhr.setRequestHeader('Content-Type', 'multipart/form-data');
          break;

        case 'form-dom-el':
          fd = new FormData(dataToSend);
          xhr.setRequestHeader('Content-Type', 'multipart/form-data');
          break;

        case 'form-urlencoded':
          enableJson.onSend = false;
          const formData = [];

          for (const property in dataToSend) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(dataToSend[property]);
            formData.push(`${encodedKey}=${encodedValue}`);
          }

          dataOutgoing = formData.join('&');
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
          break;

        default:
          xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
          dataOutgoing = dataToSend;
          break;
      }
    }

    xhr.withCredentials = withCredentials;

    xhr.onload = () => {
      ajaxHelperObj.xhrResponseText = xhr.responseText;
      ajaxHelperObj.xhrStatusCode = xhr.status;
      clearTimeout(timeout);

      if (xhr.status >= 200 && xhr.status < 300) {
        handleResponse(enableJson.onResponse);
        actions.onSuccess(ajaxHelperObj);
      } else if (xhr.status >= 400 && xhr.status < 600) {
        handleResponse(enableJson.onError);
        if (!errorThrown) actions.onError(ajaxHelperObj);
      } else {
        actions.onOtherStatus(ajaxHelperObj);
      }
    };

    if (!fd) {
      xhr.send(dataOutgoing);
    } else {
      xhr.send(fd);
    }
  }

  initializeApp(setAsMainApp) {
    console.error("App Architecture extension not found in this JSVanillaHelper (Core) instance");
  }

}
const defaultJSVHInstance = new JSVanillaHelper();
const V = (t = null) => {
  return defaultJSVHInstance.setTarget(t);
};
const V$C = (cN = '') => {
  return defaultJSVHInstance.setTarget(document.getElementsByClassName(cN));
};
const V$I = (id = '') => {
  return defaultJSVHInstance.setTarget(document.getElementById(id));
};
const V$ = (t = null) => {
  return defaultJSVHInstance.setTarget(document.querySelectorAll(t));
};
const _V = (t = null) => {
  return new JSVanillaHelper(t);
};
const _V$ = (t = null) => {
  return new JSVanillaHelper(document.querySelectorAll(t));
};

export { JSVanillaHelper, V, V$, V$C, V$I, _V, _V$, defaultJSVHInstance };
