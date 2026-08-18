import { PRODUCT_CATEGORIES, type CategoryId, type OptionId } from "../config/productConfig";

export type ConfiguratorState = Record<CategoryId, OptionId>;

const BASE_PRICE = 50;

export class ConfiguratorStore {
   private state: ConfiguratorState = {
        'fabric': 'mango-velvet',
        'wood': 'brown',
    }
    private readonly listeners: (() => void)[] = [];
    private isNotifying = false;

    getState(): Readonly<ConfiguratorState> {
        return this.state;
    }

    subscribe(listener: () => void): () => void {
        this.listeners.push(listener);

        return () => {
            const index = this.listeners.indexOf(listener);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        }
    }

    private notify(): void {
        for (const listener of [...this.listeners]) listener();
    }

    select(categoryId: CategoryId, optionId: OptionId): void {
        const category = PRODUCT_CATEGORIES.find((c) => (c.id === categoryId));
        if (!category) throw new Error(`ConfiguratorStore: unknown category "${categoryId}"`);

        if(!category.options.some((o) => o.id === optionId))
        throw new Error(`ConfiguratorStore: option "${optionId}" is not valid for "${categoryId}"`);

        if (this.isNotifying) {
            console.warn('ConfiguratorStore: select called during notify');
            return;
        }
        this.state[categoryId] = optionId;
        this.isNotifying = true;
        try {
            this.notify();
        } finally {
            this.isNotifying = false;
        }
    }

    getPrice(): number {
        let total = 0;
        for (const category of PRODUCT_CATEGORIES) {
            const selectedOptionId = this.state[category.id];
            const option = category.options.find((o) => o.id === selectedOptionId)
            total += option?.price ?? 0;
        }

        return BASE_PRICE + total;
    }
}
