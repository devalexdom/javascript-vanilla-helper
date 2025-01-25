import { AppArchitectureHelper, VendorLoadConfiguration } from "./models";


export interface EmbeddedVendorLoaderServiceConfig {
    vendors: Array<VendorLoadConfiguration>;
}

//Migrated from legacy AppArchitecture vendor loader.

export class EmbeddedVendorLoaderService {
    #config: EmbeddedVendorLoaderServiceConfig;
    #appHelper: AppArchitectureHelper;
    #vendors: { [key: string]: VendorLoadConfiguration }
    constructor(appHelper: AppArchitectureHelper) {
        this.#appHelper = appHelper;
        this.#config = {
            vendors: []
        };
        this.#vendors = {};

        const customConfig = appHelper.getConfig("vendorLoader");

        if (customConfig) {
            this.#config = { ...this.#config, ...customConfig };
        }
        else if (customConfig === false) return;

        appHelper.subscribe("AppServicesInit", () => this.#init());
    }

    #init() {
        this.#vendors = this.#config.vendors.reduce((vendorsIndex, vendor) => {
            vendorsIndex[vendor.uniqueName] = { ...vendor, requested: false, loaded: false };
            return vendorsIndex;
        }, {});
        this.#config.vendors.forEach((vendor) => {
            this.#handleVendorLoad(vendor);
        });
    }

    requestVendorLoad(uniqueName: string, loadCallback = () => { }) {
        const vendor = this.#vendors[uniqueName];
        if (vendor) {
            if (!vendor.loaded) {
                vendor.requested = true;
                this.#handleVendorLoad(vendor);
                window.addEventListener(vendor.loadEventName ?? `VendorLoader_${uniqueName}_Load`, loadCallback);
            }
            else {
                loadCallback();
            }
        }
        else {
            this.#appHelper.reportError(`No vendor with unique name "${uniqueName}" found.`, null);
        }
    }

    #isVendorConflicted(vendor: VendorLoadConfiguration) {
        return vendor.conflictTriggerClass?.reduce((conflict, triggerClass) => {
            return conflict || document.getElementsByClassName(triggerClass).length > 0;
        }, false) ?? false;
    }

    #handleVendorLoad(vendor: VendorLoadConfiguration) {
        if (!this.#isVendorConflicted(vendor)) {
            if (document.getElementsByClassName(vendor.triggerClass).length > 0 || vendor.requested) {
                const { V } = this.#appHelper;
                const onLoadFunc = () => {
                    this.#appHelper.logOnDebug(`🧱 Vendor ${vendor.scriptPath} ${vendor.requested ? "loaded by request." : "loaded by trigger CSS class."}`, false);
                    this.#appHelper.emit(`${vendor.uniqueName}VendorLoad`);
                    V(window).dispatchEvent(vendor.loadEventName ?? `VendorLoader_${vendor.uniqueName}_Load`);
                    vendor.loaded = true;
                };
                if (!document.getElementById(`${vendor.triggerClass}-script`)) {
                    V(document.head).addScriptFile(
                        vendor.scriptPath,
                        onLoadFunc,
                        `${vendor.triggerClass}-script`
                    );
                }
            }
        }
    }
}