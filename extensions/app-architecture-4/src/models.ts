import { Block, ClassDeclaration } from "typescript";

export interface Architecture4AppSetup {
    id: Architecture4AppId,
    config: Architecture4AppConfig
}

export interface Architecture4AppId {
    alias: string;
    uniqueId: string;
    buildNumber: number;
}

export interface Architecture4AppConfig {
    vendors: Array<VendorLoadConfiguration>;
    culture?: string;
    custom: { [key: string]: any };
}


export interface Architecture4App {
    getUniqueId(): string;
    getBuildNumber(): number;
    getCulture(): string;
    getConfig(key: string): any;
    registerService(uniqueAlias: string, serviceControllerClass: (new (appHelper?: AppArchitectureHelper) => Block), config: { generateInstanceBeforeInit: true }): void;
    registerSimpleController(uniqueAlias: string, controllerClass: (new (appHelper?: AppArchitectureHelper) => Block), config: { generateInstanceBeforeInit: false }): void;
    registerFunctionalSimpleController(uniqueAlias: string, controllerFunction: ( (appHelper?: AppArchitectureHelper) => Block), config: {}): void;
    registerFunctionalInstancesController(uniqueAlias: string, instanceControllerFunction: ((appHelper?: AppArchitectureHelper) => Block), config: {}): void;
    initialize(): void;
    architectureData: ArchitectureData;
}

export interface ArchitectureData {
    appInitTime: Date;
    appReadyTime: Date;
    controllers: { [key: string]: any };
    services: { [key: string]: any };
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

export interface AppArchitectureHelper {
    getService(serviceAlias: string): any;
    getController(controllerAlias: string): any;
    getInstanceControllerById(instanceUniqueId: string): any;
    getInstanceController(instanceRootDOMElement: HTMLElement): any;
    getCurrentCulture(): string;
    logOnDebug(content: any): void;
    warnOnDebug(content: any): void;
    reportError(message: string, content: any): void;
    whoIam(): {aliasOrId: string; type: AppComponentType};
    subscribe(appEventName: string, callback: Function):void;
    getRootDOMElement(): HTMLElement;
}

export enum AppComponentType {
    Unknown = 0,
    SimpleController = 1,
    InstanceController = 2,
    EmbeddedInstancesController = 3,
    Service = 4,
    SimpleFunctionalController = 5,
    InstanceFunctionalController = 6
  }