import type { Symbol, SymbolType } from '../types';

/**
 * Slot symbol definitions
 */
export const SYMBOLS: Record<SymbolType, Symbol> = {
    cherries: { type: 'cherries', char: 'symbol_cherries', value: 5, name: 'Cherries' },
    lemon: { type: 'lemon', char: 'symbol_lemon', value: 5, name: 'Lemon' },
    melon: { type: 'melon', char: 'symbol_melon', value: 10, name: 'Melon' },
    bell: { type: 'bell', char: 'symbol_bell', value: 15, name: 'Bell' },
    bar1: { type: 'bar1', char: 'symbol_bar1', value: 20, name: 'Bar' },
    bar2: { type: 'bar2', char: 'symbol_bar2', value: 30, name: 'Double Bar' },
    bar3: { type: 'bar3', char: 'symbol_bar3', value: 40, name: 'Triple Bar' },
    lucky7: { type: 'lucky7', char: 'symbol_lucky7', value: 50, name: 'Lucky 7' },
    clover: { type: 'clover', char: 'symbol_clover', value: 15, name: 'Clover' },
    heart: { type: 'heart', char: 'symbol_heart', value: 15, name: 'Heart' },
    horseshoe: { type: 'horseshoe', char: 'symbol_horseshoe', value: 15, name: 'Horseshoe' },
    diamond: { type: 'diamond', char: 'symbol_diamond', value: 60, name: 'Diamond' },
    coins: { type: 'coins', char: 'symbol_coins', value: 70, name: 'Coins' },
};

/**
 * Get all available symbol types
 */
export function getAllSymbolTypes(): SymbolType[] {
    return Object.keys(SYMBOLS) as SymbolType[];
}

/**
 * Get symbol by type
 */
export function getSymbol(type: SymbolType): Symbol {
    return SYMBOLS[type];
}
