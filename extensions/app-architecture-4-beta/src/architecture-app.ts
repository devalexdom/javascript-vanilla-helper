import { JSVanillaHelper } from "jsvanillahelper-core";
import { AppArchitectureHelper, AppComponentType, AppContextVar, AppErrorData, Architecture4App, Architecture4AppConfig, Architecture4AppId, Architecture4AppSetup, ArchitectureData, ControllerToRegister, DOMComponentInstanceReg, ServiceToRegister } from "./models";
import { EmbeddedVendorLoaderService } from "./embedded-vendor-loader";
import { EmbeddedImageLoaderService } from "./embedded-image-loader";

export class App implements Architecture4App {
    #version: string;
    #id: Architecture4AppId;
    #config: Architecture4AppConfig;
    #controllers: { [key: string]: any };
    #controllersToRegister: { [key: string]: ControllerToRegister };
    #services: { [key: string]: any };
    #servicesToRegister: { [key: string]: ServiceToRegister };
    #DOMComponentInstances: { [key: string]: DOMComponentInstanceReg };
    #helper: JSVanillaHelper;
    #appHelper: AppArchitectureHelper;
    #debugMode: boolean;
    #architectureData: ArchitectureData;
    #contextVars: { [key: string]: AppContextVar };

    constructor(appSetup: Architecture4AppSetup, helper: JSVanillaHelper) {
        this.#version = "4.0.4 beta";
        this.#id = appSetup.id;
        this.#config = appSetup.config;
        this.#helper = helper;
        this.#debugMode = this.#getDebugModeSettingFromLS();
        this.#appHelper = this.#createAppHelper();
        this.#setInitialContextVars(appSetup);
        this.#servicesToRegister = {};
        this.#controllersToRegister = {};
        this.#services = {};
        this.#controllers = {};
        this.#DOMComponentInstances = {};
        this.#architectureData = {
            appInitTime: null,
            appBeforeInitEventFired: false,
            appInitEventFired: false,
            appServicesInitEventSubscribedControllers: new Set(),
            appServicesInitEventCompletedControllers: new Set()
        };
    }

    debug() {
        return {
            services: this.#services,
            controllers: this.#controllers,
            data: this.#architectureData
        }

    }

    getUniqueId(): string {
        return this.#id.uniqueId;
    }

    getBuildNumber(): number {
        return this.#id.buildNumber;
    }

    #setInitialContextVars(appSetup: Architecture4AppSetup) {
        const debugModeVar: AppContextVar = {
            alias: "isAppInDebugMode",
            value: this.#debugMode,
            readOnly: true
        }
        this.#contextVars = appSetup.contextVars ?? {};
        this.#contextVars[debugModeVar.alias] = debugModeVar;
    }

    #createAppHelper(): AppArchitectureHelper {
        const appHelper: AppArchitectureHelper = {
            getController: this.getController.bind(this),
            getCurrentCulture: this.getCulture.bind(this),
            getService: this.getService.bind(this),
            getInstanceController: this.getInstanceController.bind(this),
            getInstanceControllerById: this.getInstanceControllerById.bind(this),
            getConfig: this.getConfig.bind(this),
            V: (target: any = null) => this.#helper.setTarget(target),
            V$: (query: string = null) => this.#helper.setTarget(document.querySelectorAll(query)),
            logOnDebug: () => { },
            warnOnDebug: () => { },
            reportError: () => { },
            whoIam: () => { return { aliasOrId: "I don't know...", type: AppComponentType.Unknown } },
            subscribe: this.#subscribe.bind(this),
            subscribeToAll: () => { },
            useVendor: () => { },
            emit: () => { },
            getContextVar: () => { },
            setContextVar: () => { },
            getRootDOMElement: () => document.documentElement
        }
        this.#helper.makeInmutable(appHelper);
        return appHelper;
    }

    #getDebugModeSettingFromLS() {
        return !!localStorage.getItem('JSVHAppArchitectureDebug');
    }

    getCulture(): string {
        return this.#config.culture ?? "";
    }

    getConfig(key: string): any {
        return this.#config.custom[key] ?? null;
    }

    registerSimpleController(uniqueAlias = "", controllerClass: (new (appHelper?: AppArchitectureHelper) => any), config?: { generateInstanceBeforeInit: false; }): void {
        if (!uniqueAlias || !controllerClass) {
            console.error(`AppArchitecture: Unable to register controller, unique alias (${uniqueAlias}) and controllerClass are expected parameters.`);
            return;
        }
        if (this.#controllers[uniqueAlias] || this.#controllersToRegister[uniqueAlias] || this.#services[uniqueAlias] || this.#servicesToRegister[uniqueAlias]) {
            console.error(`AppArchitecture: Unable to register controller, "${uniqueAlias}" is already registered.`);
            return;
        }

        if (config?.generateInstanceBeforeInit) {
            this.#createControllerInstance(uniqueAlias, controllerClass);
        }
        else {
            this.#controllersToRegister[uniqueAlias] = {
                uniqueAlias,
                controllerClass,
                controllerFunction: null
            };
        }
    }

    registerFunctionalSimpleController(uniqueAlias = "", controllerFunction: ((appHelper?: AppArchitectureHelper) => any), config?: { generateInstanceBeforeInit: false; }): void {
        if (!uniqueAlias || !controllerFunction) {
            console.error(`AppArchitecture: Unable to register controller, unique alias (${uniqueAlias}) and controllerFunction are expected parameters.`);
            return
        }
        if (this.#controllers[uniqueAlias] || this.#controllersToRegister[uniqueAlias] || this.#services[uniqueAlias] || this.#servicesToRegister[uniqueAlias]) {
            console.error(`AppArchitecture: Unable to register controller, "${uniqueAlias}" is already registered.`);
            return;
        }

        if (config?.generateInstanceBeforeInit) {
            this.#createFunctionalControllerInstance(uniqueAlias, controllerFunction);
        }
        else {
            this.#controllersToRegister[uniqueAlias] = {
                uniqueAlias,
                controllerClass: null,
                controllerFunction
            };
        }
    }

    registerService(uniqueAlias = "", serviceControllerClass: (new (appHelper?: AppArchitectureHelper) => any), config?: {}): void {
        if (!uniqueAlias || !serviceControllerClass) {
            console.error(`AppArchitecture: Unable to register service, unique alias (${uniqueAlias}) and serviceControllerClass are expected parameters.`)
            return;
        }
        if (this.#controllers[uniqueAlias] || this.#controllersToRegister[uniqueAlias] || this.#services[uniqueAlias] || this.#servicesToRegister[uniqueAlias]) {
            console.error(`AppArchitecture: Unable to register service, "${uniqueAlias}" is already registered.`);
            return;
        }

        this.#createServiceInstance(uniqueAlias, serviceControllerClass);
    }

    registerInstancesController(uniqueAlias = "", instanceControllerClass: (new (appHelper?: AppArchitectureHelper) => any), config?: {}): void {
        if (!uniqueAlias || !instanceControllerClass) {
            console.error(`AppArchitecture: Unable to register instances controller, unique alias (${uniqueAlias}) and instanceControllerClass are expected parameters.`);
            return;
        }
        if (this.#controllers[uniqueAlias] || this.#controllersToRegister[uniqueAlias] || this.#services[uniqueAlias] || this.#servicesToRegister[uniqueAlias]) {
            console.error(`AppArchitecture: Unable to register instances controller, "${uniqueAlias}" is already registered.`);
            return;
        }

        this.#controllers[uniqueAlias] = new EmbeddedInstancesController(uniqueAlias, instanceControllerClass, null);
    }

    registerFunctionalInstancesController(uniqueAlias = "", instanceControllerFunction: ((appHelper?: AppArchitectureHelper) => any), config?: {}): void {
        if (!uniqueAlias || !instanceControllerFunction) {
            console.error(`AppArchitecture: Unable to register instances controller, unique alias (${uniqueAlias}) and instanceControllerFunction are expected parameters.`);
            return;
        }
        if (this.#controllers[uniqueAlias] || this.#controllersToRegister[uniqueAlias] || this.#services[uniqueAlias] || this.#servicesToRegister[uniqueAlias]) {
            console.error(`AppArchitecture: Unable to register instances controller, "${uniqueAlias}" is already registered.`);
            return;
        }

        this.#controllers[uniqueAlias] = new EmbeddedInstancesController(uniqueAlias, null, instanceControllerFunction);
    }

    #domInstanceVisibleErrorFeedback(instanceDomElement: HTMLElement) {
        if (this.#debugMode) {
            instanceDomElement.style.opacity = "0.6";
            instanceDomElement.style.filter = "grayscale(100%)";
            instanceDomElement.prepend("⚠️");
        } else {
            if (this.#config.errorManagement?.hideCrashedDOMInstancesDuringInit) {
                instanceDomElement.style.display = "none";
            }
        }
    }

    #reportInlineInitError(instanceDomElement, error?: any) {
        this.#helper.console('error', `AppArchitecture: 🤕 An unexpected error happened in the inline init of DOM instance component "${(instanceDomElement.id) ? instanceDomElement.id : "-NO ID-"}"`);
        this.#helper.console('error', instanceDomElement);
        this.#helper.console('error', error);
        this.#domInstanceVisibleErrorFeedback(instanceDomElement);
    };

    #handleControllerInstancesInit() {
        const handleInstanceCreation = (DOMComponent: HTMLElement, instancesController: EmbeddedInstancesController) => {
            const instanceReg = instancesController.createComponentInstance(DOMComponent, this.#customizeAppHelper.bind(this));
            if (!this.#DOMComponentInstances[instanceReg.uniqueId]) {
                this.#DOMComponentInstances[instanceReg.uniqueId] = instanceReg;
            }
            else {
                this.#reportInlineInitError(DOMComponent, `DOM Instance id "${instanceReg.uniqueId}" is not unique.`);
            }
        }

        const domInstanceComponents = [...document.querySelectorAll(
            '[jsvh-controller]'
        )];

        domInstanceComponents.forEach((DOMComponent: HTMLElement) => {
            const controllerAlias = DOMComponent.getAttribute("jsvh-controller");
            const modularComponentSrc = DOMComponent.getAttribute("jsvh-modular-controller-src");


            const controller = this.#controllers[controllerAlias];
            if (!controller && !modularComponentSrc) {
                this.#helper.console('error', `AppArchitecture: Instances controller "${controllerAlias}" is not registered in the webapp.`);
                this.#helper.console('error', DOMComponent);
                return;
            }
            if (!controller && modularComponentSrc) {
                try {
                    this.#helper.addScriptFile(
                        modularComponentSrc,
                        () => {
                            const modularController =
                                this.#controllers[controllerAlias];
                            if (!modularController) {
                                this.#helper.console('error', `AppArchitecture: Modular instances controller "${controllerAlias}" is not registered in the webapp.`);
                                this.#helper.console('error', DOMComponent);
                                return;
                            }
                            handleInstanceCreation(DOMComponent, modularController);
                        },
                        `${controllerAlias}-script`,
                        document.head
                    );
                } catch (error) {
                    this.#reportInlineInitError(DOMComponent, error);
                }
            } else {
                handleInstanceCreation(DOMComponent, controller);
            }
        });
    }

    #awaitServicesInitialization() {
        return new Promise<void>((resolve, reject) => {
            if (this.#architectureData.appServicesInitEventSubscribedControllers.size === 0) {
                resolve();
            }
            else {
                this.#subscribe("AppServicesInit%", (data, originId) => {
                    if (this.#services[originId]) {
                        this.#architectureData.appServicesInitEventCompletedControllers.add(originId);
                        if (this.#architectureData.appServicesInitEventCompletedControllers.size === this.#architectureData.appServicesInitEventSubscribedControllers.size) {
                            resolve();
                        }
                    }
                });
                this.#subscribe("AppServicesInit/", (data, originId) => {
                    if (this.#services[originId]) {
                        reject();
                    }
                });
            }
        });
    }

    #emitCustomEvent(customEventName: string, data?: any, originId?: string) {
        //Block reserved app events
        switch (customEventName) {
            case "AppBeforeInit":
            case "AppServicesInit":
            case "AppInit":
            case "ViewportVisibleInit":
                return;
        }

        const detail = {
            originId: originId ?? null,
            data: data ?? null
        }

        window.dispatchEvent(new CustomEvent(`${this.#id.uniqueId}_${customEventName}`, { detail }));
    }

    #emitAppEvent(appEventName: string, originId?: string) {
        const detail = {
            originId: originId ? originId : null
        }
        window.dispatchEvent(new CustomEvent(`${this.#id.uniqueId}_${appEventName}`, { detail }));
    }

    #subscribe(appEventName: string, callback: (data: any, originId: string) => void, originId?: string) {
        if (appEventName === "AppInit" && this.#architectureData.appInitEventFired || appEventName === "AppBeforeInit" && this.#architectureData.appBeforeInitEventFired) {
            callback(null, this.#id.uniqueId);
            return;
        }
        window.addEventListener(`${this.#id.uniqueId}_${appEventName}`, (e: CustomEvent) => {
            const eventOriginId = e.detail?.originId;
            if (!eventOriginId || eventOriginId === originId || !originId) {
                callback(e.detail?.data, eventOriginId ?? "anonymous");
            }
        });
    }

    #customizeAppHelper(uniqueAlias: string, controllerType: AppComponentType, instanceRootDOMElement?: HTMLElement): AppArchitectureHelper {
        const logOnDebug = (content: any, trace = true) => {
            if (this.#debugMode) {
                this.#helper.console('log', `⬇️ DEBUG LOG FROM: ${uniqueAlias} (${AppComponentType[controllerType]}) ⬇️`);
                this.#helper.console('log', content);
                if (trace) {
                    console.trace();
                }
                this.#helper.console('log', `END OF DEBUG LOG`);
            }
        }
        const warnOnDebug = (content: any, trace = true) => {
            if (this.#debugMode) {
                this.#helper.console('warn', `⬇️ DEBUG WARN FROM: ${uniqueAlias} (${AppComponentType[controllerType]}) ⬇️`);
                this.#helper.console('warn', content);
                if (trace) {
                    console.trace();
                }
                this.#helper.console('warn', `END OF DEBUG WARN`);
            }
        }
        const reportError = (message: string, content?: any) => {
            if (this.#debugMode) {
                this.#helper.console('error', `🟥 ${uniqueAlias} (${AppComponentType[controllerType]}) REPORTED AN ERROR 🟥`);
                this.#helper.console('error', message);
                if (content) {
                    this.#helper.console('error', content);
                }
                if (instanceRootDOMElement) {
                    this.#domInstanceVisibleErrorFeedback(instanceRootDOMElement);
                }
            }
            else {
                document.body.setAttribute("jsvh-error-has-occurred", "yes");
            }
            this.#emitAppErrorEvent(
                {
                    url: window.location.href,
                    errorDetails: content,
                    controllerType,
                    uncontrolledError: false
                },
                uniqueAlias
            );
        }

        const emit = (customEventName: string, data?: any) => {
            this.#emitCustomEvent(customEventName, data, uniqueAlias);
        }

        const subscribe = (appEventName: string, callback: (data: any, originId: any) => any, targetId?: string) => {
            const isDOMInstanceController = controllerType === AppComponentType.DOMInstanceController || controllerType === AppComponentType.DOMInstanceFunctionalController;

            const handleAppEventFeedback = (data: any, originId: any) => {
                if (this.#debugMode) {
                    this.#helper.console('log', `🪃⬇️ ${uniqueAlias} (${AppComponentType[controllerType]}) has received the ${appEventName}${targetId ? ` ~ ${targetId}` : ""} event subscription. | ${new Date().toISOString()}`);
                }
                try {
                    callback(data, originId);
                    if (this.#debugMode) {
                        this.#helper.console('log', `🪃✅ ${uniqueAlias} (${AppComponentType[controllerType]}) completed the ${appEventName}${targetId ? ` ~ ${targetId}` : ""} event subscription. | ${new Date().toISOString()}`);
                    }
                    this.#emitAppEvent(`${appEventName}%`, uniqueAlias);
                }
                catch (err) {
                    this.#reportUncontrolledError(uniqueAlias, controllerType, err, instanceRootDOMElement ?? null);
                    this.#emitAppEvent(`${appEventName}/`, uniqueAlias);
                    if (isDOMInstanceController && this.#config.errorManagement?.hideCrashedDOMInstancesWhileRunning) {
                        instanceRootDOMElement.style.display = "none";
                    }
                }
            };

            //hijack subscription callback
            if (appEventName === "ViewportVisibleInit" && isDOMInstanceController) {
                this.#helper.onViewportVisibleOnce(() => {
                    handleAppEventFeedback(null, null);
                }, { root: null, rootMargin: "0px", threshold: 0.1 }, instanceRootDOMElement);
            }
            else {
                if (appEventName === "AppServicesInit" && controllerType === AppComponentType.Service) {
                    this.#architectureData.appServicesInitEventSubscribedControllers.add(uniqueAlias);
                }

                this.#appHelper.subscribe(appEventName, (data, originId) => {
                    handleAppEventFeedback(data, originId);
                }, targetId)
            }
        }

        const useVendor = (vendorUniqueName: string, callback: () => any, appEventInitMethod = "", lazyVendorLoad = true) => {
            if (!appEventInitMethod) {
                const vendorLoader = this.#appHelper.getService("vendorLoader") as EmbeddedVendorLoaderService;
                vendorLoader.requestVendorLoad(vendorUniqueName, () => {
                    if (this.#debugMode) {
                        this.#helper.console('log', `🧱✅ ${uniqueAlias} (${AppComponentType[controllerType]}) used vendor "${vendorUniqueName}" | ${new Date().toISOString()}`);
                    }
                    callback();
                })
            }
            else {
                if (lazyVendorLoad) {
                    subscribe(appEventInitMethod, () => {
                        const vendorLoader = this.#appHelper.getService("vendorLoader") as EmbeddedVendorLoaderService;
                        vendorLoader.requestVendorLoad(vendorUniqueName, () => {
                            if (this.#debugMode) {
                                this.#helper.console('log', `🧱✅ ${uniqueAlias} (${AppComponentType[controllerType]}) used vendor "${vendorUniqueName}" (combined init) | ${new Date().toISOString()}`);
                            }
                            callback();
                        })
                    })
                }
                else {
                    subscribeToAll([{ appEventName: `${vendorUniqueName}VendorLoad` }, { appEventName: appEventInitMethod }], callback);
                    const vendorLoader = this.#appHelper.getService("vendorLoader") as EmbeddedVendorLoaderService;
                    vendorLoader.requestVendorLoad(vendorUniqueName);
                }
            }
        }

        const subscribeToAll = (appEvents: Array<{ appEventName: string, targetId?: string }>, callback: (data: Array<any>, originId: Array<string>) => any) => {
            const events = appEvents.reduce((eventsIndex, appEvent) => {
                eventsIndex[appEvent.appEventName] = { ...appEvent, completed: false, data: null, originId: "" };
                return eventsIndex;
            }, {}) as Array<{ appEventName: string, targetId?: string, completed: boolean, data: any, originId: string }>;

            const doCallbackIfMeetConditions = () => {
                const eventsArray = Object.values(events);
                const conditionsMeet = eventsArray.reduce((meetConditions, appEvent) => {
                    return meetConditions && appEvent.completed
                }, true)

                if (conditionsMeet) {
                    const eventsData = eventsArray.flatMap(appEvent => appEvent.data);
                    const eventsOriginId = eventsArray.flatMap(appEvent => appEvent.originId);
                    callback(eventsData, eventsOriginId);
                    if (this.#debugMode) {
                        this.#helper.console('log', `🪃🪃✅ ${uniqueAlias} (${AppComponentType[controllerType]}) completed a multiple event subscription. | ${new Date().toISOString()}`);
                    }
                }
            }

            appEvents.forEach((appEvent) => {
                subscribe(appEvent.appEventName, (data, originId) => {
                    const indexedEvent = events[appEvent.appEventName];
                    events[appEvent.appEventName] = { ...indexedEvent, completed: true, data, originId };
                    doCallbackIfMeetConditions();
                }, appEvent.targetId)
            });
        }

        const whoIam = () => {
            return {
                aliasOrId: uniqueAlias,
                type: controllerType
            }
        }

        const setContextVar = (alias: string, value: any, readOnly?: boolean, scope?: Array<string>) => {
            const currentVar = this.#contextVars[alias];
            if (currentVar) {
                if (!(currentVar.scope?.includes(uniqueAlias) || !currentVar.scope)) {
                    reportError(`Error setting value to context var "${alias}", is out of scope.`)
                    return;
                }
                if (readOnly && currentVar.creatorId !== uniqueAlias) {
                    reportError(`Error setting value to context var "${alias}", is read only.`)
                    return;
                }
                this.#contextVars[alias].value = value;
            }
            this.#contextVars[alias] = {
                alias,
                value,
                readOnly: !!readOnly,
                scope: scope ? [...uniqueAlias, ...scope] : null,
                creatorId: uniqueAlias
            };
            this.#emitAppEvent(`ContextVarChange_${alias}`)
        }

        const getContextVar = (alias: string, newValueCallback?: (value: any) => any) => {
            const currentVar = this.#contextVars[alias];
            if (currentVar) {
                if (currentVar.scope?.includes(uniqueAlias) || !currentVar.scope) {
                    if (newValueCallback) {
                        this.#appHelper.subscribe(`ContextVarChange_${alias}`, () => newValueCallback(this.#contextVars[alias]?.value));
                    }
                    return currentVar.value;
                }
                else {
                    reportError(`Error accessing value of context var "${alias}", is out of scope.`)
                }
            }
            return null;
        }


        const getRootDOMElement = instanceRootDOMElement ? () => instanceRootDOMElement : this.#appHelper.getRootDOMElement;
        return { ...this.#appHelper, logOnDebug, warnOnDebug, reportError, subscribe, subscribeToAll, getRootDOMElement, whoIam, emit, getContextVar, setContextVar, useVendor };
    }

    #createControllerInstance(uniqueAlias: string, controllerClass: (new (appHelper?: AppArchitectureHelper) => any)) {
        try {
            const appHelperToInject = this.#customizeAppHelper(uniqueAlias, AppComponentType.SimpleController);
            const controllerInstance = new controllerClass(appHelperToInject);
            this.#controllers[uniqueAlias] = controllerInstance;
        }
        catch (err) {
            this.#reportUncontrolledError(uniqueAlias, AppComponentType.SimpleController, err);
        }
    }

    #createFunctionalControllerInstance(uniqueAlias: string, controllerFunction: ((appHelper?: AppArchitectureHelper) => any)) {
        try {
            const appHelperToInject = this.#customizeAppHelper(uniqueAlias, AppComponentType.SimpleFunctionalController);
            const controllerInstance = controllerFunction(appHelperToInject);
            this.#controllers[uniqueAlias] = controllerInstance;
        }
        catch (err) {
            this.#reportUncontrolledError(uniqueAlias, AppComponentType.SimpleFunctionalController, err);
        }
    }

    #reportUncontrolledError(uniqueAlias: string, controllerType: AppComponentType, error: any, instanceRootDOMElement?: HTMLElement) {
        if (this.#debugMode) {
            this.#helper.console('error', `🟥 ${uniqueAlias} (${AppComponentType[controllerType]}) THROWED AN UNCONTROLLED ERROR 🟥`);
            this.#helper.console('error', error);
            this.#helper.console('error', `END OF UNCONTROLLED ERROR REPORT`);
            if (instanceRootDOMElement) {
                this.#domInstanceVisibleErrorFeedback(instanceRootDOMElement);
            }
        }
        else {
            document.body.setAttribute("jsvh-error-has-occurred", "yes");
        }
        this.#emitAppErrorEvent(
            {
                url: window.location.href,
                errorDetails: error,
                controllerType,
                uncontrolledError: true
            },
            uniqueAlias
        );
    }

    #createServiceInstance(uniqueAlias: string, serviceControllerClass: (new (appHelper?: AppArchitectureHelper) => any)) {
        try {
            const appHelperToInject = this.#customizeAppHelper(uniqueAlias, AppComponentType.Service);
            const controllerInstance = new serviceControllerClass(appHelperToInject);
            this.#services[uniqueAlias] = controllerInstance;
        }
        catch (err) {
            this.#reportUncontrolledError(uniqueAlias, AppComponentType.Service, err);
        }
    }

    start(): void {
        if (this.#architectureData.appInitTime) return;
        this.#architectureData.appInitTime = new Date();

        if (this.#debugMode) {
            console.log(
                `JSVanillaHelper AppArchitecture ${this.#version} is in verbose & debug mode 🧯`
            );
            console.log(`💽 ${this.#id.alias} | Unique ID [${this.#id.uniqueId}] | Build Number [${this.#id.buildNumber ?? "Unknown"}]`);
        }

        this.#emitAppEvent("AppBeforeInit");
        this.#architectureData.appBeforeInitEventFired = true;
        //Register services
        this.#createServiceInstance("vendorLoader", EmbeddedVendorLoaderService);
        this.#createServiceInstance("imageLoader", EmbeddedImageLoaderService);
        Object.values(this.#servicesToRegister).forEach(serviceToRegister => {
            this.#createServiceInstance(serviceToRegister.uniqueAlias, serviceToRegister.serviceControllerClass);
        });
        //Register controllers
        Object.values(this.#controllersToRegister).forEach(controllerToRegister => {
            if (controllerToRegister.controllerClass && !controllerToRegister.controllerFunction) {
                this.#createControllerInstance(controllerToRegister.uniqueAlias, controllerToRegister.controllerClass);
            }
            else if (!controllerToRegister.controllerClass && controllerToRegister.controllerFunction) {
                this.#createFunctionalControllerInstance(controllerToRegister.uniqueAlias, controllerToRegister.controllerFunction);
            }
        });
        this.#awaitServicesInitialization().then(() => {
            if (this.#debugMode) {
                this.#helper.console("log", "Services initialization completed ✅");
            }
            this.#handleControllerInstancesInit();
            this.#emitAppEvent("AppInit");
            this.#architectureData.appInitEventFired = true;
        }).catch((err) => {
            console.error(`AppArchitecture: Service controller error, cannot continue with app initialization.`);
            if (this.#debugMode) {
                console.error(err);
            }
        });
        this.#emitAppEvent("AppServicesInit");
    }

    #emitAppErrorEvent(errorData: AppErrorData, originId?: string) {
        window.dispatchEvent(new CustomEvent(`${this.#id.uniqueId}_AppError`, { detail: { originId: !originId ? "self/unknown" : originId, errorData } }));
    }

    getService(serviceAlias: string) {
        const service = this.#services[serviceAlias] ?? null;
        if (!service) {
            console.error(`AppArchitecture: Service "${serviceAlias}" not found/registered in app "${this.#id.uniqueId}"`);
        }
        return service;
    }
    getController(controllerAlias: string) {
        const controller = this.#controllers[controllerAlias] ?? null;
        if (!controller) {
            console.error(`AppArchitecture: Controller "${controllerAlias}" not found/registered in app "${this.#id.uniqueId}"`);
        }
        else if (controller?.createComponentInstance) {
            console.error(`AppArchitecture: Instances controller cannot be accessed directly`);
            return null;
        }
        return controller;
    }

    getInstanceControllerById(componentUniqueId: string) {
        const controller = this.#DOMComponentInstances[componentUniqueId]?.componentInstance ?? null;
        if (!controller) {
            console.error(`AppArchitecture: Instance controller for component "${componentUniqueId}" not found/registered in app "${this.#id.uniqueId}"`);
        }

        return controller;
    }

    getInstanceController(instanceRootDOMElement: HTMLElement) {
        const uniqueId = instanceRootDOMElement?.getAttribute("jsvh-component-id");
        if (!uniqueId) {
            console.error(`AppArchitecture: DOM element does not have a valid component instance id`);
            return null;
        }

        return this.getInstanceControllerById(uniqueId);
    }
}

