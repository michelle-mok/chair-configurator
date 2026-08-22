import { describe, it, expect } from 'vitest';
import { PRODUCT_CATEGORIES, CHAIR_PART_NAMES, type OptionId } from './productConfig';

describe('productConfig', () => {
    it('checks that option ids are globally unique', ()  => {
        const optionArray: OptionId[] = [];
        for (const category of PRODUCT_CATEGORIES) {
            for (const option of category.options) {
                optionArray.push(option.id);
            }
        }
        const duplicates = optionArray.filter((id, i) => optionArray.indexOf(id) !== i);
        expect(duplicates).toEqual([]);
    });

    it('checks that each part in a category exists in CHAIR_PART_NAME', () => {

        for (const category of PRODUCT_CATEGORIES) {
            expect(CHAIR_PART_NAMES).toContain(category.part);
        };
    });

    it('checks that every category has at least 1 option', () => {
        for (const category of PRODUCT_CATEGORIES) {
            expect(category.options.length).toBeGreaterThan(0);

        }
    })

    it('checks that at least one option has price:0', () => {
       
        for (const category of PRODUCT_CATEGORIES) {
             const optionPrices = [];

            for(const option of category.options) {
                optionPrices.push(option.price);
            }
            expect(optionPrices).toContain(0);
        };
    });
})