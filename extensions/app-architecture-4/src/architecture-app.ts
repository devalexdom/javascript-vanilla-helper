import { JSVanillaHelper } from "jsvanillahelper-core";
import { AppArchitectureHelper, AppComponentType, Architecture4App, Architecture4AppConfig, Architecture4AppId, Architecture4AppSetup, ControllerToRegister, DOMComponentInstanceReg, ServiceToRegister } from "./models";
import { Block, ClassDeclaration, ClassElement, Type } from "typescript";

class App implements Architecture4App {
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

    constructor(appSetup: Architecture4AppSetup, helper: JSVanillaHelper) {
        this.#id = appSetup.id;
        this.#config = appSetup.config;
        this.#helper = helper;
        this.#debugMode = false;
        this.#appHelper = this.#createAppHelper();

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

    registerSimpleFunctionalController(uniqueAlias = "", controllerFunction: ((appHelper?: AppArchitectureHelper) => Block), config: { generateInstanceBeforeInit: false; }): void {
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

    #reportInlineInitError(DOMComponent, error) {
        const visibleErrorFeedback = (DOMComponent) => {
            if (this.#helper.hData["AppArchitecture4"].flags.appDebug) {
                DOMComponent.style.opacity = 0.6;
                DOMComponent.style.filter = 'grayscale(100%)';
                DOMComponent.prepend('⚠️');
            } else {
                DOMComponent.style.pointerEvents = 'none';
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
        const domInstanceComponents = [...document.querySelectorAll(
            '[jsvh-controller]'
        )];

        const handleInitHook = (DOMComponent, controller) => {
            switch (DOMComponent.getAttribute("jsvh-init-on-event")) {
                case "viewport-visible":
                    controller.handleInlineOnViewportInit(DOMComponent);
                    break;
                case "app-ready":
                    this.#reportInlineInitError(DOMComponent, `app-ready init hook is only supported on App Architecture v4.x or higher`);
                    break;

                default:
                    controller.handleInlineOnAppInit(DOMComponent);
                    break;
            }
        }

        domInstanceComponents.forEach((DOMComponent) => {
            const controllerAlias = DOMComponent.getAttribute("jsvh-controller");
            const modularComponentSrc = DOMComponent.getAttribute("jsvh-modular-component-src");

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
        });
    }

    #subscribe(appEventName: string, callback: Function) {
        window.addEventListener(`${this.#id.uniqueId}_${appEventName}`, () => callback());
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
        }
        const subscribe = !this.#debugMode ? this.#appHelper.subscribe : (appEventName: string, callback: Function) => {
            //hijack subscription callback
            this.#appHelper.subscribe(appEventName, () => {
                this.#helper.console('log', `🪃 ${uniqueAlias} (${controllerType}) SUBSCRIPTION TO ${appEventName} RECEIVED`);
                callback();
            })
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

    initialize(): void {

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

    createComponentInstance(DOMComponent: HTMLElement, getCustomAppHelper: (uniqueAlias: string, controllerType: AppComponentType, instanceRootDOMElement?: HTMLElement)=> AppArchitectureHelper): DOMComponentInstanceReg {
        const uniqueComponentInstanceId = `${this.#uniqueAlias.replace("Controller", "")}-${this.#createdInstancesCount}`;
        let componentInstance = null;
        if (this.#componentInstanceControllerClass){
            const appHelper = getCustomAppHelper(uniqueComponentInstanceId, AppComponentType.InstanceController, DOMComponent);
            componentInstance = new this.#componentInstanceControllerClass(appHelper);
        }
        else if (this.#componentInstanceControllerFunction){
            const appHelper = getCustomAppHelper(uniqueComponentInstanceId, AppComponentType.InstanceFunctionalController, DOMComponent);
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
