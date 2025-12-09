import { SymbolType, WinLine } from '../types';
import { SYMBOLS } from '../data/symbols';
import { gameState } from './GameState';

export class SlotMachine {
    private reels: SymbolType[][] = [];

    spin(): SymbolType[][] {
        const state = gameState.getState();
        const { rows, cols } = state.slotConfig;

        this.reels = [];

        for (let col = 0; col < cols; col++) {
            const reel: SymbolType[] = [];
            for (let row = 0; row < rows; row++) {
                reel.push(this.getRandomSymbol());
            }
            this.reels.push(reel);
        }

        return this.reels;
    }

    private getRandomSymbol(): SymbolType {
        const state = gameState.getState();
        const availableSymbols = state.unlockedSymbols;

        // Weighted random selection based on rarity
        const totalWeight = availableSymbols.reduce(
            (sum, type) => sum + SYMBOLS[type].rarity,
            0
        );

        let random = Math.random() * totalWeight;

        for (const symbolType of availableSymbols) {
            random -= SYMBOLS[symbolType].rarity;
            if (random <= 0) {
                return symbolType;
            }
        }

        return availableSymbols[0];
    }

    calculateWins(): WinLine[] {
        const state = gameState.getState();
        const { rows, cols } = state.slotConfig;
        const wins: WinLine[] = [];

        // Check horizontal lines
        for (let row = 0; row < rows; row++) {
            const line: SymbolType[] = [];
            const positions: number[][] = [];

            for (let col = 0; col < cols; col++) {
                line.push(this.reels[col][row]);
                positions.push([col, row]);
            }

            const winLine = this.checkLine(line, positions);
            if (winLine) {
                wins.push(winLine);
            }
        }

        // Check diagonals (only for square grids)
        if (rows === cols) {
            // Top-left to bottom-right
            const diag1: SymbolType[] = [];
            const pos1: number[][] = [];
            for (let i = 0; i < cols; i++) {
                diag1.push(this.reels[i][i]);
                pos1.push([i, i]);
            }
            const winDiag1 = this.checkLine(diag1, pos1);
            if (winDiag1) wins.push(winDiag1);

            // Top-right to bottom-left
            const diag2: SymbolType[] = [];
            const pos2: number[][] = [];
            for (let i = 0; i < cols; i++) {
                diag2.push(this.reels[i][cols - 1 - i]);
                pos2.push([i, cols - 1 - i]);
            }
            const winDiag2 = this.checkLine(diag2, pos2);
            if (winDiag2) wins.push(winDiag2);
        }

        return wins;
    }

    private checkLine(symbols: SymbolType[], positions: number[][]): WinLine | null {
        if (symbols.length < 3) return null;

        // Count consecutive matching symbols (considering wilds)
        let matchCount = 1;
        let matchSymbol = symbols[0] === SymbolType.WILD ? symbols[1] : symbols[0];

        for (let i = 1; i < symbols.length; i++) {
            if (symbols[i] === matchSymbol || symbols[i] === SymbolType.WILD) {
                matchCount++;
            } else {
                break;
            }
        }

        // Need at least 3 matching symbols
        if (matchCount >= 3) {
            const symbolData = SYMBOLS[matchSymbol];
            const basePayout = symbolData.basePayout;
            const multiplier = matchCount - 2; // 3 symbols = 1x, 4 = 2x, 5 = 3x
            const payout = basePayout * multiplier * gameState.getState().slotConfig.spinCost;

            return {
                symbols: symbols.slice(0, matchCount),
                positions: positions.slice(0, matchCount),
                payout,
                multiplier,
            };
        }

        // Check for scatter bonus
        const scatterCount = symbols.filter(s => s === SymbolType.SCATTER).length;
        if (scatterCount >= 3) {
            return {
                symbols: symbols.filter(s => s === SymbolType.SCATTER),
                positions: positions.filter((_, i) => symbols[i] === SymbolType.SCATTER),
                payout: scatterCount * 10 * gameState.getState().slotConfig.spinCost,
                multiplier: scatterCount,
            };
        }

        return null;
    }

    getReels(): SymbolType[][] {
        return this.reels;
    }
}