class EmbeddedInstancesController {
    #uniqueAlias: string;
    #componentInstanceControllerClass: (new (appHelper?: AppArchitectureHelper) => any) | null;
    #componentInstanceControllerFunction: ((appHelper?: AppArchitectureHelper) => any) | null;
    #createdInstancesCount: number;


    constructor(uniqueAlias: string, componentInstanceControllerClass: (new (appHelper?: AppArchitectureHelper) => any), componentInstanceControllerFunction: ((appHelper?: AppArchitectureHelper) => any)) {
        this.#createdInstancesCount = 0;
        this.#uniqueAlias = uniqueAlias;
        this.#componentInstanceControllerClass = componentInstanceControllerClass;
        this.#componentInstanceControllerFunction = componentInstanceControllerFunction;
    }

    createComponentInstance(DOMComponent: HTMLElement, getCustomAppHelper: (uniqueAlias: string, controllerType: AppComponentType, instanceRootDOMElement?: HTMLElement) => AppArchitectureHelper): DOMComponentInstanceReg {
        const uniqueComponentInstanceId = DOMComponent.id ? DOMComponent.id : `${this.#uniqueAlias.replace("Controller", "")}-${this.#createdInstancesCount}`;
        let componentInstance = null;
        if (this.#componentInstanceControllerClass) {
            const appHelper = getCustomAppHelper(uniqueComponentInstanceId, AppComponentType.DOMInstanceController, DOMComponent);
            componentInstance = new this.#componentInstanceControllerClass(appHelper);
        }
        else if (this.#componentInstanceControllerFunction) {
            const appHelper = getCustomAppHelper(uniqueComponentInstanceId, AppComponentType.DOMInstanceFunctionalController, DOMComponent);
            componentInstance = this.#componentInstanceControllerFunction(appHelper);
        }
        return {
            uniqueId: uniqueComponentInstanceId,
            instancesControllerUniqueId: this.#uniqueAlias,
            componentInstance: componentInstance,
            rootDOMElement: DOMComponent
        }
    }
}


