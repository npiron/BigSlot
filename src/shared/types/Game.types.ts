/**
 * Shared type definitions for the entire application
 */

export interface GameState {
    coins: number;
    gems: number;
    currentStage: number;
    spinsRemaining: number;
    slotConfig: SlotConfig;
    unlockedSymbols: SymbolType[];
    upgrades: Record<string, number>;
    // Persistence Stats
    totalWinnings: number;
    totalRuns: number;
    longestRun: number;
    biggestWin: number;
}

export interface SlotConfig {
    rows: number;
    cols: number;
    spinCost: number;
}

export type SymbolType =
    | 'cherries'
    | 'lemon'
    | 'melon'
    | 'bell'
    | 'bar1'
    | 'bar2'
    | 'bar3'
    | 'lucky7'
    | 'clover'
    | 'heart'
    | 'horseshoe'
    | 'diamond'
    | 'coins';

export interface Symbol {
    type: SymbolType;
    char: string;  // Texture key
    value: number;
    name: string;
}

export interface WinLine {
    symbolType: SymbolType;
    count: number;
    payout: number;
    positions: [number, number][]; // [col, row]
}
