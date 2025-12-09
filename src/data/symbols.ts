import { Symbol, SymbolType } from '../types';

export const SYMBOLS: Record<SymbolType, Symbol> = {
    [SymbolType.CHERRY]: {
        type: SymbolType.CHERRY,
        rarity: 80,
        basePayout: 2,
        color: '#FF0055',
        char: 'C',
    },
    [SymbolType.LEMON]: {
        type: SymbolType.LEMON,
        rarity: 75,
        basePayout: 3,
        color: '#FFEE00',
        char: 'L',
    },
    [SymbolType.ORANGE]: {
        type: SymbolType.ORANGE,
        rarity: 70,
        basePayout: 4,
        color: '#FF8800',
        char: 'O',
    },
    [SymbolType.PLUM]: {
        type: SymbolType.PLUM,
        rarity: 60,
        basePayout: 5,
        color: '#AA00FF',
        char: 'P',
    },
    [SymbolType.BELL]: {
        type: SymbolType.BELL,
        rarity: 40,
        basePayout: 8,
        color: '#FFD700',
        char: 'B',
    },
    [SymbolType.BAR]: {
        type: SymbolType.BAR,
        rarity: 30,
        basePayout: 12,
        color: '#00FFFF',
        char: '=',
    },
    [SymbolType.SEVEN]: {
        type: SymbolType.SEVEN,
        rarity: 15,
        basePayout: 25,
        color: '#FF0000',
        char: '7',
    },
    [SymbolType.DIAMOND]: {
        type: SymbolType.DIAMOND,
        rarity: 5,
        basePayout: 100,
        color: '#00FFFF',
        char: '♦',
    },
    [SymbolType.WILD]: {
        type: SymbolType.WILD,
        rarity: 10,
        basePayout: 0,
        color: '#00FF00',
        char: 'W',
    },
    [SymbolType.SCATTER]: {
        type: SymbolType.SCATTER,
        rarity: 12,
        basePayout: 0,
        color: '#FF00FF',
        char: '*',
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
