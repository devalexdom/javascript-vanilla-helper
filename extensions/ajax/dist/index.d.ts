import { JSVanillaHelper, IJSVanillaHelper_Extension } from "jsvanillahelper-core";
declare class Ajax implements IJSVanillaHelper_Extension {
    extensionName: string;
    version: number;
    helper: JSVanillaHelper;
    extendHelperInstance?: Function;
    extendHelperPrototype?: Function;
    constructor(installGlobally?: boolean);
    extendHelper(helper: any): void;
}
declare const ajax: Ajax;
export default ajax;
