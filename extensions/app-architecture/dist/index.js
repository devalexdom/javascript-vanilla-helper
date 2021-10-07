'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsvanillahelperCore = require('jsvanillahelper-core');

class IJSVanillaHelper_Extension { /* To solve temporarily JSVanillaHelper Core v2 TypeScript compatibility */
    constructor() { }
}

class AppArchitecture extends IJSVanillaHelper_Extension {
    constructor() {
        super();
        this.version = 3.937;
        this.extensionName = 'appArchitecture';
        this.parameters = {};
        this.flags = {
            vendorLoader: false,
        };
        this.helper = null;
    }

    onAddExtension() {// this scope == extension
        this.handleExtensionParameters();
    }

    handleExtensionParameters() {
        this.parameters = { ...this.parameters, ...{ eventThrottling: !(this.helper.detectBrowser() === 'firefox') } };
    }

    extendHelperInstance(v) {
        v["initializeApp"] = this.initializeApp.bind(this);
        v["initializeAppModule"] = this.initializeAppModule.bind(
            this
        );
        v["addModularComponentController"] = this.addModularComponentController.bind(
            this
        );
        v["toggleLSDebugModeSetting"] = this.toggleLSDebugModeSetting.bind(this);
        v["isAppInVerbose"] = this.isAppInVerbose;
        v["reportFromComponent"] = this.reportFromComponent;
        v["getMainApp"] = this.getMainApp;
        v["getApp"] = this.getApp;
        v["getAppConfig"] = this.getAppConfig;
        v["getAppComponentRef"] = this.getAppComponent;
        v["getAppComponent"] = this.getAppComponent;
        v["getAppComponentAPI"] = this.getAppComponentAPI;
        v["getServiceAPI"] = this.getAppServiceAPI;
        v["getAPI"] = this.getAppComponentAPI;
        v["getThisAppModuleRef"] = this.getThisAppModuleRef;
        v["getAppModuleRef"] = this.getAppModule;
        v["getAppModule"] = this.getAppModule;
        v["getThisAppModuleConfigRef"] = this.getThisAppModuleConfigRef;
        v["getAppService"] = this.getAppService;
        v["useAppService"] = this.useAppService;
        v["useAppServiceAPI"] = this.useAppServiceAPI;
        v["verboseAppServiceUsage"] = this.verboseAppServiceUsage;
        v["getJsonDataParameterObj"] = this.getJsonDataParameterObj;
        v["onAppInitCompleted"] = this.onAppInitCompleted;
    }

    getAppConfig(configStr = '') {
        const appConfigRef = this.getMainApp().appConfig;
        if (appConfigRef) {
            return this.N(configStr, appConfigRef);
        }
        console.error('The config property is not present in app.');
        return null;
    }

    verboseAppServiceUsage(methodStr, componentRef, serviceRef, completed) {
        if (this.hData.flags.appVerboseInit && componentRef) {
            const getComponentAlias = (componentRef) => {
                if (componentRef.pHelper) {
                    return componentRef.pHelper.componentName;
                }
                return componentRef.componentAlias;
            };
            if (!completed) {
                this.console(
                    'log',
                    `💎⇋⚙️ ${getComponentAlias(
                        componentRef
                    )} is calling ${methodStr} from service ${serviceRef.serviceAlias
                    } after ${new Date().getTime() - this.hData.reg.appInitTime} ms`
                );
            } else {
                this.console(
                    'log',
                    `💎✓⚙️ ${getComponentAlias(
                        componentRef
                    )} call (synchronous) to ${methodStr} from service ${serviceRef.serviceAlias
                    } ended after ${new Date().getTime() - this.hData.reg.appInitTime} ms`
                );
            }
        }
    }

    getAppService(serviceStr = '') {
        const appServicesRef = this.getMainApp().appServices;
        if (appServicesRef) {
            return this.N(serviceStr, appServicesRef);
        }
        console.error(`Service ${serviceStr} not found.`);
        return null;
    }

    /* Deprecated */
    useAppService(serviceStr = '', serviceMethodStr = '', args = [], t = this.t) {
        const appServiceRef = this.getAppService(serviceStr);
        if (appServiceRef) {
            this.verboseAppServiceUsage(serviceMethodStr, t, appServiceRef);
            const result = appServiceRef[serviceMethodStr].apply(appServiceRef, args);
            this.verboseAppServiceUsage(serviceMethodStr, t, appServiceRef, true);
            return result;
        }
        console.error(`Service ${serviceStr} not found.`);
        return null;
    }

