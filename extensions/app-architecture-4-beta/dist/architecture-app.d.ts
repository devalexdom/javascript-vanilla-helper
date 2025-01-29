import { JSVanillaHelper } from "jsvanillahelper-core";
import { AppArchitectureHelper, Architecture4App, Architecture4AppSetup, ArchitectureData } from "./models";
export declare class App implements Architecture4App {
    #private;
    constructor(appSetup: Architecture4AppSetup, helper: JSVanillaHelper);
    debug(): {
        services: {
            [key: string]: any;
        };
        controllers: {
            [key: string]: any;
        };
        data: ArchitectureData;
    };
    getUniqueId(): string;
    getBuildNumber(): number;
    getCulture(): string;
    getConfig(key: string): any;
    registerSimpleController(uniqueAlias: string, controllerClass: (new (appHelper?: AppArchitectureHelper) => any), config?: {
        generateInstanceBeforeInit: false;
    }): void;
    registerFunctionalSimpleController(uniqueAlias: string, controllerFunction: ((appHelper?: AppArchitectureHelper) => any), config?: {
        generateInstanceBeforeInit: false;
    }): void;
    registerService(uniqueAlias: string, serviceControllerClass: (new (appHelper?: AppArchitectureHelper) => any), config?: {}): void;
    registerInstancesController(uniqueAlias: string, instanceControllerClass: (new (appHelper?: AppArchitectureHelper) => any), config?: {}): void;
    registerFunctionalInstancesController(uniqueAlias: string, instanceControllerFunction: ((appHelper?: AppArchitectureHelper) => any), config?: {}): void;
    start(): void;
    getService(serviceAlias: string): any;
    getController(controllerAlias: string): any;
    getInstanceControllerById(componentUniqueId: string): any;
    getInstanceController(instanceRootDOMElement: HTMLElement): any;
}
