import { EmbeddedImageLoaderServiceConfig } from "./embedded-image-loader";
import { JSVanillaHelper } from "jsvanillahelper-core";
export interface Architecture4AppSetup {
    id: Architecture4AppId;
    config: Architecture4AppConfig;
    contextVars?: {
        [key: string]: AppContextVar;
    };
}
export interface Architecture4AppId {
    alias: string;
    uniqueId: string;
    buildNumber: number;
}
export interface Architecture4AppConfig {
    vendors: Array<VendorLoadConfiguration>;
    culture?: string;
    custom: {
        [key: string]: any | EmbeddedImageLoaderServiceConfig;
    };
    errorManagement?: {
        hideCrashedDOMInstancesWhileRunning: boolean;
        hideCrashedDOMInstancesDuringInit: boolean;
    };
}
export interface Architecture4App {
    getUniqueId(): string;
    getBuildNumber(): number;
    getCulture(): string;
    getConfig(key: string): any;
    registerService(uniqueAlias: string, serviceControllerClass: (new (appHelper?: AppArchitectureHelper) => any), config?: {
        generateInstanceBeforeInit: true;
    }): void;
    registerSimpleController(uniqueAlias: string, controllerClass: (new (appHelper?: AppArchitectureHelper) => any), config?: {
        generateInstanceBeforeInit: false;
    }): void;
    registerFunctionalSimpleController(uniqueAlias: string, controllerFunction: ((appHelper?: AppArchitectureHelper) => any), config?: {}): void;
    registerFunctionalInstancesController(uniqueAlias: string, instanceControllerFunction: ((appHelper?: AppArchitectureHelper) => any), config?: {}): void;
    start(): void;
}
export interface ArchitectureData {
    appInitTime: Date | null;
    appBeforeInitEventFired: boolean;
    appInitEventFired: boolean;
    appServicesInitEventSubscribedControllers: Set<string>;
    appServicesInitEventCompletedControllers: Set<string>;
}
export interface VendorLoadConfiguration {
    triggerClass: string;
    conflictTriggerClass: Array<string>;
    scriptPath: string;
    loadEventName: string;
    loaded?: boolean;
    requested?: boolean;
}
export interface ControllerToRegister {
    uniqueAlias: string;
    controllerClass: (new (appHelper?: AppArchitectureHelper) => any) | null;
    controllerFunction: ((appHelper?: AppArchitectureHelper) => any) | null;
}
export interface ServiceToRegister {
    uniqueAlias: string;
    serviceControllerClass: (new (appHelper?: AppArchitectureHelper) => any) | null;
}
export interface DOMComponentInstanceReg {
    uniqueId: string;
    instancesControllerUniqueId: string;
    rootDOMElement: HTMLElement;
    componentInstance: any;
}
export interface AppContextVar {
    alias: string;
    value: any;
    scope?: Array<string>;
    readOnly?: boolean;
    creatorId?: string;
}
export interface AppErrorData {
    url: string;
    errorDetails: any;
    controllerType: AppComponentType;
    uncontrolledError: boolean;
}
export interface AppArchitectureHelper {
    getService(serviceAlias: string): any;
    getController(controllerAlias: string): any;
    getInstanceControllerById(instanceUniqueId: string): any;
    getInstanceController(instanceRootDOMElement: HTMLElement): any;
    getCurrentCulture(): string;
    getConfig(key: string): any;
    V(target?: any): JSVanillaHelper;
    V$(query: string): JSVanillaHelper;
    logOnDebug(content: any): void;
    warnOnDebug(content: any): void;
    reportError(message: string, content: any): void;
    whoIam(): {
        aliasOrId: string;
        type: AppComponentType;
    };
    subscribe(appEventName: string, callback: (data: any, originId: string) => void, targetId?: string): void;
    emit(customEventName: string, data?: any): void;
    getContextVar(variableName: string, newValueCallback?: (value: any) => any): any;
    setContextVar(variableName: string, value: any, readOnly?: boolean, scope?: Array<string>): void;
    getRootDOMElement(): HTMLElement;
}
export declare enum AppComponentType {
    Unknown = 0,
    SimpleController = 1,
    DOMInstanceController = 2,
    EmbeddedInstancesController = 3,
    Service = 4,
    SimpleFunctionalController = 5,
    DOMInstanceFunctionalController = 6
}