    useAppServiceAPI(serviceStr = '', serviceMethodStr = '', args = [], t = this.t) {
        const appServiceRef = this.getAppService(serviceStr);
        if (appServiceRef && appServiceRef["api"]) {
            const serviceApiMethod = appServiceRef.api[serviceMethodStr];
            if (serviceApiMethod) {
                this.verboseAppServiceUsage(serviceMethodStr, t, appServiceRef);
                const result = serviceApiMethod.apply(appServiceRef, args);
                this.verboseAppServiceUsage(serviceMethodStr, t, appServiceRef, true);
                return result;
            }
            console.error(`Service ${serviceStr} API has no method "${serviceMethodStr}" implemented yet"`);
        }
        console.error(`Service ${serviceStr} API not found.`);
        return null;
    }

    getMainApp() {
        return this.hData.reg.mainAppRef;
    }

    getApp(appUniqueId) {
        return this.hData.reg.appsRef[appUniqueId];
    }

    onAppInitCompleted(callback) {
        window.addEventListener('vanilla-app-init-completed', callback);
    }

    getJsonDataParameterObj(
        datasetKey = '',
        defaultObj = {},
        isRequired = false,
        instanceComponent = {},
        extraRequiredMessage = '',
        t = this.t
    ) {
        try {
            if (!t.dataset[datasetKey] && isRequired) {
                this.reportFromComponent(
                    'error',
                    `Dataset property "${datasetKey}" is a required parameter${extraRequiredMessage}`,
                    null,
                    instanceComponent
                );
                return defaultObj;
            } if (!t.dataset[datasetKey] && !isRequired) {
                return defaultObj;
            }
            return JSON.parse(t.dataset[datasetKey]);
        } catch (e) {
            this.reportFromComponent(
                'error',
                `Error getting dataset property "${datasetKey}"`,
                e,
                instanceComponent
            );
            return defaultObj;
        }
    }

    getAppComponent(componentStr = '') {
        const appComponentRef = this.getMainApp().appComponents;
        return this.N(componentStr, appComponentRef);
    }

    getAppComponentAPI(componentStr = '',) {
        const appComponentRef = this.getMainApp().appComponents;
        const componentRef = this.N(componentStr, appComponentRef);
        if (!componentRef) {
            console.error(`App component "${componentStr}" not found`);
            return {};
        }
        if (componentRef.api) {
            return componentRef.api;
        }

        console.error(`App component "${componentStr}" has no API`);
        return {};

    }

    getAppServiceAPI(serviceStr = '',) {
        const appServicesRef = this.getMainApp().appServices;
        const serviceRef = this.N(serviceStr, appServicesRef);
        if (!serviceRef) {
            console.error(`Service "${serviceStr}" not found`);
            return {};
        }
        if (serviceRef.api) {
            return serviceRef.api;
        }

        console.error(`Service "${serviceStr}" has no API`);
        return {};

    }

    getThisAppModuleRef(t = this.t) {
        return this.N('appModuleRef', t);
    }

    getAppModule(componentStr = '') {
        return this.N(componentStr, this.getMainApp().appModules);
    }

    getThisAppModuleConfigRef(t = this.t) {
        return this.N('moduleConfig', this.N('appModuleRef', t));
    }

    isAppInVerbose() {
        return this.hData.flags.appVerboseInit;
    }

    dispatchChangesTickEvent() {
        window.dispatchEvent(new Event('phelpertick'));
    }

    dispatchAppInitCompletedEvent() {
        window.dispatchEvent(new Event('vanilla-app-init-completed'));
    }

    dispatchAppPreInitEvent() {
        window.dispatchEvent(new Event('vanilla-app-pre-init'));
    }

    init() {
        this.helper.setTarget(window).onEvent('scroll', () => {
            this.scrollEventThrottling();
        });
    }

    scrollEventThrottling() {
        if (window.pageYOffset % 4 == 0 || !this.parameters.eventThrottling) {
            this.dispatchChangesTickEvent();
        }
    }

    asyncComponentInit(appComponentObj) {
        if (typeof appComponentObj.onAsyncViewportInit === 'function') {
            appComponentObj.cPerformanceInit(appComponentObj.onAsyncViewportInit());
        }
    }

    getVerboseSymbolStr(initObjectStr) {
        switch (initObjectStr) {
            case 'MODULE':
                return '📦';
            case 'COMPONENT':
                return ' 💎';
            case 'SERVICE':
                return '⚙️';
        }
        return '--';
    }

