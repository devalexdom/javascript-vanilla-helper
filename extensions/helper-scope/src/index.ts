import { JSVanillaHelper, IJSVanillaHelper_Extension } from "jsvanillahelper-core";


interface IHelperScopeBind {
    alias: string;
    binds: object;
    helperInstance?: JSVanillaHelper;
    isBinded?: boolean;
}

interface IHelperScopeDeclareBind {
    alias: string;
    binds: string[];
    helperInstance: JSVanillaHelper;
}

class HelperScope implements IJSVanillaHelper_Extension {
    scopeTarget: IHelperScopeBind;
    extensionName: string;
    version: number;
    helper: JSVanillaHelper;
    scopes: Map<string, IHelperScopeBind>;
    globalBindAlias: string;
    flags: object;
    constructor(globalBindAlias?: string) {
        this.extensionName = 'helperScope';
        this.version = 1.31;
        this.scopes = new Map<string, IHelperScopeBind>();
        this["_"] = this.getSelector;
        this["$cope"] = this.selectScope;
        this.globalBindAlias = globalBindAlias;
        this.flags = {
            extAdded: false
        };
    }

    onAddExtension(): void {
        if (!this.flags["extAdded"]) {
            this.scopes["default"] = { alias: "default", helperInstance: this.helper, binds: {}, isBinded: true };
            this.scopeTarget = this.scopes["default"];
            this.handleHelperScopeGlobalBind();
            this.flags["extAdded"] = true;
        }
    }

    handleHelperScopeGlobalBind() {
        if (this.globalBindAlias) {
            window[this.globalBindAlias] = this;
        }
    }

    handleExtensionParameters(): void {
        Object.keys(this.scopes).forEach((scopeAlias) => this.handleScope(this.scopes[scopeAlias]));
    }

    declare(newScope: IHelperScopeDeclareBind, globalBindAlias?: string) {
        this.globalBindAlias = globalBindAlias;
        const hsInstance = this.handleGlobalHelperScopeInstance(globalBindAlias);
        const newBindsObj = newScope.binds.reduce((bindsObj, current) => { //Transforms simple String[] to Object Key -> value. Ex ["V", "$V"] to {"V": "V", "$V": "$V"}
            bindsObj[current] = current;
            return bindsObj;
        }, {});
        hsInstance.scopes[newScope.alias] = { alias: newScope.alias, helperInstance: newScope.helperInstance, binds: newBindsObj, isBinded: false };
        hsInstance.handleExtensionParameters();
        return hsInstance;
    }

    handleGlobalHelperScopeInstance(globalBindAlias: string) {
        if (globalBindAlias && window[globalBindAlias] instanceof HelperScope) {
            console.log(`Found & using a global HelperScope ${window[globalBindAlias].version} instance`);
            return window[globalBindAlias];
        }
        return this;
    }

    getHelperInstance(scopeAlias: string) {
        return this.scopes[scopeAlias].helperInstance;
    }

    getSelector(selectorMethod: string) {
        return this.scopeTarget.binds[selectorMethod];
    }

    selectScope(scopeAlias: string): HelperScope {
        this.scopeTarget = this.scopes[scopeAlias];
        return this;
    }

    handleScope(scope: IHelperScopeBind) {
        if (scope.isBinded) return;
        if (!scope.helperInstance) {
            scope.helperInstance = new JSVanillaHelper();
        }
        if (scope.alias === "global" || scope.alias === "window") {
            this.handleGlobalScopeBinds(scope);
        }
        else {
            this.handleScopeBinds(scope);
        }
    }

    handleGlobalScopeBinds(scope: IHelperScopeBind): void {
        const existingInstance = window["V"] || window["V$"] || window["V$I"] || window["V$C"];

        if (existingInstance) {
            const version = existingInstance().version || existingInstance().versionNumber;
            console.error("GlobalScope: Two instances of JSVanillaHelper cannot exist in a global scope");
            console.error(`Found JSVanillaHelper (Core) ${version}`);
            return;
        }

        Object.keys(scope.binds).forEach((bindKey: string) => {
            const hS = this.getHelperSelector(scope.binds[bindKey], scope.helperInstance);
            window[bindKey] = hS;
            scope.binds[bindKey] = hS;
        });

        scope.isBinded = true;
    }

    handleScopeBinds(scope: IHelperScopeBind) {
        Object.keys(scope.binds).forEach((bindKey: string) => {
            scope.binds[bindKey] = this.getHelperSelector(scope.binds[bindKey], scope.helperInstance);
        });

        scope.isBinded = true;
    }

    getHelperSelector(selectorMethod: string, helperInstance: JSVanillaHelper) {
        const _this = this;
        return (() => {
            switch (selectorMethod) {
                case "V":
                    return function (t: any = null) {
                        return this.setTarget(t);
                    }
                case "V$":
                    return function (query: string) {
                        return this.setTarget(document.querySelectorAll(query));
                    }
                case "V$C":
                    return function (className: string) {
                        return this.setTarget(document.getElementsByClassName(className));
                    }
                case "V$I":
                    return function (id: string = null) {
                        return this.setTarget(document.getElementById(id));
                    }
                case "_V":
                    return function (t: any = null) {
                        return new JSVanillaHelper(t);
                    }
                case "_V$":
                    return function (query: string = null) {
                        return new JSVanillaHelper(document.querySelectorAll(query));
                    }
                default:
                    console.error(`Selector method: "${selectorMethod}" is not recognized & supported in HelperScope ${_this.version}`);
                    break;
            }
        })().bind(helperInstance);
    }
}

const helperScope = new HelperScope();
export default helperScope;