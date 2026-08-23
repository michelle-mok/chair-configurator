import { PRODUCT_CATEGORIES, type CategoryId, type OptionId } from "../config/productConfig";
import type { ConfiguratorStore } from "../state/ConfiguratorStore";

export function parseConfigQuery(query: string): [CategoryId, OptionId][] {
    const configArray: [CategoryId, OptionId][] = [];
    const params = new URLSearchParams(query);

    for(const [key, value] of params) {
        const category = PRODUCT_CATEGORIES.find((c) => c.id === key);
        if(!category) {
            console.warn(`Ignoring unknown category in URL: ${key}`);
            continue;
        }
        const option = category.options.find((o) => o.id === value);
        if(!option) {
            console.warn(`Unknown option in URL: ${value}`);
            continue;
        }
        configArray.push([category.id, option.id]);
    }
    return configArray;
};

export class UrlSync {
    private readonly store:  ConfiguratorStore;
    private unsubscribe: (() => void) | null = null;

    constructor(store: ConfiguratorStore) {
        this.store = store;

        for (const [categoryId, optionId] of parseConfigQuery(window.location.search)) {
            this.store.select(categoryId, optionId);
        }
        
        this.unsubscribe = store.subscribe(() => {
            this.writeUrl();
        })
    }

    private writeUrl(): void {
        const params = new URLSearchParams(window.location.search);
        const state = this.store.getState();
        for (const category of PRODUCT_CATEGORIES) {
            params.set(category.id, state[category.id]);
        }
        window.history.replaceState(null, '', `?${params.toString()}`);
    }

    dispose(): void {
        if(this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
}