    handleVerboseAjaxRequests() {
        const { helper } = this;
        const nativeOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            try {
                const url = new URL(arguments[1]);
                helper.console(
                    'log',
                    `\t📡 ${arguments[0]} -> ${url.origin}${url.pathname} after ${new Date().getTime() - helper.hData.reg.appInitTime
                    } ms`
                );
                let getParameters = '';
                for (const pair of url.searchParams.entries()) {
                    getParameters += `[${pair[0]}: ${pair[1]}] `;
                }
                if (getParameters) {
                    helper.console('log', `\t   Parameters: ${getParameters}`);
                }
            } catch (e) {
                helper.console(
                    'log',
                    `\t📡 ${arguments[0]} -> ${arguments[1]} after ${new Date().getTime() - helper.hData.reg.appInitTime
                    } ms`
                );
            }
            nativeOpen.apply(this, arguments);
        };
    }

    verboseAppInitFeedback(
        initTypeStr = '[ON APP INIT]',
        initFeedback = true,
        initObjectNameStr = 'unknow',
        initObjectStr = 'COMPONENT'
    ) {
        if (initFeedback && this.helper.hData.flags.appVerboseInit) {
            this.helper.console(
                'log',
                `${this.getVerboseSymbolStr(
                    initObjectStr
                )} ${initObjectStr}: ${initObjectNameStr} ${initTypeStr} after ${new Date().getTime() - this.helper.hData.reg.appInitTime
                } ms`
            );
        }
    }

    verboseAppInitCompleted() {
        if (this.helper.hData.flags.appVerboseInit) {
            this.helper.console(
                'log',
                `  ↳ completed after ${new Date().getTime() - this.helper.hData.reg.appInitTime
                } ms`
            );
        }
    }

    addModularComponentController(componentRef, uniqueId) {
        const { helper } = this;
        const { mainAppRef } = helper.hData.reg;
        componentRef.mainAppRef = mainAppRef;
        componentRef.appComponentsRef = mainAppRef.appComponents;
        mainAppRef.appComponents[uniqueId] = componentRef;

        if (this.helper.hData.flags.appVerboseInit) {
            this.helper.console(
                'log',
                `➕💎 MODULAR COMPONENT ${uniqueId} added to main app`
            );
        }
    }

    handleVendorJSLoad(mainAppRef) {
        const vendorConfig = this.helper.getAppConfig('vendors', { mainAppRef });
        if (vendorConfig) {
            mainAppRef.appComponents.jsVendorLoader = new JSVendorLoader(
                vendorConfig
            );
            this.flags.vendorLoader = true;
        }
    }

    reportFromComponent(
        reportType = 'error',
        description = '',
        stack,
        t = this.t
    ) {
        const reportComponentInstanceError = (
            DOMComponent,
            reportType,
            message
        ) => {
            const visibleFeedback = (DOMComponent) => {
                if (this.hData.flags.appDebug && reportType === 'error') {
                    DOMComponent.style.opacity = 0.6;
                    DOMComponent.style.filter = 'grayscale(100%)';
                    DOMComponent.prepend('⚠️');
                } else if (this.hData.flags.appDebug && reportType === 'warn') {
                    DOMComponent.prepend('⚠️');
                }
            };
            this.console(
                reportType,
                `⚠️ DOM instance component "${DOMComponent.id}" reported an ${reportType}`
            );
            this.console(reportType, DOMComponent);
            this.console(reportType, message);
            visibleFeedback(DOMComponent);
        };

        if (t.domEls && t.domEls.main) {
            reportComponentInstanceError(t.domEls.main, reportType, description);
        } else {
            this.console(
                reportType,
                `⚠️ Unknow component reported an ${reportType}`
            );
            this.console(reportType, description);
        }
        if (stack) {
            this.console(reportType, stack);
        }
    }

    reportInlineInitError(DOMComponent, error) {
        const visibleErrorFeedback = (DOMComponent) => {
            if (this.helper.hData.flags.appDebug) {
                DOMComponent.style.opacity = 0.6;
                DOMComponent.style.filter = 'grayscale(100%)';
                DOMComponent.prepend('⚠️');
            } else {
                DOMComponent.style.pointerEvents = 'none';
            }
        };
        this.helper.console(
            'error',
            `🤕 An unhandled error happened in the inline init of DOM instance component "${(DOMComponent.id) ? DOMComponent.id : "-NO ID-"}"`
        );
        this.helper.console('error', DOMComponent);
        this.helper.console(
            'error',
            error || 'Controller not found in main app'
        );
        visibleErrorFeedback(DOMComponent);
    };

    handleInlineInit_v4(mainAppRef) {
        const { helper } = this;
        const domInstanceComponents = document.querySelectorAll(
            '[jsvh-controller]'
        );

        const handleInitHook = (DOMComponent, controller) => {
            switch (DOMComponent.getAttribute("jsvh-init-hook")) {
                case "viewport-visible":
                    controller.handleInlineOnViewportInit(DOMComponent);
                    break;
                case "app-ready":
                    this.reportInlineInitError(DOMComponent, `app-ready init hook is only supported on App Architecture v4.x or higher`);
                    break;

                default:
                    controller.handleInlineOnAppInit(DOMComponent);
                    break;
            }
        };

        helper.forEach((DOMComponent) => {
            const controllerAlias = DOMComponent.getAttribute("jsvh-controller");
            const modularComponentSrc = DOMComponent.getAttribute("data-modular-component-src");

            try {
                const controller = mainAppRef.appComponents[controllerAlias];
                if (!controller && !modularComponentSrc) {
                    this.reportInlineInitError(DOMComponent);
                    return;
                }
                if (!controller && modularComponentSrc) {
                    helper.addScriptFile(
                        modularComponentSrc,
                        () => {
                            const modularController =
                                mainAppRef.appComponents[controllerAlias];
                            if (!modularController) {
                                this.reportInlineInitError(DOMComponent);
                                return;
                            }
                            handleInitHook(DOMComponent, modularController);
                        },
                        `${controllerAlias}-script`,
                        document.head
                    );
                } else {
                    handleInitHook(DOMComponent, controller);
                }
            } catch (error) {
                this.reportInlineInitError(DOMComponent, error);
            }
        }, domInstanceComponents);
    }

    handleInlineInit(mainAppRef) {
        const { helper } = this;
        const domInstanceComponents = document.querySelectorAll(
            '[data-onapp-init-v-controller], [data-onviewport-init-v-controller]'
        );

        helper.forEach((DOMComponent) => {
            const controllerAlias = DOMComponent.getAttribute("data-onapp-init-v-controller") || DOMComponent.getAttribute("data-onviewport-init-v-controller");
            const modularComponentSrc = DOMComponent.getAttribute("data-modular-component-src");

            try {
                const controller = mainAppRef.appComponents[controllerAlias];
                if (!controller && !modularComponentSrc) {
                    this.reportInlineInitError(DOMComponent);
                    return;
                }
                if (!controller && modularComponentSrc) {
                    helper.addScriptFile(
                        modularComponentSrc,
                        () => {
                            const modularController =
                                mainAppRef.appComponents[controllerAlias];
                            if (!modularController) {
                                this.reportInlineInitError(DOMComponent);
                                return;
                            }
                            if (DOMComponent.getAttribute("data-onviewport-init-v-controller")) {
                                modularController.handleInlineOnViewportInit(DOMComponent);
                            }
                            else {
                                modularController.handleInlineOnAppInit(DOMComponent);
                            }
                        },
                        `${controllerAlias}-script`,
                        document.head
                    );
                } else {
                    if (DOMComponent.getAttribute("data-onviewport-init-v-controller")) {
                        controller.handleInlineOnViewportInit(DOMComponent);
                    }
                    else {
                        controller.handleInlineOnAppInit(DOMComponent);
                    }
                }
            } catch (error) {
                this.reportInlineInitError(DOMComponent, error);
            }
        }, domInstanceComponents);
    }

    toggleLSDebugModeSetting() {
        const debugMode = !this.getFromLSDebugModeSetting();
        if (debugMode) {
            localStorage.setItem('jsVanillaHelperAppArchitectureDebug', 'true');
        }
        else {
            localStorage.removeItem('jsVanillaHelperAppArchitectureDebug');
        }
        this.helper.console(
            'log',
            `🧯 JSVanillaHelper App debug mode set to ${debugMode}, refresh website.`
        );
    }

    getFromLSDebugModeSetting() {
        return !(!localStorage.getItem('jsVanillaHelperAppArchitectureDebug'));
    }

    initializeApp(setAsMainApp = true) {
        /* Variable t equals to main app reference */
        const { helper } = this;
        const t = helper.t;

        if (!helper.isPlainObject(t)) {
            console.error('Target is not a valid Object');
            return;
        }
        if (!t.appConfig || !t.appModules) {
            console.error(
                `Cannot find appConfig/appComponents property, please check if app structure is suitable for JSVanillaHelper App Architecture ${this.version} .`
            );
            return;
        }
        if (!t.appId) {
            console.error(
                `Cannot find appId property, please check if app structure is suitable for JSVanillaHelper App Architecture ${this.version} .`
            );
            return;
        }
        t.appComponents = {};
        helper.makeInmutable(t.appConfig);
        const debugMode = this.getFromLSDebugModeSetting();
        helper.hData.flags.appVerboseInit = t.appConfig.initAppInVerboseMode || debugMode;
        helper.hData.flags.appDebug = t.appConfig.appInDebugMode || debugMode;
        if (helper.hData.flags.appVerboseInit) {
            console.log(
                `JSVanillaHelper APP Architecture ${this.version} is in verbose${helper.hData.flags.appDebug ? ' & debug' : ''
                } mode 🧯`
            );
            console.log(`💽 ${t.appId.alias} | Unique ID [${t.appId.uniqueId}]  | Build Number [${t.appId.buildNumber}]`);
            console.log(' ▼ Components init sequence and logs ▼');

            if (helper.hData.flags.appDebug) this.handleVerboseAjaxRequests();
        }
        helper.hData.reg.appInitTime = new Date().getTime();
        helper.hData.reg.appsRef[t.appId.uniqueId] = t;
        if (setAsMainApp) {
            helper.hData.reg.mainAppRef = t;
        }
        this.dispatchAppPreInitEvent();
        const checkModuleInitCond = (moduleRef) => {
            moduleRef.moduleDOMElements = [];
            if (moduleRef.initByDefault) {
                return true;
            }
            if (moduleRef.initByTriggerDOMClass) {
                moduleRef.moduleDOMElements = document.getElementsByClassName(
                    moduleRef.initByTriggerDOMClass
                );
            }
            return moduleRef.moduleDOMElements.length > 0;
        };

        const initModuleAppComponents = (moduleKeyName) => {
            const moduleRef = t.appModules[moduleKeyName];
            if (moduleRef.moduleConfig) {
                helper.makeInmutable(moduleRef.moduleConfig);
            }
            const appComponentsObj = moduleRef.moduleComponents;
            const appComponentsObjKeys = Object.keys(appComponentsObj);
            const appComponentsObjKeysLength = appComponentsObjKeys.length;
            const moduleInitCond = checkModuleInitCond(moduleRef);
            let i = 0;
            if (moduleInitCond) {
                const initType = !moduleRef.initByDefault
                    ? '[TRIGGERED BY DOM CLASS]'
                    : '[INIT BY DEFAULT]';
                this.verboseAppInitFeedback(initType, true, moduleKeyName, 'MODULE');
            }
            for (; i < appComponentsObjKeysLength; i++) {
                const key = appComponentsObjKeys[i];
                appComponentsObj[key].mainAppRef = t;
                appComponentsObj[key].appComponentsRef = t.appComponents;
                appComponentsObj[key].appModuleRef = moduleRef;
                t.appComponents[key] = appComponentsObj[key];
                if (!appComponentsObj[key].componentAlias) {
                    appComponentsObj[key].componentAlias = key;
                }
                if (!appComponentsObj[key].domEls) {
                    appComponentsObj[key].domEls = {};
                }
                if (typeof appComponentsObj[key].onAppInit === 'function') {
                    this.verboseAppInitFeedback('[ON APP INIT]', true, key);
                    appComponentsObj[key].onAppInit();
                    this.verboseAppInitCompleted();
                }
                if (
                    typeof appComponentsObj[key].onModuleInit === 'function' &&
                    moduleInitCond
                ) {
                    this.verboseAppInitFeedback('[ON MODULE INIT]', true, key);
                    appComponentsObj[key].onModuleInit();
                    this.verboseAppInitCompleted();
                }
                if (typeof appComponentsObj[key].onViewportInit === 'function') {
                    appComponentsObj[key].cPerformanceInit(
                        appComponentsObj[key].onViewportInit(),
                        key
                    );
                }
            }
        };
        this.handleVendorJSLoad(t);
        this.initializeAppServices(t);
        let i = 0;
        const modulesObjKeys = Object.keys(t.appModules);
        const modulesObjLength = modulesObjKeys.length;
        for (; i < modulesObjLength; i++) {
            initModuleAppComponents(modulesObjKeys[i]);
        }
        t.appConfig.earlyArchitectureV4Support ? this.handleInlineInit_v4(t) : this.handleInlineInit(t);
        this.init();
        this.handleAppReadyCallback(t);
        this.dispatchAppInitCompletedEvent();
        this.dispatchChangesTickEvent();
    }

    initializeAppModule(t = t.this) {
        if (!this.helper.isPlainObject(t)) {
            console.error('Target is not a valid Object');
            return;
        }
        const appComponentsObj = t.moduleComponents;
        const appComponentsObjKeys = Object.keys(appComponentsObj);
        const appComponentsObjKeysLength = appComponentsObjKeys.length;
        let i = 0;
        for (; i < appComponentsObjKeysLength; i++) {
            const key = appComponentsObjKeys[i];
            appComponentsObj[key].componentAlias = key;
            if (typeof appComponentsObj[key].onModuleInit === 'function') {
                this.verboseAppInitFeedback('[ON MODULE INIT]', true);
                appComponentsObj[key].onModuleInit();
            }
        }
    }

    initializeAppServices(mainAppRef, appReadyCallback) {
        if (!this.helper.isPlainObject(mainAppRef.appServices)) {
            return;
        }
        const appServicesObj = mainAppRef.appServices;
        const appServicesObjKeys = Object.keys(appServicesObj);
        const appServicesObjKeysLength = appServicesObjKeys.length;
        let initFunctionAlias = "onAppInit";
        let initFunctionVerboseLog = "[ON APP INIT]";
        if (appReadyCallback) {
            initFunctionAlias = "onAppReady";
            initFunctionVerboseLog = "[ON APP READY]";
        }

        let i = 0;
        for (; i < appServicesObjKeysLength; i++) {
            const key = appServicesObjKeys[i];
            if (typeof appServicesObj[key][initFunctionAlias] === 'function') {
                this.verboseAppInitFeedback(initFunctionVerboseLog, true, key, 'SERVICE');
                appServicesObj[key].serviceAlias = key;
                appServicesObj[key][initFunctionAlias]();
                this.verboseAppInitCompleted();
            }
        }
    }

    handleAppReadyCallback(mainAppRef) {
        const { appComponents } = mainAppRef;
        const appComponentsKeys = Object.keys(appComponents);

        appComponentsKeys.forEach((appComponentKey) => {
            if (typeof appComponents[appComponentKey].onAppReady === "function") {
                appComponents[appComponentKey].onAppReady();
                if (this.helper.hData.flags.appVerboseInit) {
                    this.helper.console('log', `💎 COMPONENT: ${appComponentKey} [ON APP READY] after ${(new Date().getTime() - this.helper.hData.reg.appInitTime)} ms`);
                }
            }
        });
    }
}

