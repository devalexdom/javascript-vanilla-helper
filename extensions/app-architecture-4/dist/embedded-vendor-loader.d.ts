import { AppArchitectureHelper, VendorLoadConfiguration } from "./models";
export interface EmbeddedVendorLoaderServiceConfig {
    vendors: Array<VendorLoadConfiguration>;
}
export declare class EmbeddedVendorLoaderService {
    #private;
    constructor(appHelper: AppArchitectureHelper);
    requestVendorLoad(triggerClass?: string, loadCallback?: () => void): void;
}
