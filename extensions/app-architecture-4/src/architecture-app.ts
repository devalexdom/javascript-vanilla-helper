import { JSVanillaHelper } from "jsvanillahelper-core";
import { AppArchitectureHelper, AppComponentType, AppErrorData, Architecture4App, Architecture4AppConfig, Architecture4AppId, Architecture4AppSetup, ArchitectureData, ControllerToRegister, DOMComponentInstanceReg, ServiceToRegister } from "./models";
import { Block, ClassDeclaration, ClassElement, Type } from "typescript";

export class App implements Architecture4App {
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

    constructor(appSetup: Architecture4AppSetup, helper: JSVanillaHelper) {
        this.#id = appSetup.id;
        this.#config = appSetup.config;
        this.#helper = helper;
        this.#debugMode = false;
        this.#appHelper = this.#createAppHelper();
        this.#architectureData = {
            appInitTime: null,
            appBeforeInitEventFired: false,
            appInitEventFired: false
        };

    }

    getUniqueId(): string {
        return this.#id.uniqueId;
    }

    getBuildNumber(): number {
        return this.#id.buildNumber;
    }

    #createAppHelper(): AppArchitectureHelper {
        const appHelper: AppArchitectureHelper = {
            getController: this.getController.bind(this),
            getCurrentCulture: this.getCulture.bind(this),
            getService: this.getService.bind(this),
            getInstanceController: this.getInstanceController.bind(this),
            getInstanceControllerById: this.getInstanceControllerById.bind(this),
            logOnDebug: () => { },
            warnOnDebug: () => { },
            reportError: () => { },
            whoIam: () => { return { aliasOrId: "I don't know...", type: AppComponentType.Unknown } },
            subscribe: this.#subscribe.bind(this),
            getRootDOMElement: () => document.documentElement
        }
        this.#helper.makeInmutable(appHelper);
        return appHelper;
    }

    getCulture(): string {
        return this.#config.culture ?? "";
    }

    getConfig(key: string): any {
        return this.#config.custom[key] ?? null;
    }

    registerSimpleController(uniqueAlias = "", controllerClass: (new (appHelper?: AppArchitectureHelper) => Block), config: { generateInstanceBeforeInit: false; }): void {
        if (!uniqueAlias || !controllerClass) {
            console.error("AppArchitecture: Unable to register controller, unique alias and controllerClass are expected parameters.")
        }
        if (this.#controllers[uniqueAlias] || this.#controllersToRegister[uniqueAlias]) {
            console.error("AppArchitecture: Unable to register controller, unique alias is not unique or you're registering the controller again.")
        }

        if (config?.generateInstanceBeforeInit) {
            this.#createControllerInstance(uniqueAlias, controllerClass);
        }
        else {
            this.#controllersToRegister[uniqueAlias] = {
                uniqueAlias,
                controllerClass,
                controllerFunction: null
            }
        }
    }

    registerFunctionalSimpleController(uniqueAlias = "", controllerFunction: ((appHelper?: AppArchitectureHelper) => Block), config: { generateInstanceBeforeInit: false; }): void {
        if (!uniqueAlias || !controllerFunction) {
            console.error("AppArchitecture: Unable to register controller, unique alias and controllerFunction are expected parameters.")
        }
        if (this.#controllers[uniqueAlias] || this.#controllersToRegister[uniqueAlias]) {
            console.error("AppArchitecture: Unable to register controller, unique alias is not unique or you're registering the controller again.")
        }

        if (config?.generateInstanceBeforeInit) {
            this.#createFunctionalControllerInstance(uniqueAlias, controllerFunction);
        }
        else {
            this.#controllersToRegister[uniqueAlias] = {
                uniqueAlias,
                controllerClass: null,
                controllerFunction
            }
        }
    }

    registerService(uniqueAlias = "", serviceControllerClass: (new (appHelper?: AppArchitectureHelper) => Block), config: {}): void {
        if (!uniqueAlias || !serviceControllerClass) {
            console.error("AppArchitecture: Unable to register service, unique alias and serviceControllerClass are expected parameters.")
        }
        if (this.#controllers[uniqueAlias] || this.#controllersToRegister[uniqueAlias]) {
            console.error("AppArchitecture: Unable to register service, unique alias is not unique or you're registering the service again.")
        }

        this.#createServiceInstance(uniqueAlias, serviceControllerClass);
    }

    registerInstancesController(uniqueAlias = "", instanceControllerClass: (new (appHelper?: AppArchitectureHelper) => Block), config: {}): void {
        if (!uniqueAlias || !instanceControllerClass) {
            console.error("AppArchitecture: Unable to register instance controller, unique alias and instanceControllerClass are expected parameters.")
        }

        this.#controllers = new EmbeddedInstancesController(uniqueAlias, instanceControllerClass, null);
    }

    registerFunctionalInstancesController(uniqueAlias = "", instanceControllerFunction: ((appHelper?: AppArchitectureHelper) => Block), config: {}): void {
        if (!uniqueAlias || !instanceControllerFunction) {
            console.error("AppArchitecture: Unable to register instance controller, unique alias and instanceControllerFunction are expected parameters.")
        }

        this.#controllers = new EmbeddedInstancesController(uniqueAlias, null, instanceControllerFunction);
    }


    #reportInlineInitError(DOMComponent, error?: any) {
        const visibleErrorFeedback = (DOMComponent) => {
            if (this.#debugMode) {
                DOMComponent.style.opacity = 0.6;
                DOMComponent.style.filter = 'grayscale(100%)';
                DOMComponent.prepend('⚠️');
            } else {
                if (this.#config.errorManagement?.hideCrashedDOMInstancesDuringInit) {
                    DOMComponent.style.display = "none";
                }
            }
        };
        this.#helper.console(
            'error',
            `🤕 An unhandled error happened in the inline init of DOM instance component "${(DOMComponent.id) ? DOMComponent.id : "-NO ID-"}"`
        );
        this.#helper.console('error', DOMComponent);
        this.#helper.console(
            'error',
            error || 'Controller not found in main app'
        );
        visibleErrorFeedback(DOMComponent);
    };

    #handleControllerInstancesInit() {
        const handleInstanceCreation = (DOMComponent: HTMLElement, instancesController: EmbeddedInstancesController) => {
          const instanceReg =  instancesController.createComponentInstance(DOMComponent, this.#customizeAppHelper.bind(this));
          if (!this.#DOMComponentInstances[instanceReg.uniqueId]){
            this.#DOMComponentInstances[instanceReg.uniqueId] = instanceReg;
          }
          else {
            this.#reportInlineInitError(DOMComponent, `DOM Instance id "${instanceReg.uniqueId}" not unique`);
          }
        }

        const domInstanceComponents = [...document.querySelectorAll(
            '[jsvh-controller]'
        )];

        domInstanceComponents.forEach((DOMComponent: HTMLElement) => {
            const controllerAlias = DOMComponent.getAttribute("jsvh-controller");
            const modularComponentSrc = DOMComponent.getAttribute("jsvh-modular-controller-src");

            try {
                const controller = this.#controllers[controllerAlias];
                if (!controller && !modularComponentSrc) {
                    this.#reportInlineInitError(DOMComponent);
                    return;
                }
                if (!controller && modularComponentSrc) {
                    this.#helper.addScriptFile(
                        modularComponentSrc,
                        () => {
                            const modularController =
                                this.#controllers[controllerAlias];
                            if (!modularController) {
                                this.#reportInlineInitError(DOMComponent);
                                return;
                            }
                            handleInstanceCreation(DOMComponent, modularController);
                        },
                        `${controllerAlias}-script`,
                        document.head
                    );
                } else {
                    handleInstanceCreation(DOMComponent, controller);
                }
            } catch (error) {
                this.#reportInlineInitError(DOMComponent, error);
            }
        });
    }

    #subscribe(appEventName: string, callback: Function, originId?: string) {
        if (appEventName === "AppInit" && this.#architectureData.appInitEventFired || appEventName === "AppBeforeInit" && this.#architectureData.appBeforeInitEventFired) {
            callback();
            return;
        }
        window.addEventListener(`${this.#id.uniqueId}_${appEventName}`, (e: CustomEvent) => {
            if (!e.detail || originId && e.detail?.originId === originId) {
                callback();
            }
        });
    }

    #customizeAppHelper(uniqueAlias: string, controllerType: AppComponentType, instanceRootDOMElement?: HTMLElement): AppArchitectureHelper {
        const logOnDebug = (content: any) => {
            if (this.#debugMode) {
                this.#helper.console('log', `⬇️ DEBUG FROM: ${uniqueAlias} (${controllerType}) ⬇️`);
                this.#helper.console('log', content);
                console.trace();
            }
        }
        const warnOnDebug = (content: any) => {
            if (this.#debugMode) {
                this.#helper.console('warn', `⬇️ DEBUG WARN FROM: ${uniqueAlias} (${controllerType}) ⬇️`);
                this.#helper.console('warn', content);
                console.trace();
            }
        }
        const reportError = (message: string, content?: any) => {
            if (this.#debugMode) {
                this.#helper.console('error', `🟥 ${uniqueAlias} (${controllerType}) REPORTED AN ERROR 🟥`);
                this.#helper.console('error', message);
                if (content) {
                    this.#helper.console('error', content);
                }
                console.trace();
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
        const subscribe = (appEventName: string, callback: Function, targetId?: string) => {
            const isDOMInstanceController = controllerType === AppComponentType.DOMInstanceController || controllerType === AppComponentType.DOMInstanceFunctionalController;

            const handleAppEventFeedback = () => {
                if (this.#debugMode) {
                    this.#helper.console('log', `🪃 ${uniqueAlias} (${controllerType}) SUBSCRIPTION TO ${appEventName}${targetId ? ` ~ ${targetId}` : ""} RECEIVED`);
                }
                try {
                    callback();
                    if (this.#debugMode) {
                        this.#helper.console('log', `🪃✅ ${uniqueAlias} (${controllerType}) SUBSCRIPTION TO ${appEventName}${targetId ? ` ~ ${targetId}` : ""} COMPLETED`);
                    }
                    this.#emitAppEvent(`${appEventName}%`, uniqueAlias);
                }
                catch (err) {
                    this.#reportUncontrolledError(uniqueAlias, controllerType, err);
                    this.#emitAppEvent(`${appEventName}/`, uniqueAlias);
                    if (isDOMInstanceController && this.#config.errorManagement?.hideCrashedDOMInstancesWhileRunning) {
                        instanceRootDOMElement.style.display = "none";
                    }
                }
            };

            //hijack subscription callback
            if (appEventName === "ViewportVisibleInit" && isDOMInstanceController) {
                this.#helper.onViewportVisibleOnce(() => {
                    handleAppEventFeedback();
                }, { root: null, rootMargin: "0px", threshold: 1.0 }, instanceRootDOMElement);
            }
            else {
                this.#appHelper.subscribe(appEventName, () => {
                    handleAppEventFeedback();
                }, targetId)
            }
        }
        const whoIam = () => {
            return {
                aliasOrId: uniqueAlias,
                type: controllerType
            }
        }
        const getRootDOMElement = instanceRootDOMElement ? () => instanceRootDOMElement : this.#appHelper.getRootDOMElement;
        return { ...this.#appHelper, logOnDebug, warnOnDebug, reportError, subscribe, getRootDOMElement, whoIam };
    }

    #createControllerInstance(uniqueAlias: string, controllerClass: (new (appHelper?: AppArchitectureHelper) => Block)) {
        try {
            const appHelperToInject = this.#customizeAppHelper(uniqueAlias, AppComponentType.SimpleController);
            const controllerInstance = new controllerClass(appHelperToInject);
            this.#controllers[uniqueAlias] = controllerInstance;
        }
        catch (err) {
            this.#reportUncontrolledError(uniqueAlias, AppComponentType.SimpleController, err);
        }
    }

    #createFunctionalControllerInstance(uniqueAlias: string, controllerFunction: ((appHelper?: AppArchitectureHelper) => Block)) {
        try {
            const appHelperToInject = this.#customizeAppHelper(uniqueAlias, AppComponentType.SimpleFunctionalController);
            const controllerInstance = controllerFunction(appHelperToInject);
            this.#controllers[uniqueAlias] = controllerInstance;
        }
        catch (err) {
            this.#reportUncontrolledError(uniqueAlias, AppComponentType.SimpleFunctionalController, err);
        }
    }

    #reportUncontrolledError(uniqueAlias: string, controllerType: AppComponentType, error: any) {
        if (this.#debugMode) {
            this.#helper.console('error', `🟥 ${uniqueAlias} (${controllerType}) THROWED AN UNCONTROLLED ERROR 🟥`);
            this.#helper.console('error', error);
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

    #createServiceInstance(uniqueAlias: string, serviceControllerClass: (new (appHelper?: AppArchitectureHelper) => Block)) {
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
        this.#emitAppEvent("AppBeforeInit");
        this.#architectureData.appBeforeInitEventFired = true;
        //Register services
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
        this.#handleControllerInstancesInit();
        this.#emitAppEvent("AppInit");
        this.#architectureData.appInitEventFired = true;
    }

    #emitAppEvent(appEventName: string, originId?: string) {
        window.dispatchEvent(new CustomEvent(`${this.#id.uniqueId}_${appEventName}`, originId ? { detail: { originId } } : null));
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

    getHelper(): AppArchitectureHelper {
        return this.#appHelper;
    }
}

class EmbeddedInstancesController {
    #uniqueAlias: string;
    #componentInstanceControllerClass: (new (appHelper?: AppArchitectureHelper) => Block) | null;
    #componentInstanceControllerFunction: ((appHelper?: AppArchitectureHelper) => Block) | null;
    #createdInstancesCount: number;


    constructor(uniqueAlias: string, componentInstanceControllerClass: (new (appHelper?: AppArchitectureHelper) => Block), componentInstanceControllerFunction: ((appHelper?: AppArchitectureHelper) => Block)) {
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