class JSVendorLoader {
    constructor(vendorConfig) {
        this.vendorArray = this.getMutableConfig(vendorConfig);
        this.init();
    }

    init() {
        V(this.vendorArray).forEach((vendor) => {
            this.handleVendorLoad(vendor);
        });
    }

    getMutableConfig(inmutableVendorConfig) {
        const vendorConfig = [...inmutableVendorConfig];
        return vendorConfig.map((x) => ({ ...x }));
    }

    requestVendorLoad(triggerClass = '', loadCallback = () => { }) {
        V(this.vendorArray).forEach((vendor) => {
            if (vendor.triggerClass === triggerClass && !vendor.loaded) {
                vendor.requested = true;
                this.handleVendorLoad(vendor);
                V(window).onEvent(vendor.loadEventName, loadCallback);
            } else if (vendor.triggerClass === triggerClass && vendor.loaded) {
                loadCallback();
            }
        });
    }

    isVendorConflicted(vendor) {
        let conflict = false;
        V(vendor.conflictTriggerClass).forEach((triggerClass) => {
            conflict |= !V$C(triggerClass).isZeroLength();
        });
        return conflict;
    }

    handleVendorLoad(vendor) {
        if (!this.isVendorConflicted(vendor)) {
            if (!V$C(vendor.triggerClass).isZeroLength() || vendor.requested) {
                const onLoadFunc = () => {
                    const helper = jsvanillahelperCore.defaultHelperInstance;
                    if (helper.hData.flags.appVerboseInit) {
                        const loadMode = vendor.requested
                            ? ' [LOADED BY REQUEST]'
                            : ' [LOADED BY TRIGGERCLASS]';
                        helper.console(
                            'log',
                            `🧱 VENDOR: ${vendor.scriptPath}${loadMode} after ${new Date().getTime() - helper.hData.reg.appInitTime
                            } ms`
                        );
                    }
                    V(window).dispatchEvent(vendor.loadEventName);
                    vendor.loaded = true;
                };
                if (!V$I(`${vendor.triggerClass}-script`).get()) {
                    V(document.head).addScriptFile(
                        vendor.scriptPath,
                        onLoadFunc,
                        `${vendor.triggerClass}-script`
                    );
                }
            }
        }
    }
}

