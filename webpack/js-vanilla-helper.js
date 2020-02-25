export class JSVanillaHelper {

    constructor(target = null, targetData = {}) {
        this.target = target;
        this.targetData = targetData;
        this.versionNumber = 1.15;
        this.version = 'https://github.com/devalexdom/javascript-vanilla-helper || version b' + this.versionNumber;
        this.helperExtensions = new Object();
        this.hexts = this.helperExtensions;
        this.mapHelperFunctions();
    }
    /* Map helper functions with more friendly names */
    mapHelperFunctions() {
        this.newDOMElement = this.newEl;
        this.getHelperTarget = this.get;
    }
    setTarget(target = null, targetData = {}) {
        this.target = target;
        this.targetData = targetData;
        return this;
    }
    toInt(target = this.target) {
        return parseInt(target);
    }
    data(dataObjKey, target = this.target) {
        this.target = this.target.dataset[dataObjKey];
        return this;
    }
    getData(target = this.target) {
        return target.dataset;
    }
    capitalize(target = this.target) {
        return target.charAt(0).toUpperCase() + target.slice(1);
    }
    hideIf(condition, displayValue = '', target = this.target) {
        (condition) ? this.hide(target) : this.show(displayValue, target);
        return this;
    }
    showIf(condition, displayValue = 'block', target = this.target) {
        (!condition) ? this.hide(target) : this.show(displayValue, target);
        return this;
    }
    scrollToTarget(yOffset = 0, behavior = 'smooth', target = this.target){
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: behavior});
    }
    onFalseEmptyString(target = this.target) {
        return (!target) ? '' : target;
    }
    isIterable(target = this.target) {
        return Symbol.iterator in Object(target);
    }
    isDateObj(target = this.target){
        return target instanceof Date && !isNaN(target);
    }
    onEvent(eventName, actionCallback, target = this.target) {
        target.addEventListener(eventName, actionCallback);
        return this;
    }
    onEvents(eventNameArr, actionCallback, target = this.target) {
        this.forEach((eventName) => {
            target.addEventListener(eventName, actionCallback);
        }, eventNameArr);
        return this;
    }
    $$(newScope) {
        newScope(new JSVanillaHelper(this.target, this.targetData));
    }
    get() {
        return this.target;
    }
    log(target = this.target) {
        console.log(target);
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
    forEach(iteration, target = this.target) {
        const iterableLength = target.length;
        let i = 0;
        for (; i < iterableLength; i++) {
            iteration(target[i], i);
        }
        return this;
    }
    whileEach(iteration, target = this.target) {
        const iterableLength = target.length;
        let i = 0, loop = true;
        const stop = () => { loop = false; return target[i]; };
        while (loop && i < iterableLength) {
            iteration(target[i], i, stop);
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
        const newInstance = new JSVanillaHelper(this.target, this.targetData);
        setTimeout(() => { newInstance[helperFunction].apply(newInstance, args) }, timeInMs);
        return this;
    }
    waitThen(timeInMs = 0, timeoutCallback) {
        const newInstance = new JSVanillaHelper(this.target, this.targetData);
        let timeout = setTimeout(() => { timeoutCallback(newInstance) }, timeInMs);
        const clear = () => { clearTimeout(timeout) };
        return { helper: newInstance, clear: clear, timeout: timeout };
    }
    objForEach(iteration, target = this.target) {
        const objKeys = Object.keys(target);
        const iterableLength = objKeys.length;
        let i = 0;
        for (; i < iterableLength; i++) {
            iteration(target[objKeys[i]], objKeys[i], i);
        }
        return this;
    }
    toggleMaximize(target = this.target) {
        if (!this.hasClass('vjs-helper-maximized', target)) {
            target.style.height = window.innerHeight + 'px';
            target.style.width = window.innerWidth + 'px';
        }
        else {
            target.style.height = '';
            target.style.width = '';
        }
        this.toggleClass('vjs-helper-maximized', target);
        return this;
    }
    setAttr(attrName = 'src', attrValue = '', target = this.target) {
        this.target.setAttribute(attrName, attrValue);
        return this;
    }
    setId(id = '', target = this.target) {
        this.target.id = id;
        return this;
    }
    setClass(className = '', target = this.target) {
        this.target.className = className;
        return this;
    }
    nextQuerySign(target = this.target) {
        return target.indexOf("?") > -1 ? "&" : "?";
    }
    ifExists(exist = () => { }, target = this.target) {
        if (target) {
            exist(this);
        }
        return this;
    }
    newEl(tag = 'div') {
        this.setTarget(document.createElement(tag));
        return this;
    }
    hasChildren(target = this.target) {
        return target.children.length > 0;
    }
    getFirstOrDefault(arrayObj = this.target) {
        if (typeof arrayObj[0] !== 'undefined') {
            return arrayObj[0];
        }
        return null;
    }
    show(displayValue = '', target = this.target) {
        target.style.display = displayValue;
        return this;
    }
    hide(target = this.target) {
        target.style.display = 'none';
        return this;
    }
    hideIn(timeInMs = 0, target = this.target) {
        this.waitFor(timeInMs, 'hide', [target]);
        return this;
    }
    addClass(className, target = this.target) {
        target.classList.add(className);
        return this;
    }
    addClasses(classNames = [], target = this.target) {
        target.classList.add.apply(target.classList, classNames);
        return this;
    }
    addScriptFile(src = '', onload = () => { }, id = '', target = this.target) {
        const scriptEl = document.createElement('script');
        scriptEl.src = src;
        scriptEl.id = id;
        scriptEl.onload = onload;
        target.appendChild(scriptEl);
    }
    isScriptLoaded(src = ''){
        return document.querySelectorAll('[src="' + src + '"]').length > 0;
    }
    removeClass(className, target = this.target) {
        target.classList.remove(className);
        return this;
    }
    toggleClass(className, target = this.target) {
        (this.hasClass(className, target))? target.classList.remove(className) : target.classList.add(className);;
        return this;
    }
    swapClass(className, className2, target = this.target) {
        this.toggleClass(className, target);
        this.toggleClass(className2, target);
        return this;
    }
    replaceClass(className, className2, target = this.target) {
        if (this.hasClass(className, target)) {
            target.classList.remove(className);
            target.classList.add(className2);
        }
        return this;
    }
    hasClass(className, target = this.target) {
        return target.classList.contains(className);
    }
    removeAllChildren(target = this.target) {
        while (target.firstChild) { target.removeChild(target.firstChild); }
        return this;
    }
    getClientRect(target = this.target) {
        return target.getBoundingClientRect();
    }
    /* Nullable helper method, V(obj).N('maybeUndefinedProperty') equals to obj?.maybeUndefinedProperty */
    N(objPropertyStr, target = this.target) {
        if (!target) {
            return null;
        }
        if (typeof target[objPropertyStr] === 'undefined') {
            return null;
        }
        return target[objPropertyStr];
    }
    resizeObserver(onResize, target = this.target) {
        const initialClientRect = target.getBoundingClientRect();
        let lastClientRect = initialClientRect;
        if (typeof ResizeObserver === 'function') {
            const nativeResizeObserver = new ResizeObserver(entries => {
                let clientRect = target.getBoundingClientRect();
                if (lastClientRect.width !== clientRect.width
                    || lastClientRect.height !== clientRect.height) {//To avoid false positive on observation start
                    lastClientRect = clientRect;
                    this.targetData =
                    {
                        initialClientRect: initialClientRect,
                        clientRect: clientRect
                    }
                    onResize(this);
                }
            });
            nativeResizeObserver.observe(target);
        }
        else {
            window.addEventListener('resize', function () {
                let clientRect = target.getBoundingClientRect();
                if (lastClientRect.width !== clientRect.width
                    || lastClientRect.height !== clientRect.height) {
                    lastClientRect = clientRect;
                    this.targetData =
                    {
                        initialClientRect: initialClientRect,
                        clientRect: clientRect
                    }
                    onResize(this);
                }
            }.bind(this));
        }
    }
    hasAttribute(AttributeName = '', target = this.target) {
        return !(target.getAttribute(AttributeName) == null);
    }
    isVisible(verticalOffset = 0, target = this.target) {
        return this.getVisibilityData(verticalOffset, target).visible;
    }
    isRendered(verticalOffset = 0, target = this.target) {
        return this.getVisibilityData(verticalOffset, target).rendered;
    }
    isElementBound(child, padding, target = this.target){
        return target.getBoundingClientRect().right >= child.getBoundingClientRect().right + padding; //helper target as parent
    } 
    getVisibilityData(verticalOffset = 0, target = this.target) {
        let visible = false, rendered = false;
        const cR = target.getBoundingClientRect(), docEl = document.documentElement;
        if (!(cR.height == 0 && cR.width == 0 && cR.top == 0 && cR.left == 0)) {
            rendered = true;
            visible = (!!cR
                && cR.bottom >= (0 - (cR.height + verticalOffset))
                && cR.right >= (0 - cR.width)
                && cR.top <= (docEl.clientHeight + (cR.height + verticalOffset))
                && cR.left <= (docEl.clientWidth + cR.width)
            );
        }
        this.targetData =
        {
            rendered: rendered,
            visible: visible,
            clientRect: cR
        }
        return this.targetData;

    }
    addAnimation(elProperty = 'margin-top', value = '50px', durationInS = 0.5, target = this.target) {
        if (target.style.transition !== '') {
            if (target.style.transition.indexOf(elProperty) == -1) {
                target.style.transition += ', ' + elProperty + ' ' + durationInS + 's';
            }
        }
        else {
            target.style.transition = elProperty + ' ' + durationInS + 's';
        }

        const hyphen = elProperty.indexOf('-');
        if (hyphen > -1) {
            elProperty = elProperty.substr(0, hyphen) + elProperty.charAt(hyphen + 1).toUpperCase() + elProperty.substr(hyphen + 2, elProperty.length);
        }
        target.style[elProperty] = value;
    }
    dispatchEvent(eventName, target = this.target) {
        const event = new Event(eventName);
        target.dispatchEvent(event);
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
        d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toGMTString();
        document.cookie = cName + '=' + cValue + '; ' + expires + ';path=/';
    }
    basicImageLazyLoader(imagedataAttrName = '[data-image-src]', bgImagedataAttrName = '[data-bgimage-src]', target = this.target) {
        const imagesLazyLoad = target.querySelectorAll(imagedataAttrName);
        const bgimagesLazyLoad = target.querySelectorAll(bgImagedataAttrName);

        this.forEach((el)=>{el.src = el.dataset.imageSrc;}, imagesLazyLoad);
        this.forEach((el)=>{el.style.backgroundImage = 'url("' + el.dataset.bgimageSrc + '")';}, bgimagesLazyLoad);
    }
    appInitializer(appObj, verbose = false) {
        let initTime = null;
        if (verbose) { initTime = new Date().getTime(); }
        const appObjKeys = Object.keys(appObj);
        const appObjKeysLength = appObjKeys.length;
        let i = 0
        for (; i < appObjKeysLength; i++) {
            let key = appObjKeys[i];
            if (typeof appObj[key]['setParentAppRef'] === 'function') {
                appObj[key].setParentAppRef(appObj);
            }
            if (typeof appObj[key]['onAppInit'] === 'function') {
                if (verbose) { console.log('APP Initializer: '+ key + ' init after ' + (new Date().getTime() - initTime) + ' ms'); }
                appObj[key].onAppInit();
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
    targetToAJAX(url = '', actions, enableJson = { onResponse: true, onSend: true, onError: true }, requestMethod = 'POST', target = this.target) {
        const parameters = { url: url, requestMethod: requestMethod, dataToSend: target, async: true, enableJson: enableJson };
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
                return (parse)? JSON.parse(value) : JSON.stringify(value);
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
        xhr.onload = function () {
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

export const jsVanillaHelperStatic = new JSVanillaHelper();

export const V = function (target = null) {
    jsVanillaHelperStatic.setTarget(target);
    return jsVanillaHelperStatic;
}

export const V$ = function (target = null, defaultQuerySelectorAll) {
    if (typeof target === 'string') {
        let queryValue = document.querySelectorAll(target);
        if (queryValue.length == 1 && !defaultQuerySelectorAll) {
            jsVanillaHelperStatic.setTarget(queryValue[0])
        }
        else if (queryValue.length == 0 && !defaultQuerySelectorAll) {
            jsVanillaHelperStatic.setTarget(null);
        }
        else if (queryValue.length > 1 || defaultQuerySelectorAll) {
            jsVanillaHelperStatic.setTarget(queryValue)
        }
        return jsVanillaHelperStatic;
    }
    jsVanillaHelperStatic.setTarget(target);
    return jsVanillaHelperStatic;
}

export const _V = function (target = null) {
    return new JSVanillaHelper(target)
}

export const _V$ = function (target = null) {
    if (typeof target === 'string') {
        let queryValue = document.querySelectorAll(target);
        if (queryValue.length == 1) {
            return new JSVanillaHelper(queryValue[0]);
        }
        if (queryValue.length == 0) {
            return new JSVanillaHelper(null);
        }
        return new JSVanillaHelper(queryValue);

    }
    return new JSVanillaHelper(target);
}

/* Comment code below to disable JS Vanilla Helper as global scope */

window.V = V;
window.V$ = V$;
window._V = _V;
window._V$ = _V$;