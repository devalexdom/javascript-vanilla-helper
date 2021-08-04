export class JSVanillaHelper {
    constructor(target = null, targetData = {}, helperData = {reg: {}, flags: {}}) {
        this.versionNumber = 1.30;
        this.version = 'https://github.com/devalexdom/javascript-vanilla-helper || version b' + this.versionNumber;
        this.t = target;
        this.tData = targetData;
        this.hData = helperData;
        this.helperExtensions = new Object();
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
        this.t = this.t.dataset[dataObjKey];
        return this;
    }
    getData(t = this.t) {
        return t.dataset;
    }
    capitalize(t = this.t) {
        return t.charAt(0).toUpperCase() + t.slice(1);
    }
    hideIf(condition, displayValue = '', t = this.t) {
        (condition) ? this.hide(t) : this.show(displayValue, t);
        return this;
    }
    showIf(condition, displayValue = 'block', t = this.t) {
        (!condition) ? this.hide(t) : this.show(displayValue, t);
        return this;
    }
    scrollToTarget(yOffset = 0, behavior = 'smooth', t = this.t) {
        const y = t.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: behavior });
    }
    onFalseEmptyString(t = this.t) {
        return (!t) ? '' : t;
    }
    isIterable(t = this.t) {
        return Symbol.iterator in Object(t);
    }
    isDateObj(t = this.t) {
        return t instanceof Date && !isNaN(t);
    }
    onEvent(eventName, actionCallback, t = this.t) {
        t.addEventListener(eventName, actionCallback);
        return this;
    }
    onEvents(eventNameArr, actionCallback, t = this.t) {
        this.forEach((eventName) => {
            t.addEventListener(eventName, actionCallback);
        }, eventNameArr);
        return this;
    }
    $$(newScope) {
        newScope(new JSVanillaHelper(this.t, this.tData));
    }
    get() {
        return this.t;
    }
    log(t = this.t) {
        console.log(t);
        return this;
    }
    addHelperExtension(extensionName, extensionsObj) {
        if (!this.hexts[extensionName]) {
            extensionsObj.helper = this;
            this.hexts[extensionName] = extensionsObj;
        }
        return this;
    }
    removeHelperExtension(extensionName) {
        delete this.hexts[extensionName];
        return this;
    }
    forEach(iteration, t = this.t) {
        const iterableLength = t.length;
        let i = 0;
        for (; i < iterableLength; i++) {
            iteration(t[i], i);
        }
        return this;
    }
    whileEach(iteration, t = this.t) {
        const iterableLength = t.length;
        let i = 0, loop = true;
        const stop = () => { loop = false; return t[i]; };
        while (loop && i < iterableLength) {
            iteration(t[i], i, stop);
            i++;
        }
        return this;
    }
    eachOne(helperFunction = '', args = []) {
        const newInstance = new JSVanillaHelper();
        this.forEach((item) => {
            newInstance.setTarget(item);
            newInstance[helperFunction].apply(newInstance, args);
        });
    }
    waitFor(timeInMs = 0, helperFunction = '', args = []) {
        const newInstance = new JSVanillaHelper(this.t, this.tData);
        setTimeout(() => { newInstance[helperFunction].apply(newInstance, args) }, timeInMs);
        return this;
    }
    waitThen(timeInMs = 0, timeoutCallback) {
        const newInstance = new JSVanillaHelper(this.t, this.tData);
        let timeout = setTimeout(() => { timeoutCallback(newInstance) }, timeInMs);
        const clear = () => { clearTimeout(timeout) };
        return { helper: newInstance, clear: clear, timeout: timeout };
    }
    objForEach(iteration, t = this.t) {
        const objKeys = Object.keys(t);
        const iterableLength = objKeys.length;
        let i = 0;
        for (; i < iterableLength; i++) {
            iteration(t[objKeys[i]], objKeys[i], i);
        }
        return this;
    }
    toggleMaximize(t = this.t) {
        if (!t.classList.contains('vjs-helper-maximized')) {
            t.style.height = window.innerHeight + 'px';
            t.style.width = window.innerWidth + 'px';
        }
        else {
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
    nextQuerySign(t = this.t) {
        return t.indexOf("?") > -1 ? "&" : "?";
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
    addScriptFile(src = '', onload = () => { }, id = '', t = this.t) {
        const scriptEl = document.createElement('script');
        scriptEl.src = src;
        scriptEl.id = id;
        scriptEl.onload = onload;
        t.appendChild(scriptEl);
    }
    isScriptLoaded(src = '') {
        return document.querySelectorAll('[src="' + src + '"]').length > 0;
    }
    removeClass(className, t = this.t) {
        t.classList.remove(className);
        return this;
    }
    toggleClass(className, t = this.t) {
        (t.classList.contains(className)) ? t.classList.remove(className) : t.classList.add(className);;
        return this;
    }
    swapClass(className, className2, t = this.t) {
        this.toggleClass(className, t);
        this.toggleClass(className2, t);
        return this;
    }
    replaceClass(className, className2, t = this.t) {
        if (t.classList.contains(className)) {
            t.classList.remove(className);
            t.classList.add(className2);
        }
        return this;
    }
    hasClass(className, t = this.t) {
        return t.classList.contains(className);
    }
    removeAllChildren(t = this.t) {
        while (t.firstChild) { t.removeChild(t.firstChild); }
        return this;
    }
    getClientRect(t = this.t) {
        return t.getBoundingClientRect();
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
    resizeObserver(onResize, t = this.t) {
        const initialClientRect = t.getBoundingClientRect();
        let lastClientRect = initialClientRect;
        if (typeof ResizeObserver === 'function') {
            const nativeResizeObserver = new ResizeObserver(entries => {
                let clientRect = t.getBoundingClientRect();
                if (lastClientRect.width !== clientRect.width
                    || lastClientRect.height !== clientRect.height) {//To avoid false positive on observation start
                    lastClientRect = clientRect;
                    this.tData =
                    {
                        initialClientRect: initialClientRect,
                        clientRect: clientRect
                    }
                    onResize(this);
                }
            });
            nativeResizeObserver.observe(t);
        }
        else {
            window.addEventListener('resize', function () {
                let clientRect = t.getBoundingClientRect();
                if (lastClientRect.width !== clientRect.width
                    || lastClientRect.height !== clientRect.height) {
                    lastClientRect = clientRect;
                    this.tData =
                    {
                        initialClientRect: initialClientRect,
                        clientRect: clientRect
                    }
                    onResize(this);
                }
            }.bind(this));
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
        return t.getBoundingClientRect().right >= child.getBoundingClientRect().right + padding; //helper t as parent
    }
    getVisibilityData(verticalOffset = 0, t = this.t) {
        let visible = false, rendered = false;
        const cR = t.getBoundingClientRect(), docEl = document.documentElement;
        if (!(cR.height == 0 && cR.width == 0 && cR.top == 0 && cR.left == 0)) {
            rendered = true;
            visible = (!!cR
                && cR.bottom >= (0 - (cR.height + verticalOffset))
                && cR.right >= (0 - cR.width)
                && cR.top <= (docEl.clientHeight + (cR.height + verticalOffset))
                && cR.left <= (docEl.clientWidth + cR.width)
            );
        }

        this.tData.rendered = rendered;
        this.tData.visible = visible;
        this.tData.clientRect = cR;
        
        return this.tData;
    }
    addAnimation(elProperty = 'margin-top', value = '50px', durationInS = 0.5, t = this.t) {
        if (t.style.transition !== '') {
            if (t.style.transition.indexOf(elProperty) == -1) {
                t.style.transition += ', ' + elProperty + ' ' + durationInS + 's';
            }
        }
        else {
            t.style.transition = elProperty + ' ' + durationInS + 's';
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
    }
    isBrowserES6Compatible() {
        try { eval('"use strict"; class appLoaderES6Check {}'); }
        catch (e) { return false; }
        return true;
    }
    getCookie(cName = '') {
        const name = cName + '=';
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
        d.setTargetime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toGMTString();
        document.cookie = cName + '=' + cValue + '; ' + expires + ';path=/';
    }
    basicImageLazyLoader(imagedataAttrName = '[data-image-src]', bgImagedataAttrName = '[data-bgimage-src]', t = this.t) {
        const imagesLazyLoad = t.querySelectorAll(imagedataAttrName);
        const bgimagesLazyLoad = t.querySelectorAll(bgImagedataAttrName);

        this.forEach((el) => { el.src = el.dataset.imageSrc; }, imagesLazyLoad);
        this.forEach((el) => { el.style.backgroundImage = 'url("' + el.dataset.bgimageSrc + '")'; }, bgimagesLazyLoad);
    }
    appInitializer(appComponentsObj, verbose = false) {
        this.hData.flags.appVerboseInit = verbose;
        this.hData.reg.appInitTime = new Date().getTime();
        const appComponentsObjKeys = Object.keys(appComponentsObj);
        const appComponentsObjKeysLength = appComponentsObjKeys.length;
        let i = 0
        for (; i < appComponentsObjKeysLength; i++) {
            const key = appComponentsObjKeys[i];
            if (typeof appComponentsObj[key]['setParentAppRef'] === 'function') {
                appComponentsObj[key].setParentAppRef(appComponentsObj);
            }
            if (typeof appComponentsObj[key]['onAppInit'] === 'function') {
                if (this.hData.flags.appVerboseInit) { console.log('APP Initializer: ' + key + ' [ON APP INIT] after ' + (new Date().getTime() - this.hData.reg.appInitTime) + ' ms'); }
                appComponentsObj[key].onAppInit();
            }
        }
    }
    /* WARNING AJAX HELPERS FUNCTIONALITY IS IN BETA */
    AJAXToString(url = '', onSuccess, onError, onOtherStatus, enableJson = { onResponse: false, onSend: false, onError: false }, requestMethod = 'GET') {
        const parameters = { url: url, requestMethod: requestMethod, dataToSend: null, async: true, enableJson: enableJson };
        this.AJAX(parameters, { onSuccess: onSuccess, onError: onError, onOtherStatus: onOtherStatus });
    }
    getJSONObject(url = '', actions, enableJson = { onResponse: true, onSend: false, onError: true }, requestMethod = 'GET') {
        const parameters = { url, requestMethod, dataToSend: null, async: true, enableJson };
        this.AJAX(parameters, actions);
    }
    targetToAJAX(url = '', actions, enableJson = { onResponse: true, onSend: true, onError: true }, requestMethod = 'POST', t = this.t) {
        const parameters = { url: url, requestMethod: requestMethod, dataToSend: t, async: true, enableJson: enableJson };
        this.AJAX(parameters, actions);
    }
    AJAX(parameters = { url: '', requestMethod: 'POST', dataToSend: null, async: true, enableJson: { onResponse: false, onSend: false, onError: false } }, actions = { onSuccess: () => { }, onError: () => { }, onOtherStatus: () => { } }) {
        const xhr = new XMLHttpRequest();
        xhr.open(parameters.requestMethod, parameters.url, parameters.async);
        const ajaxHelperObj = {
            xhrStatusCode: null,
            xhrResponseText: null,
            errorType: null,
            errorDetails: ''
        }
        const handleJson = (value, parse) => {
            try {
                return (parse) ? JSON.parse(value) : JSON.stringify(value);
            }
            catch (e) {
                ajaxHelperObj.errorType = 'JSON';
                ajaxHelperObj.errorDetails += e + '\n';
            }
            actions.onError(ajaxHelperObj);
            return null;
        }
        const handleResponse = (enableJsonOption) => {
            ajaxHelperObj.response = (enableJsonOption) ? handleJson(ajaxHelperObj.xhrResponseText, true) : ajaxHelperObj.xhrResponseText;
        }
        xhr.onload = () => {
            ajaxHelperObj.xhrResponseText = xhr.responseText;
            ajaxHelperObj.xhrStatusCode = xhr.status;
            if (xhr.status >= 200 && xhr.status < 300) {
                handleResponse(parameters.enableJson.onResponse, ajaxHelperObj);
                actions.onSuccess(ajaxHelperObj);
            }
            else if (xhr.status >= 400 && xhr.status < 600) {
                handleResponse(parameters.enableJson.onError, ajaxHelperObj);
                actions.onError(ajaxHelperObj);
            }
            else {
                actions.onOtherStatus(ajaxHelperObj);
            }

        };
        const dataToSend = (parameters.enableJson.onSend) ? handleJson(parameters.dataToSend, false) : parameters.dataToSend;
        xhr.send(dataToSend);
    }
}

export const v = new JSVanillaHelper();

export const V = (t = null) => {
    return v.setTarget(t);
}

export const V$C = (q = '') => {
    return v.setTarget(document.getElementsByClassName(q));
}

export const V$I = (q = '') => {
    return v.setTarget(document.getElementById(q));
}

export const V$ = (t = null, defaultQuerySelectorAll) => {
    if (typeof t === 'string') {
        const queryValue = document.querySelectorAll(t);
        if (queryValue.length == 1 && !defaultQuerySelectorAll) {
            return v.setTarget(queryValue[0]);
        }
        else if (queryValue.length == 0 && !defaultQuerySelectorAll) {
            return v.setTarget(null);
        }
        else if (queryValue.length > 1 || defaultQuerySelectorAll) {
            return v.setTarget(queryValue);
        }
    }
    return v.setTarget(t);
}

export const _V = (t = null) => {
    return new JSVanillaHelper(t);
}

export const _V$ = (t = null, defaultQuerySelectorAll) => {
    if (typeof t === 'string') {
        const queryValue = document.querySelectorAll(t);
        if (queryValue.length == 1 && !defaultQuerySelectorAll) {
            return new JSVanillaHelper(queryValue[0]);
        }
        else if (queryValue.length == 0 && !defaultQuerySelectorAll) {
            return new JSVanillaHelper(null);
        }
        else if (queryValue.length > 1 || defaultQuerySelectorAll) {
            return new JSVanillaHelper(queryValue);
        }
    }
    return new JSVanillaHelper(t);
}

/* Comment code below to disable JS Vanilla Helper as global scope */

//window.v = v;
window.V = V;
window.V$ = V$;
window.V$C = V$C;
window.V$I = V$I;
window._V = _V;
window._V$ = _V$;
window.JSVanillaHelper = JSVanillaHelper;