class JSVanillaScrollLazyLoadHelper {
    constructor() {
        this.pHelper = {// Performance helper var object
            status: {
                isInDOM: false,
                isRendered: false,
                isVisible: false
            },
            visibleRange: {
                start: null,
                end: null
            },
            verticalOffset: 300,
            version: 2.0
        };
    }

    initListeners() {
        this.pHelper.tickCallbackFunc = this.changesTickHandler.bind(this);
        this.pHelper.resizeCallbackFunc = this.resizeHandler.bind(this);
        window.addEventListener('phelpertick', this.pHelper.tickCallbackFunc, true);
        window.addEventListener('resize', this.pHelper.resizeCallbackFunc, true);
    }

    resizeHandler() {
        this.realTimeVisibility = true;
        this.checkVisibility();
    }

    changesTickHandler() {
        this.checkVisibility();
    }

    detachListeners() {
        window.removeEventListener('phelpertick', this.pHelper.tickCallbackFunc, true);
        window.removeEventListener('resize', this.pHelper.resizeCallbackFunc, true);
    }

    checkVerticalVisibility(el) {
        const { verticalOffset } = this.pHelper;
        const cR = el.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        return (cR.top - verticalOffset <= windowHeight) && ((cR.top + cR.height + verticalOffset) >= 0);
    }
}

