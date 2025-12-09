// Core game types and interfaces

export enum SymbolType {
    CHERRY = 'cherry',
    LEMON = 'lemon',
    ORANGE = 'orange',
    PLUM = 'plum',
    BELL = 'bell',
    BAR = 'bar',
    SEVEN = 'seven',
    DIAMOND = 'diamond',
    WILD = 'wild',
    SCATTER = 'scatter',
}

export interface Symbol {
    type: SymbolType;
    rarity: number; // 1-100, lower = rarer
    basePayout: number;
    color: string;
    char: string; // ASCII character for CRT display
}

export interface SlotConfig {
    rows: number;
    cols: number;
    spinCost: number;
}

export interface WinLine {
    symbols: SymbolType[];
    positions: number[][];
    payout: number;
    multiplier: number;
}

export interface GameState {
    // Currency
    coins: number;
    gems: number;

    // Run state
    currentStage: number;
    spinsRemaining: number;
    totalSpins: number;
    totalWinnings: number;

    // Slot configuration
    slotConfig: SlotConfig;

    // Unlocks & upgrades
    unlockedSymbols: SymbolType[];
    tempUpgrades: string[];
    permUpgrades: string[];

    // Stats
    biggestWin: number;
    longestRun: number;
    totalRuns: number;
}

export interface Upgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    costType: 'coins' | 'gems';
    isPermanent: boolean;
    effect: (state: GameState) => void;
    unlockCondition?: (state: GameState) => boolean;
}

export interface StageEvent {
    type: 'shop' | 'boss' | 'jackpot' | 'special';
    description: string;
    onEnter: (state: GameState) => void;
}
