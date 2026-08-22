export const CHAIR_PART_NAMES = ['SheenChair_fabric', 'SheenChair_wood', 'SheenChair_metal', 'SheenChair_label'] as const;
export type ChairPartName = (typeof CHAIR_PART_NAMES)[number];

type ProductOption = {
    id: string;
    label: string;
    price: number;
    color: number;
    roughness?: number;
    metalness?: number;
}

type OptionCategory = {
    id: string;
    part: ChairPartName;
    label: string;
    options: ProductOption[];
}

export const PRODUCT_CATEGORIES = [
    {
        id: 'fabric',
        part: 'SheenChair_fabric',
        label: 'Fabric',
        options: [
            { id: 'mango-velvet', label: 'Mango Velvet', price: 0, color: 0xd4622a },
            { id: 'peacock-velvet', label: 'Peacock Velvet', price: 40, color: 0x1f4e5f },
            { id: 'green-cashmere', label: 'Green Cashmere', price: 65, color: 0x4a5d3a },
        ]
    },
    {
        id: 'wood',
        part: 'SheenChair_wood',
        label: 'Wood',
        options: [
            { id: 'brown', label: 'Brown', price: 0, color: 0x5c3a21 },
            { id: 'black', label: 'Black', price: 25, color: 0x1a1a1a },

        ]
    },
    {
        id: 'metal',
        part:'SheenChair_metal',
        label: 'Metal',
        options: [
            { id: 'steel', label: 'Steel', price: 0, color: 0x71797e, metalness: 1, roughness: 0.3
            },
            { id: 'grey', label: 'Grey', price: 15, color: 0x3a4247, metalness: 1, roughness: 0.3
            },
            { id: 'brass', label: 'Brass', price: 30, color: 0xb5a642, metalness: 1, roughness: 0.3
            },
            
        ]
    }
] as const satisfies readonly OptionCategory[];

export type CategoryId = (typeof PRODUCT_CATEGORIES)[number]['id'];
export type OptionId = (typeof PRODUCT_CATEGORIES)[number]['options'][number]['id'];