class AppComponentController extends JSVanillaScrollLazyLoadHelper {
    constructor() {
        super();
        /* JSVanillaHelper App Architecture 3.7, AppComponentController 3.81 */
        this.componentInstances = {};
        this.componentInstancesCount = 0;
    }

    initComponent(domElement) {
        const componentInstance = this.handleNewInstance(domElement);
        componentInstance.init();
        return componentInstance;
    }

    initNewInstance(domElement, customInitMessage) {
        return this.handleInlineOnAppInit(domElement, customInitMessage);
    }

    addComponentInstance(componentObj) {
        const id = (componentObj.domEls.main.id) ? componentObj.domEls.main.id : `${this.componentAlias}-${this.componentInstancesCount}`;
        if (this.componentInstances[id]) {
            console.error(`Component with id ${id} already exist!`);
            console.error(componentObj.DOMElement);
            return;
        }
        componentObj.domEls.main.id = id;
        componentObj.domEls.main.appComponentInstance = componentObj;
        componentObj.instanceController = this;
        this.componentInstances[id] = componentObj;
        this.componentInstancesCount++;
    }

    handleNewInstance(domElement) {
        const newInstance = this.newComponentInstance(domElement);
        if (!newInstance.domEls) {
            newInstance.domEls = { main: domElement };
        }
        else {
            newInstance.domEls.main = domElement;
        }
        this.addComponentInstance(newInstance);
        return newInstance;
    }

