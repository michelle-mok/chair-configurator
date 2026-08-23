import { describe, it, expect } from 'vitest';
import { parseConfigQuery } from './UrlSync';

describe('parseConfigQuery', () => {
    it('return both pairs on valid query', () => {
        expect(parseConfigQuery('?fabric=mango-velvet&wood=brown&metal=brass')).toEqual([
            ['fabric', 'mango-velvet'],
            ['wood', 'brown'],
            ['metal', 'brass'],
        ]);
    });

    it('omits unknown categories', () => {
        expect(parseConfigQuery('?leather=mango-velvet&wood=brown')).toEqual([
            ['wood', 'brown']
        ]);
    });

    it('omits unknown options', () => {
        expect(parseConfigQuery('?fabric=cotton&wood=brown')).toEqual([
            ['wood', 'brown']
        ]);
    });

    it('omits wrong-category pairing', () => {
        expect(parseConfigQuery('?fabric=black&wood=black')).toEqual([
            ['wood', 'black']
        ]);
    });

    it('returns an empty array when the query is an empty string', () => {
        expect(parseConfigQuery('')).toEqual([]);
    });

    it('returns only the valid pairs', () => {
        expect(parseConfigQuery('?pizza=yummy&metal=brass')).toEqual([
            ['metal', 'brass']
        ])
    })
})