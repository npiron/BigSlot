import { GameState, SymbolType } from '../types';
import { CONFIG } from '../data/config';
import { STARTER_SYMBOLS } from '../data/symbols';

class GameStateManager {
    private state: GameState;

    constructor() {
        this.state = this.createInitialState();
    }

    private createInitialState(): GameState {
        return {
            coins: CONFIG.STARTING_COINS,
            gems: 0,
            currentStage: 1,
            spinsRemaining: CONFIG.INITIAL_SPINS,
            totalSpins: 0,
            totalWinnings: 0,
            slotConfig: {
                rows: CONFIG.INITIAL_ROWS,
                cols: CONFIG.INITIAL_COLS,
                spinCost: CONFIG.INITIAL_SPIN_COST,
            },
            unlockedSymbols: [...STARTER_SYMBOLS],
            tempUpgrades: [],
            permUpgrades: [],
            biggestWin: 0,
            longestRun: 0,
            totalRuns: 0,
        };
    }

    getState(): GameState {
        return this.state;
    }

    addCoins(amount: number): void {
        this.state.coins += amount;
        this.state.totalWinnings += amount;

        // Update biggest win
        if (amount > this.state.biggestWin) {
            this.state.biggestWin = amount;
        }
    }

    spendCoins(amount: number): boolean {
        if (this.state.coins >= amount) {
            this.state.coins -= amount;
            return true;
        }
        return false;
    }

    addGems(amount: number): void {
        this.state.gems += amount;
    }

    spendGems(amount: number): boolean {
        if (this.state.gems >= amount) {
            this.state.gems -= amount;
            return true;
        }
        return false;
    }

    consumeSpin(): boolean {
        if (this.state.spinsRemaining > 0) {
            this.state.spinsRemaining--;
            this.state.totalSpins++;
            return true;
        }
        return false;
    }

    nextStage(): void {
        this.state.currentStage++;
        this.state.spinsRemaining += CONFIG.SPINS_PER_STAGE;
    }

    unlockSymbol(symbol: SymbolType): void {
        if (!this.state.unlockedSymbols.includes(symbol)) {
            this.state.unlockedSymbols.push(symbol);
        }
    }

    addTempUpgrade(upgradeId: string): void {
        if (!this.state.tempUpgrades.includes(upgradeId)) {
            this.state.tempUpgrades.push(upgradeId);
        }
    }

    addPermUpgrade(upgradeId: string): void {
        if (!this.state.permUpgrades.includes(upgradeId)) {
            this.state.permUpgrades.push(upgradeId);
        }
    }

    expandSlot(rows: number, cols: number): void {
        this.state.slotConfig.rows = Math.min(rows, CONFIG.MAX_ROWS);
        this.state.slotConfig.cols = Math.min(cols, CONFIG.MAX_COLS);
    }

    startNewRun(): void {
        const permUpgrades = [...this.state.permUpgrades];
        const gems = this.state.gems;
        const biggestWin = this.state.biggestWin;
        const longestRun = Math.max(this.state.longestRun, this.state.currentStage);
        const totalRuns = this.state.totalRuns + 1;

        this.state = this.createInitialState();
        this.state.permUpgrades = permUpgrades;
        this.state.gems = gems;
        this.state.biggestWin = biggestWin;
        this.state.longestRun = longestRun;
        this.state.totalRuns = totalRuns;
    }

    saveToStorage(): void {
        localStorage.setItem('bigslot_save', JSON.stringify({
            gems: this.state.gems,
            permUpgrades: this.state.permUpgrades,
            biggestWin: this.state.biggestWin,
            longestRun: this.state.longestRun,
            totalRuns: this.state.totalRuns,
        }));
    }

    loadFromStorage(): void {
        const saved = localStorage.getItem('bigslot_save');
        if (saved) {
            const data = JSON.parse(saved);
            this.state.gems = data.gems || 0;
            this.state.permUpgrades = data.permUpgrades || [];
            this.state.biggestWin = data.biggestWin || 0;
            this.state.longestRun = data.longestRun || 0;
            this.state.totalRuns = data.totalRuns || 0;
        }
    }
}

export const gameState = new GameStateManager();