    handleInlineOnAppInit(domElement, customInitMessage = "") {
        const newInstance = this.handleNewInstance(domElement);
        const vendorDependency = domElement.getAttribute("jsvh-vendor-dependency") || domElement.dataset.vendorDependency;
        this.pHelper.componentName = domElement.id;
        const initializedInit = () => { console.error(`Component ${this.pHelper.componentName} already initialized`); };
        const instanceOnAppInitProcedure = () => {
            this.verboseOnAppInitFeedback(this.pHelper.componentName, customInitMessage);
            if (!newInstance.componentAlias) {
                newInstance.componentAlias = this.pHelper.componentName;
            }
            if (typeof newInstance.onAppInit === 'function') {
                newInstance.onAppInit();
                newInstance.onAppInit = initializedInit;
            }
            newInstance.init();
            newInstance.init = initializedInit;
            this.verboseCompletedFeedback();
        };
        if (vendorDependency) {
            const vendorLoader = this.mainAppRef.appComponents.jsVendorLoader;
            if (!vendorLoader) {
                console.error('Vendor loader is not present or not configured');
                return;
            }
            vendorLoader.requestVendorLoad(vendorDependency, instanceOnAppInitProcedure);
        }
        else {
            instanceOnAppInitProcedure();
        }
        return newInstance;
    }

    handleInlineOnViewportInit(domElement) {
        const vendorLoader = this.mainAppRef.appComponents.jsVendorLoader;
        const onViewportDetectionOffset = (domElement.dataset.onviewportDetectionOffset) ? parseInt(domElement.dataset.onviewportDetectionOffset) : 300;
        new OnViewportInstanceInit(this.handleNewInstance(domElement), vendorLoader, onViewportDetectionOffset, true);
    }

    getInstance(instanceId) {
        return this.componentInstances[instanceId];
    }

    destroyInstance(instanceId) {
        if (typeof this.componentInstances[instanceId].destroy === 'function') {
            this.componentInstances[instanceId].destroy();
        }
        else {
            console.error(`Component ${instanceId} have no destroy method implemented`);
        }
    }

    verboseOnAppInitFeedback(initObjectNameStr = 'unknow', customInitMessage) {
        const helper = jsvanillahelperCore.defaultHelperInstance;
        if (helper.hData.flags.appVerboseInit) {
            if (customInitMessage) {
                helper.console('log', customInitMessage.replace("%id%", initObjectNameStr));
            }
            else {
                helper.console('log', `💎⚡️ DOM INSTANCE COMPONENT: ${initObjectNameStr} [ON APP INLINE INIT] after ${(new Date().getTime() - helper.hData.reg.appInitTime)} ms`);
            }
        }
    }

    verboseCompletedFeedback() {
        const helper = jsvanillahelperCore.defaultHelperInstance;
        if (helper.hData.flags.appVerboseInit) {
            helper.console('log', ` ↳ completed after ${(new Date().getTime() - helper.hData.reg.appInitTime)} ms`);
        }
    }
}

