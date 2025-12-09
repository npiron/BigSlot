import { Symbol, SymbolType } from '../types';

export const SYMBOLS: Record<SymbolType, Symbol> = {
    [SymbolType.CHERRY]: {
        type: SymbolType.CHERRY,
        rarity: 80,
        basePayout: 2,
        color: '#FF0055',
        char: 'symbol_cherries', // Changed to sprite key
    },
    [SymbolType.LEMON]: {
        type: SymbolType.LEMON,
        rarity: 75,
        basePayout: 3,
        color: '#FFEE00',
        char: 'symbol_lemon',
    },
    [SymbolType.ORANGE]: {
        type: SymbolType.ORANGE,
        rarity: 70,
        basePayout: 4,
        color: '#FF8800',
        char: 'symbol_melon', // Using melon as orange substitute
    },
    [SymbolType.PLUM]: {
        type: SymbolType.PLUM,
        rarity: 60,
        basePayout: 5,
        color: '#AA00FF',
        char: 'symbol_clover',
    },
    [SymbolType.BELL]: {
        type: SymbolType.BELL,
        rarity: 40,
        basePayout: 8,
        color: '#FFD700',
        char: 'symbol_bell',
    },
    [SymbolType.BAR]: {
        type: SymbolType.BAR,
        rarity: 30,
        basePayout: 12,
        color: '#00FFFF',
        char: 'symbol_bar1',
    },
    [SymbolType.SEVEN]: {
        type: SymbolType.SEVEN,
        rarity: 15,
        basePayout: 25,
        color: '#FF0000',
        char: 'symbol_lucky7',
    },
    [SymbolType.DIAMOND]: {
        type: SymbolType.DIAMOND,
        rarity: 5,
        basePayout: 100,
        color: '#00FFFF',
        char: 'symbol_bar3', // Using bar3 as diamond/rare symbol
    },
    [SymbolType.WILD]: {
        type: SymbolType.WILD,
        rarity: 10,
        basePayout: 0,
        color: '#00FF00',
        char: 'symbol_horseshoe', // Horseshoe as wild (lucky symbol)
    },
    [SymbolType.SCATTER]: {
        type: SymbolType.SCATTER,
        rarity: 12,
        basePayout: 0,
        color: '#FF00FF',
        char: 'symbol_heart', // Heart as scatter
    },
};

// Starter symbols (unlocked by default)
export const STARTER_SYMBOLS = [
    SymbolType.CHERRY,
    SymbolType.LEMON,
    SymbolType.ORANGE,
    SymbolType.PLUM,
    SymbolType.BELL,
];
