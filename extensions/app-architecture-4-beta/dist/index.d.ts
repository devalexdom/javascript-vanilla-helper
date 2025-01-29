import { JSVanillaHelper, IJSVanillaHelper_Extension } from "jsvanillahelper-core";
import { App } from "./architecture-app";
declare class AppArchitecture4 implements IJSVanillaHelper_Extension {
    extensionName: string;
    version: number;
    helper: JSVanillaHelper;
    constructor();
    extendHelperInstance(helper: any): void;
    toggleLSDebugModeSetting(): void;
    createApp(setAsMainApp?: boolean): App;
    getApp(uniqueId: string): any;
    getMainApp(): object;
}
declare const helperScope: AppArchitecture4;
export default helperScope;
