import { beforeEach, describe, it, expect } from 'vitest';
import { ConfiguratorStore } from './ConfiguratorStore';

describe('ConfiguratorStore', () => {
    let store: ConfiguratorStore;

    beforeEach(() => store = new ConfiguratorStore());

    it('starts with the default configuration', () => {
        expect(store.getState().fabric).toBe('mango-velvet');
    });

    it('changes state on select', () => {
        store.select('metal', 'brass');
        expect(store.getState().metal).toBe('brass');
    });

    it('return base price with default selections', () => {
        expect(store.getPrice()).toBe(50);
    });

    it('returns the right price after selecting a paid option', () => {
        store.select('wood', 'black');
        expect(store.getPrice()).toBe(75);
    });

    it('calls a subscriber when state changes', () => {
        let calls = 0;

        store.subscribe(() => {
            calls += 1;
        })
        store.select('metal', 'brass');

        expect(calls).toBe(1);
    });

    it('does not call a subscriber after the subscriber is unsubscribed', () => {
        let calls = 0;
        const unsubscribe = store.subscribe(() => {
            calls += 1;
        });
        unsubscribe();
        store.select('metal', 'brass');
        expect(calls).toBe(0);
    });

    it('throws when an option from the wrong category is selected', () => {
        expect(() => store.select('fabric', 'black')).toThrow(/not valid for/);
    })

})