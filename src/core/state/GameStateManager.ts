import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { GameState, SymbolType } from '../../shared/types';
import { gameConfig } from '../config';
import { eventBus, GameEvent } from '../events';

/**
 * GameStateManager - Reactive state management with RxJS
 * Singleton pattern with BehaviorSubject for reactive updates
 * 
 * @example
 * const stateMgr = GameStateManager.getInstance();
 * stateMgr.coins$.subscribe(coins => console.log('Coins:', coins));
 * stateMgr.addCoins(100);
 */
export class GameStateManager {
    private static instance: GameStateManager;
    private state$ = new BehaviorSubject<GameState>(this.createInitialState());

    // Observables for each part of state
    readonly coins$ = this.state$.pipe(map(s => s.coins));
    readonly gems$ = this.state$.pipe(map(s => s.gems));
    readonly stage$ = this.state$.pipe(map(s => s.currentStage));
    readonly spins$ = this.state$.pipe(map(s => s.spinsRemaining));
    readonly slotConfig$ = this.state$.pipe(map(s => s.slotConfig));

    private constructor() {
        // Load saved data on instantiation
        this.loadFromStorage();
    }

    static getInstance(): GameStateManager {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager();
        }
        return GameStateManager.instance;
    }

    /**
     * Get current state snapshot
     */
    getState(): GameState {
        return { ...this.state$.value };
    }

    /**
     * Get state observable
     */
    getState$(): Observable<GameState> {
        return this.state$.asObservable();
    }

    /**
     * Add coins (with event emission)
     */
    addCoins(amount: number): void {
        const current = this.state$.value;
        this.state$.next({
            ...current,
            coins: current.coins + amount,
        });
        eventBus.emit(GameEvent.COINS_CHANGED, { amount, total: current.coins + amount });
    }

    /**
     * Spend coins if enough available
     */
    spendCoins(amount: number): boolean {
        const current = this.state$.value;
        if (current.coins >= amount) {
            this.state$.next({
                ...current,
                coins: current.coins - amount,
            });
            eventBus.emit(GameEvent.COINS_CHANGED, { amount: -amount, total: current.coins - amount });
            return true;
        }
        return false;
    }

    /**
     * Add gems (meta currency)
     */
    addGems(amount: number): void {
        const current = this.state$.value;
        this.state$.next({
            ...current,
            gems: current.gems + amount,
        });
        eventBus.emit(GameEvent.GEMS_CHANGED, { amount, total: current.gems + amount });
    }

    /**
     * Consume a spin (returns false if no spins left)
     */
    consumeSpin(): boolean {
        const current = this.state$.value;
        if (current.spinsRemaining > 0) {
            this.state$.next({
                ...current,
                spinsRemaining: current.spinsRemaining - 1,
            });
            eventBus.emit(GameEvent.SPINS_CHANGED, { remaining: current.spinsRemaining - 1 });
            return true;
        }
        return false;
    }

    /**
     * Advance to next stage
     */
    nextStage(): void {
        const current = this.state$.value;
        const config = gameConfig.get('progression');
        this.state$.next({
            ...current,
            currentStage: current.currentStage + 1,
            spinsRemaining: current.spinsRemaining + config.spinsPerStage,
        });
        eventBus.emit(GameEvent.STAGE_CHANGED, { stage: current.currentStage + 1 });
    }

    /**
     * Unlock a new symbol
     */
    unlockSymbol(symbol: SymbolType): void {
        const current = this.state$.value;
        if (!current.unlockedSymbols.includes(symbol)) {
            this.state$.next({
                ...current,
                unlockedSymbols: [...current.unlockedSymbols, symbol],
            });
        }
    }

    /**
     * Expand slot machine size
     */
    expandSlot(rows: number, cols: number): void {
        const current = this.state$.value;
        this.state$.next({
            ...current,
            slotConfig: {
                ...current.slotConfig,
                rows,
                cols,
            },
        });
    }

    /**
     * Start a new run (roguelite reset)
     */
    startNewRun(): void {
        const current = this.state$.value;
        const initial = this.createInitialState();

        // Keep permanent progress
        this.state$.next({
            ...initial,
            gems: current.gems,
            upgrades: {}, // Reset temp upgrades
            // Keep stats
            totalWinnings: current.totalWinnings,
            totalRuns: current.totalRuns + 1,
            longestRun: current.longestRun,
            biggestWin: current.biggestWin,
        });
    }

    /**
     * Save permanent progress to localStorage
     */
    saveToStorage(): void {
        const current = this.state$.value;
        localStorage.setItem('bigslot_save', JSON.stringify({
            gems: current.gems,
            upgrades: current.upgrades,
            stats: {
                totalWinnings: current.totalWinnings,
                totalRuns: current.totalRuns,
                longestRun: current.longestRun,
                biggestWin: current.biggestWin,
            },
        }));
    }

    /**
     * Load permanent progress from localStorage
     */
    private loadFromStorage(): void {
        try {
            const saved = localStorage.getItem('bigslot_save');
            if (saved) {
                const data = JSON.parse(saved);
                const current = this.state$.value;
                this.state$.next({
                    ...current,
                    gems: data.gems || 0,
                    upgrades: data.upgrades || {},
                    totalWinnings: data.stats?.totalWinnings || 0,
                    totalRuns: data.stats?.totalRuns || 0,
                    longestRun: data.stats?.longestRun || 0,
                    biggestWin: data.stats?.biggestWin || 0,
                });
            }
        } catch (error) {
            console.error('Failed to load save data:', error);
        }
    }

    private createInitialState(): GameState {
        const config = gameConfig.get('progression');
        const slotCfg = gameConfig.get('slot');

        return {
            coins: config.initialCoins,
            gems: 0,
            currentStage: 1,
            spinsRemaining: config.initialSpins,
            slotConfig: {
                rows: slotCfg.rows,
                cols: slotCfg.cols,
                spinCost: slotCfg.spinCost,
            },
            unlockedSymbols: ['cherries', 'lemon', 'bell', 'clover', 'heart'],
            upgrades: {},
            totalWinnings: 0,
            totalRuns: 0,
            longestRun: 0,
            biggestWin: 0,
        };
    }
}

// Export singleton instance
export const gameStateManager = GameStateManager.getInstance();
