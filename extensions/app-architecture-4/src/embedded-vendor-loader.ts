import { AppArchitectureHelper, VendorLoadConfiguration } from "./models";


export interface EmbeddedVendorLoaderServiceConfig {
    vendors: Array<VendorLoadConfiguration>;
}

//Migrated from legacy AppArchitecture vendor loader.

export class EmbeddedVendorLoaderService {
    #config: EmbeddedVendorLoaderServiceConfig;
    #appHelper: AppArchitectureHelper;
    constructor(appHelper: AppArchitectureHelper) {
        this.#appHelper = appHelper;
        this.#config = {
            vendors: []
        };

        const customConfig = appHelper.getConfig("vendorLoader");

        if (customConfig) {
            this.#config = { ...this.#config, ...customConfig };
        }
        else if (customConfig === false) return;

        appHelper.subscribe("AppServicesInit", () => this.#init());
    }

    #init() {
        this.#config.vendors.forEach((vendor) => {
            this.#handleVendorLoad(vendor);
        });
    }

    requestVendorLoad(triggerClass = '', loadCallback = () => { }) {
        this.#config.vendors.forEach((vendor) => {
            if (vendor.triggerClass === triggerClass && !vendor.loaded) {
                vendor.requested = true;
                this.#handleVendorLoad(vendor);
                window.addEventListener(vendor.loadEventName, loadCallback);
            } else if (vendor.triggerClass === triggerClass && vendor.loaded) {
                loadCallback();
            }
        });
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
                    if (this.#appHelper.getContextVar("isAppInDebugMode")) {
                        V().console(
                            'log',
                            `🧱 Vendor ${vendor.scriptPath} ${vendor.requested ? "loaded by request." : "loaded by trigger CSS class."}`
                        );
                    }
                    V(window).dispatchEvent(vendor.loadEventName);
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