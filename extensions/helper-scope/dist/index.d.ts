import { JSVanillaHelper, IJSVanillaHelper_Extension } from "jsvanillahelper-core";
interface IHelperScopeBind {
    alias: string;
    binds: object;
    helperInstance?: JSVanillaHelper;
    isBinded?: boolean;
}
declare class HelperScope implements IJSVanillaHelper_Extension {
    scopeTarget: IHelperScopeBind;
    extensionName: string;
    version: number;
    helper: JSVanillaHelper;
    scopes: Map<string, IHelperScopeBind>;
    globalBindAlias: string;
    flags: object;
    constructor(globalBindAlias?: string);
    onAddExtension(): void;
    handleHelperScopeGlobalBind(): void;
    handleExtensionParameters(): void;
    declare(newScope: IHelperScopeBind, globalBindAlias?: string): any;
    handleGlobalHelperScopeInstance(globalBindAlias: string): any;
    getHelperInstance(scopeAlias: string): any;
    getSelector(selectorMethod: string): any;
    selectScope(scopeAlias: string): HelperScope;
    handleScope(scope: IHelperScopeBind): void;
    handleGlobalScopeBinds(scope: IHelperScopeBind): void;
    handleScopeBinds(scope: IHelperScopeBind): void;
    getHelperSelector(selectorMethod: string, helperInstance: JSVanillaHelper): any;
}
declare const helperScope: HelperScope;
export default helperScope;
