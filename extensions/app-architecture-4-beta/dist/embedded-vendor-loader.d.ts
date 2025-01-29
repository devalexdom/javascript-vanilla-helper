import { AppArchitectureHelper, VendorLoadConfiguration } from "./models";
export interface EmbeddedVendorLoaderServiceConfig {
    vendors: Array<VendorLoadConfiguration>;
}
export declare class EmbeddedVendorLoaderService {
    #private;
    constructor(appHelper: AppArchitectureHelper);
    requestVendorLoad(uniqueName: string, loadCallback?: () => void): void;
}
