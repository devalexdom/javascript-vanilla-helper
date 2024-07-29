import { JSVanillaHelper, IJSVanillaHelper_Extension } from "jsvanillahelper-core";

interface AppArchitecture4HelperData {
    flags: {[key: string]: any};
    reg: {[key: string]: any};
}

class AppArchitecture4 implements IJSVanillaHelper_Extension {
    extensionName: string;
    version: number;
    helper: JSVanillaHelper;
    constructor() {
        this.extensionName = 'AppArchitecture';
        this.version = 4.01;
    }

    onAddExtension(): void {
       
    }



    extendHelperInstance(helper){
        helper["initializeApp"] = ()=>{};
        helper["toggleLSDebugModeSetting"] = ()=>{};
        helper["isAppInVerbose"] = ()=>{};
        helper["report"] = ()=>{};
        helper["getMainApp"] = ()=>{};
        helper["createAPI"] = ()=>{};
        helper["getAPI"] = ()=>{};
        helper["getController"] = ()=>{};
        helper["getJsonDataParameter"] = ()=>{};
        helper["subscribe"] = ()=>{};
        helper["register"] = ()=>{};

        helper.hData["AppArchitecture4"] = {
            flags: {},
            reg: {}
        } as AppArchitecture4HelperData;
    }

    getMainApp() {
        return this.helper.hData.reg.mainAppRef;
    }

    toggleLSDebugModeSetting() {
        const debugMode = !this.getFromLSDebugModeSetting();
        if (debugMode) {
            localStorage.setItem('JSVHAppArchitectureDebug', 'true');
        }
        else {
            localStorage.removeItem('JSVHAppArchitectureDebug');
        }
        this.helper.console(
            'log',
            `🧯 JSVanillaHelper AppArchitecture debug mode set to ${debugMode}, please refresh website.`
        );
    }

    getFromLSDebugModeSetting() {
        return !(!localStorage.getItem('JSVHAppArchitectureDebug'));
    }

    getHelperDataFlag(name = ""){
        return this.helper.hData["AppArchitecture4"].flags[name] ?? null;
    }
    setHelperDataFlag(name = "", value: any){
        return this.helper.hData["AppArchitecture4"].flags[name] = value;
    }
    getHelperDataReg(name = ""){
        return this.helper.hData["AppArchitecture4"].reg[name] ?? null;
    }
    setHelperDataReg(name = "", value: any){
        return this.helper.hData["AppArchitecture4"].reg[name] = value;
    }

    dispatchAppPreInitEvent(appRef) {
        window.dispatchEvent(new CustomEvent('jsvh-app-pre-init', {
            detail: {
                appRef: 
            }
        }));
    }

    createApp(): Architecture4App{
        const { helper } = this;
        const t = helper.t;

        if (!helper.isPlainObject(t)) {
            console.error('Target is not a valid Object');
            return;
        }
        if (!t.config) {
            console.error(
                `Cannot find "config" property, please check if app structure is suitable for JSVanillaHelper App Architecture ${this.version} .`
            );
            return;
        }
        if (!t.id) {
            console.error(
                `Cannot find "id" property, please check if app structure is suitable for JSVanillaHelper App Architecture ${this.version} .`
            );
            return;
        }
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
        this.helper.makeInmutable(t.appConfig);
        const debugMode = this.getFromLSDebugModeSetting();
        this.setHelperDataFlag("appVerboseInit", t.appConfig.initAppInVerboseMode || debugMode);
        this.setHelperDataFlag("appDebug", t.appConfig.appInDebugMode || debugMode);

        if (this.getHelperDataFlag("appVerboseInit")) {
            console.log(
                `JSVanillaHelper APP Architecture ${this.version} is in verbose${helper.hData.flags.appDebug ? ' & debug' : ''
                } mode 🧯`
            );
            console.log(`💽 ${t.appId.alias} | Unique ID [${t.appId.uniqueId}]  | Build Number [${t.appId.buildNumber}]`);
            console.log(' ▼ Components init sequence and logs ▼');

            if (this.getHelperDataFlag("appDebug")) this.handleVerboseAjaxRequests();
        }
        const appRef = t;
        appRef["architectureData"] = {
            appInitTime: new Date().getTime(),
            appReadyTime: null
        }
        this.helper.hData.reg.appsRef[t.appId.uniqueId] = t;
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
    
}

const helperScope = new AppArchitecture4;
export default helperScope;