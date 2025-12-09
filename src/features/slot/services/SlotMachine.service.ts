import type { SymbolType, WinLine, SlotConfig } from '../../../shared/types';
import { SYMBOLS } from '../../../shared/constants';
import { MathUtils } from '../../../shared/utils';
import { eventBus, GameEvent } from '../../../core/events';

/**
 * SlotMachine Service
 * Handles slot machine logic (spin, win calculation)
 */
export class SlotMachine {
    private reels: SymbolType[][] = [];

    constructor(
        private availableSymbols: SymbolType[]
    ) { }

    /**
     * Perform a spin and return new reels
     */
    spin(config: SlotConfig): SymbolType[][] {
        const { rows, cols } = config;
        this.reels = [];

        for (let col = 0; col < cols; col++) {
            const reel: SymbolType[] = [];
            for (let row = 0; row < rows; row++) {
                reel.push(this.getRandomSymbol());
            }
            this.reels.push(reel);
        }

        eventBus.emit(GameEvent.SPIN_COMPLETE, { reels: this.reels });
        return this.reels;
    }

    /**
     * Get random symbol from available symbols
     */
    private getRandomSymbol(): SymbolType {
        const index = MathUtils.randomInt(0, this.availableSymbols.length - 1);
        return this.availableSymbols[index];
    }

    /**
     * Calculate wins from current reels
     */
    calculateWins(spinCost: number): WinLine[] {
        const wins: WinLine[] = [];
        const rows = this.reels[0]?.length || 0;
        const cols = this.reels.length;

        // Check horizontal lines
        for (let row = 0; row < rows; row++) {
            const line: SymbolType[] = [];
            const positions: [number, number][] = [];

            for (let col = 0; col < cols; col++) {
                line.push(this.reels[col][row]);
                positions.push([col, row]);
            }

            const winLine = this.checkLine(line, positions, spinCost);
            if (winLine) wins.push(winLine);
        }

        // Check diagonals for square grids
        if (rows === cols) {
            // Diagonal top-left to bottom-right
            const diag1: SymbolType[] = [];
            const pos1: [number, number][] = [];
            for (let i = 0; i < cols; i++) {
                diag1.push(this.reels[i][i]);
                pos1.push([i, i]);
            }
            const winDiag1 = this.checkLine(diag1, pos1, spinCost);
            if (winDiag1) wins.push(winDiag1);

            // Diagonal top-right to bottom-left
            const diag2: SymbolType[] = [];
            const pos2: [number, number][] = [];
            for (let i = 0; i < cols; i++) {
                diag2.push(this.reels[i][cols - 1 - i]);
                pos2.push([i, cols - 1 - i]);
            }
            const winDiag2 = this.checkLine(diag2, pos2, spinCost);
            if (winDiag2) wins.push(winDiag2);
        }

        if (wins.length > 0) {
            const totalPayout = wins.reduce((sum, win) => sum + win.payout, 0);
            eventBus.emit(GameEvent.WIN, { wins, totalPayout });
        }

        return wins;
    }

    /**
     * Check a line of symbols for wins
     */
    private checkLine(
        symbols: SymbolType[],
        positions: [number, number][],
        spinCost: number
    ): WinLine | null {
        if (symbols.length < 3) return null;

        // Count consecutive matching symbols
        let matchCount = 1;
        const firstSymbol = symbols[0];

        for (let i = 1; i < symbols.length; i++) {
            if (symbols[i] === firstSymbol) {
                matchCount++;
            } else {
                break;
            }
        }

        // Need at least 3 matching symbols for a win
        if (matchCount >= 3) {
            const symbol = SYMBOLS[firstSymbol];
            if (!symbol) return null;

            const multiplier = matchCount - 2; // 3 symbols = 1x, 4 = 2x, 5 = 3x
            const payout = symbol.value * multiplier * spinCost;

            return {
                symbolType: firstSymbol,
                count: matchCount,
                payout,
                positions: positions.slice(0, matchCount),
            };
        }

        return null;
    }

    /**
     * Get current reels
     */
    getReels(): SymbolType[][] {
        return this.reels;
    }
}
