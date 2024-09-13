import { Block, ClassDeclaration } from "typescript";
import { EmbeddedImageLoaderServiceConfig } from "./embedded-image-loader";
import { JSVanillaHelper } from "jsvanillahelper-core";

export interface Architecture4AppSetup {
    id: Architecture4AppId,
    config: Architecture4AppConfig,
    contextVars?: { [key: string]: AppContextVar };
}

export interface Architecture4AppId {
    alias: string;
    uniqueId: string;
    buildNumber: number;
}

export interface Architecture4AppConfig {
    vendors: Array<VendorLoadConfiguration>;
    culture?: string;
    custom: { [key: string]: any | EmbeddedImageLoaderServiceConfig };
    errorManagement?: {
        hideCrashedDOMInstancesWhileRunning: boolean,
        hideCrashedDOMInstancesDuringInit: boolean
    }
}

export interface Architecture4App {
    getUniqueId(): string;
    getBuildNumber(): number;
    getCulture(): string;
    getConfig(key: string): any;
    registerService(uniqueAlias: string, serviceControllerClass: (new (appHelper?: AppArchitectureHelper) => Block), config: { generateInstanceBeforeInit: true }): void;
    registerSimpleController(uniqueAlias: string, controllerClass: (new (appHelper?: AppArchitectureHelper) => Block), config: { generateInstanceBeforeInit: false }): void;
    registerFunctionalSimpleController(uniqueAlias: string, controllerFunction: ((appHelper?: AppArchitectureHelper) => Block), config: {}): void;
    registerFunctionalInstancesController(uniqueAlias: string, instanceControllerFunction: ((appHelper?: AppArchitectureHelper) => Block), config: {}): void;
    start(): void;
}

export interface ArchitectureData {
    appInitTime: Date | null;
    appBeforeInitEventFired: boolean;
    appInitEventFired: boolean;
}

export interface VendorLoadConfiguration {
    triggerClass: string;
    conflictTriggerClass: Array<string>;
    scriptPath: string;
    loadEventName: string;
}

export interface ControllerToRegister {
    uniqueAlias: string;
    controllerClass: (new (appHelper?: AppArchitectureHelper) => Block) | null;
    controllerFunction: ((appHelper?: AppArchitectureHelper) => Block) | null;
}

export interface ServiceToRegister {
    uniqueAlias: string;
    serviceControllerClass: (new (appHelper?: AppArchitectureHelper) => Block) | null;
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
    V(target: any): JSVanillaHelper;
    V$(query: string): JSVanillaHelper;
    logOnDebug(content: any): void;
    warnOnDebug(content: any): void;
    reportError(message: string, content: any): void;
    whoIam(): { aliasOrId: string; type: AppComponentType };
    subscribe(appEventName: string, callback: (data: any) => any, targetId?: string): void;
    emit(customEventName: string, data?: any): void;
    getContextVar(variableName: string, newValueCallback?: (value: any) => any): any;
    setContextVar(variableName: string, value: any, readOnly?: boolean, scope?: Array<string>): void;
    getRootDOMElement(): HTMLElement;
}

export enum AppComponentType {
    Unknown = 0,
    SimpleController = 1,
    DOMInstanceController = 2,
    EmbeddedInstancesController = 3,
    Service = 4,
    SimpleFunctionalController = 5,
    DOMInstanceFunctionalController = 6
}