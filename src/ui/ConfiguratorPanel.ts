import { type OptionId, PRODUCT_CATEGORIES } from "../config/productConfig";
import type { ConfiguratorStore } from "../state/ConfiguratorStore";

const ACTIVE_CLASS = 'configurator-panel__button--active';

export class ConfiguratorPanel {
    private readonly root: HTMLDivElement;
    private readonly buttons = new Map<OptionId, HTMLButtonElement>();
    private readonly priceElement: HTMLParagraphElement;
    private readonly store: ConfiguratorStore;
    private unsubscribe: (() => void) | null = null;

    constructor(parent: HTMLElement, store: ConfiguratorStore) {
        this.store = store;
        this.root = document.createElement('div');
        this.root.className = 'configurator-panel';
        parent.appendChild(this.root);

        for (const category of PRODUCT_CATEGORIES) {
            const section = document.createElement('div');
            section.className = 'configurator-panel__section';
            this.root.appendChild(section);

            const label = document.createElement('p');
            label.className = 'configurator-panel__label';
            label.textContent = category.label;
            section.appendChild(label);

            for (const option of category.options) {
                const optionButton = document.createElement('button');
                optionButton.className = 'configurator-panel__button';
                optionButton.style.backgroundColor = `#${option.color.toString(16).padStart(6, '0')}`;
                optionButton.title = option.label;
                optionButton.setAttribute('aria-label', option.label);
                section.appendChild(optionButton);
                this.buttons.set(option.id, optionButton);
                const selectOption = () => store.select(category.id, option.id);
                optionButton.addEventListener('click', selectOption);
            }
        }
        this.priceElement = document.createElement('p');
        this.priceElement.className = 'configurator-panel__price';
        this.root.appendChild(this.priceElement);

        this.render();
        this.unsubscribe = store.subscribe(() => {
            this.render();
        })
    }

    private render(): void {
        const state = this.store.getState();
        for (const category of PRODUCT_CATEGORIES) {
            const selectedId = state[category.id];

            for (const option of category.options) {
                const button = this.buttons.get(option.id);
                if(!button) continue;

                button.classList.toggle(ACTIVE_CLASS, option.id === selectedId);
            }
        }
        this.priceElement.textContent = `£${this.store.getPrice()}`
    }

    dispose(): void {
        if(this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        this.root.remove();
    }
}