// Allow the creation of controllers outsite Webpack
window.AppComponentController = AppComponentController;

class OnViewportInstanceInit extends JSVanillaScrollLazyLoadHelper {
    constructor(componentInstance, vendorLoader, onViewportDetectionOffset, trackNonRendered = false) {
        super();
        this.componentInstance = componentInstance;
        this.pHelper.componentDOMEl = componentInstance.domEls.main;
        this.pHelper.componentName = this.pHelper.componentDOMEl.id;
        if (!this.componentInstance.componentAlias) {
            this.componentInstance.componentAlias = this.pHelper.componentName;
        }
        this.vendorLoader = vendorLoader;
        this.pHelper.verticalOffset = onViewportDetectionOffset;
        this.pHelper.trackNonRendered = trackNonRendered;
        this.init();
    }

    initComponentInstance(lazy) {
        const vendorDependency = this.pHelper.componentDOMEl.getAttribute("jsvh-vendor-dependency") || this.pHelper.componentDOMEl.dataset.vendorDependency;
        const initializedInit = () => { console.error(`Component ${this.pHelper.componentName} already initialized`); };
        if (vendorDependency) {
            if (!this.vendorLoader) {
                console.error('Vendor loader is not present or not configured');
                return;
            }
            this.vendorLoader.requestVendorLoad(vendorDependency, () => {
                this.verboseAppInitFeedback(this.pHelper.componentName, lazy);
                this.componentInstance.init();
                this.componentInstance.init = initializedInit;
                this.verboseCompletedFeedback();
                setTimeout(() => {
                    window.dispatchEvent(new Event('phelpertick'));
                }, 100);
            });
        }
        else {
            this.verboseAppInitFeedback(this.pHelper.componentName, lazy);
            this.componentInstance.init();
            this.componentInstance.init = initializedInit;
            this.verboseCompletedFeedback();
            setTimeout(() => {
                window.dispatchEvent(new Event('phelpertick'));
            }, 100);
        }
    }

    verboseCompletedFeedback() {
        const helper = jsvanillahelperCore.defaultHelperInstance;
        if (helper.hData.flags.appVerboseInit) {
            helper.console('log', ` ↳ completed after ${(new Date().getTime() - helper.hData.reg.appInitTime)} ms`);
        }
    }

    init() {
        if (typeof this.componentInstance.onAppInit === 'function') {
            this.verboseAppInitFeedback(this.pHelper.componentName, false, true);
            this.componentInstance.onAppInit();
        }
        this.pHelper.lastVisibilityData = V(this.pHelper.componentDOMEl).getVisibilityData(this.pHelper.verticalOffset);
        this.pHelper.status = {
            isInDOM: true,
            isRendered: this.pHelper.lastVisibilityData.rendered,
            isVisible: this.pHelper.lastVisibilityData.visible
        };

        if (this.pHelper.status.isVisible) {
            this.initComponentInstance(false);
            return;
        }
        if (this.pHelper.status.isRendered || this.pHelper.trackNonRendered) {
            this.initListeners();
        }
    }

    checkVisibility() {
        this.pHelper.lastVisibilityData.visible = this.checkVerticalVisibility(this.pHelper.componentDOMEl);
        if (this.pHelper.lastVisibilityData.visible) {
            this.detachListeners();
            this.initComponentInstance(true);
        }
    }

    verboseAppInitFeedback(initObjectNameStr = 'unknow', lazyInit = false, partiallyInit = false) {
        const helper = jsvanillahelperCore.defaultHelperInstance;
        if (helper.hData.flags.appVerboseInit) {
            if (!partiallyInit) {
                const lazyStr = (lazyInit) ? ' LAZY' : '';
                helper.console('log', `💎⚡️ DOM INSTANCE COMPONENT: ${initObjectNameStr} [ON VIEWPORT${lazyStr} INLINE INIT] after ${(new Date().getTime() - helper.hData.reg.appInitTime)} ms`);
            }
            else {
                helper.console('log', `💎☁️ DOM INSTANCE COMPONENT: ${initObjectNameStr} [ON APP INIT (PARTIAL COMPONENT INIT)] after ${(new Date().getTime() - helper.hData.reg.appInitTime)} ms`);
            }
        }
    }
}

exports.AppArchitecture = AppArchitecture;
exports.AppComponentController = AppComponentController;
exports.JSVanillaScrollLazyLoadHelper = JSVanillaScrollLazyLoadHelper;
exports.JSVendorLoader = JSVendorLoader;
exports.OnViewportInstanceInit = OnViewportInstanceInit;
