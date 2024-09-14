import { JSVanillaHelper, IJSVanillaHelper_Extension } from "jsvanillahelper-core";
import { App } from "./architecture-app";
import { Architecture4AppSetup } from "./models";

class AppArchitecture4 implements IJSVanillaHelper_Extension {
    extensionName: string;
    version: number;
    helper: JSVanillaHelper;
    constructor() {
        this.extensionName = 'AppArchitecture';
        this.version = 4.0;
    }

    extendHelperInstance(helper) {
        helper["createApp"] = this.createApp.bind(this);
        helper["toggleLSDebugModeSetting"] = this.toggleLSDebugModeSetting.bind(this);
        helper["getApp"] = this.getApp.bind(this);
        helper["getMainApp"] = this.getMainApp.bind(this);
    }

    toggleLSDebugModeSetting() {
        const debugMode = !!localStorage.getItem('JSVHAppArchitectureDebug');
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

    createApp(setAsMainApp = true): App {
        const { helper } = this;
        const t = helper.t as Architecture4AppSetup;

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

        const app = new App(t, helper);
        if (setAsMainApp) {
            helper.hData.reg.mainAppRef = app;
        }
        helper.hData.reg[`${t.id.uniqueId}_AppRef`] = app;
        return app;
    }

    getApp(uniqueId: string) {
        return this.helper.hData.reg[`${uniqueId}_AppRef`] ?? null;
    }

    getMainApp() {
        return this.helper.hData.reg.mainAppRef ?? null;
    }
}

const helperScope = new AppArchitecture4;
export default helperScope;