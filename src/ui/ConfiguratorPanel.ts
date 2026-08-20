import { type CategoryId, type OptionId, PRODUCT_CATEGORIES } from "../config/productConfig";
import type { ConfiguratorStore } from "../state/ConfiguratorStore";

const ACTIVE_CLASS = 'configurator-panel__button--active';
const FOCUS_CLASS = 'configurator-panel__section--focused';
const FOCUS_DURATION_MS = 800;

export class ConfiguratorPanel {
    private readonly root: HTMLDivElement;
    private readonly buttons = new Map<OptionId, HTMLButtonElement>();
    private readonly sections = new Map<CategoryId, HTMLDivElement>();
    private readonly priceElement: HTMLParagraphElement;
    private readonly store: ConfiguratorStore;
    private unsubscribe: (() => void) | null = null;
    private timeoutHandle: number | null = null;

    constructor(parent: HTMLElement, store: ConfiguratorStore) {
        this.store = store;
        this.root = document.createElement('div');
        this.root.className = 'configurator-panel';
        parent.appendChild(this.root);

        for (const category of PRODUCT_CATEGORIES) {
            const section = document.createElement('div');
            section.className = 'configurator-panel__section';
            this.root.appendChild(section);
            this.sections.set(category.id, section);

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

    focusCategory(categoryId: CategoryId): void {
        const section = this.sections.get(categoryId);
        if(!section) return;

        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        section.classList.add(FOCUS_CLASS);
        if(this.timeoutHandle !== null) clearTimeout(this.timeoutHandle);
        this.timeoutHandle = window.setTimeout(() => {
            section.classList.remove(FOCUS_CLASS);
        }, FOCUS_DURATION_MS);
    }

    dispose(): void {
        if(this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        if(this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
        this.root.remove();
    }
}