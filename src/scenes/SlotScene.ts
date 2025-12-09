import Phaser from 'phaser';
import { gameState } from '../systems/GameState';
import { SlotMachine } from '../systems/SlotMachine';
import { CONFIG } from '../data/config';
import { SYMBOLS } from '../data/symbols';
import { SymbolType } from '../types';

export class SlotScene extends Phaser.Scene {
    private slotMachine!: SlotMachine;
    private reelDisplays: Phaser.GameObjects.Container[] = [];
    private isSpinning = false;
    private spinButton!: Phaser.GameObjects.Text;
    private resultText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'SlotScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        this.cameras.main.setBackgroundColor(CONFIG.COLORS.BACKGROUND);
        this.addScanlines();

        this.slotMachine = new SlotMachine();

        // Title
        this.add.text(width / 2, 100, 'SLOT MACHINE', {
            fontFamily: CONFIG.FONT_FAMILY,
            fontSize: `${CONFIG.FONT_SIZE_MEDIUM}px`,
            color: CONFIG.COLORS.PRIMARY,
        }).setOrigin(0.5);

        // Create slot display
        this.createSlotDisplay();

        // Spin button
        this.spinButton = this.add.text(width / 2, height - 150, '[ SPIN ]', {
            fontFamily: CONFIG.FONT_FAMILY,
            fontSize: `${CONFIG.FONT_SIZE_MEDIUM}px`,
            color: CONFIG.COLORS.ACCENT,
            stroke: CONFIG.COLORS.BACKGROUND,
            strokeThickness: 4,
        });
        this.spinButton.setOrigin(0.5);
        this.spinButton.setInteractive({ useHandCursor: true });

        this.spinButton.on('pointerover', () => {
            if (!this.isSpinning) {
                this.spinButton.setColor(CONFIG.COLORS.PRIMARY);
                this.spinButton.setScale(1.1);
            }
        });

        this.spinButton.on('pointerout', () => {
            this.spinButton.setColor(CONFIG.COLORS.ACCENT);
            this.spinButton.setScale(1);
        });

        this.spinButton.on('pointerdown', () => {
            this.handleSpin();
        });

        // Result text
        this.resultText = this.add.text(width / 2, height - 80, '', {
            fontFamily: CONFIG.FONT_FAMILY,
            fontSize: `${CONFIG.FONT_SIZE_SMALL}px`,
            color: CONFIG.COLORS.ACCENT,
        });
        this.resultText.setOrigin(0.5);

        // Space bar to spin
        this.input.keyboard?.on('keydown-SPACE', () => {
            this.handleSpin();
        });
    }

    private createSlotDisplay(): void {
        const { width, height } = this.cameras.main;
        const state = gameState.getState();
        const { rows, cols } = state.slotConfig;

        const cellSize = 100;
        const totalWidth = cols * cellSize;
        const totalHeight = rows * cellSize;
        const startX = width / 2 - totalWidth / 2;
        const startY = height / 2 - totalHeight / 2;

        // Clear previous displays
        this.reelDisplays.forEach(container => container.destroy());
        this.reelDisplays = [];

        // Create slot machine frame
        const graphics = this.add.graphics();
        graphics.lineStyle(4, parseInt(CONFIG.COLORS.PRIMARY.replace('#', '0x')), 1);
        graphics.strokeRect(
            startX - 10,
            startY - 10,
            totalWidth + 20,
            totalHeight + 20
        );

        // Create grid
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                const x = startX + col * cellSize + cellSize / 2;
                const y = startY + row * cellSize + cellSize / 2;

                // Cell background
                const cell = this.add.rectangle(x, y, cellSize - 10, cellSize - 10, 0x001122, 0.5);
                cell.setStrokeStyle(2, parseInt(CONFIG.COLORS.DIM.replace('#', '0x')));

                // Symbol container
                const container = this.add.container(x, y);

                // Symbol text (will be updated during spin)
                const symbolText = this.add.text(0, 0, '?', {
                    fontFamily: CONFIG.FONT_FAMILY,
                    fontSize: '48px',
                    color: CONFIG.COLORS.TEXT,
                });
                symbolText.setOrigin(0.5);

                container.add(symbolText);

                if (!this.reelDisplays[col]) {
                    this.reelDisplays[col] = this.add.container(0, 0);
                }
                this.reelDisplays[col].add(container);
            }
        }
    }

    private handleSpin(): void {
        if (this.isSpinning) return;

        const state = gameState.getState();

        // Check if player has enough coins and spins
        if (!gameState.spendCoins(state.slotConfig.spinCost)) {
            this.resultText.setText('NOT ENOUGH COINS!');
            this.resultText.setColor(CONFIG.COLORS.SECONDARY);
            return;
        }

        if (!gameState.consumeSpin()) {
            this.resultText.setText('NO SPINS REMAINING!');
            this.resultText.setColor(CONFIG.COLORS.SECONDARY);
            return;
        }

        this.isSpinning = true;
        this.spinButton.setAlpha(0.5);
        this.resultText.setText('');

        // Animate spin
        this.animateSpin();
    }

    private animateSpin(): void {
        const state = gameState.getState();
        const { cols } = state.slotConfig;

        // Start spinning animation
        this.reelDisplays.forEach((reel, col) => {
            const delay = col * 100;

            // Rapid symbol changes
            const spinEvent = this.time.addEvent({
                delay: 50,
                callback: () => {
                    reel.iterate((child: Phaser.GameObjects.GameObject) => {
                        if (child instanceof Phaser.GameObjects.Container) {
                            const text = child.first as Phaser.GameObjects.Text;
                            const randomSymbol = this.getRandomSymbolChar();
                            text.setText(randomSymbol.char);
                            text.setColor(randomSymbol.color);
                        }
                    });
                },
                repeat: 20 + col * 5,
            });

            // Stop spinning after delay
            this.time.delayedCall(1000 + delay, () => {
                spinEvent.remove();

                // Check if all reels stopped
                if (col === cols - 1) {
                    this.finalizeSpin();
                }
            });
        });
    }

    private finalizeSpin(): void {
        // Get actual spin results
        const reels = this.slotMachine.spin();

        // Display results
        reels.forEach((reel, col) => {
            reel.forEach((symbolType, row) => {
                const container = this.reelDisplays[col].getAt(row) as Phaser.GameObjects.Container;
                const text = container.first as Phaser.GameObjects.Text;
                const symbol = SYMBOLS[symbolType];

                text.setText(symbol.char);
                text.setColor(symbol.color);

                // Flash effect
                this.tweens.add({
                    targets: text,
                    scale: { from: 1.5, to: 1 },
                    duration: 200,
                    ease: 'Back.easeOut',
                });
            });
        });

        // Calculate wins
        this.time.delayedCall(500, () => {
            const wins = this.slotMachine.calculateWins();

            let totalPayout = 0;
            wins.forEach(win => {
                totalPayout += win.payout;

                // Highlight winning symbols
                win.positions.forEach(([col, row]) => {
                    const container = this.reelDisplays[col].getAt(row) as Phaser.GameObjects.Container;
                    const text = container.first as Phaser.GameObjects.Text;

                    this.tweens.add({
                        targets: text,
                        scale: { from: 1, to: 1.2 },
                        alpha: { from: 1, to: 0.7 },
                        duration: 300,
                        yoyo: true,
                        repeat: 3,
                    });
                });
            });

            if (totalPayout > 0) {
                gameState.addCoins(totalPayout);
                this.resultText.setText(`WIN! +${totalPayout} COINS`);
                this.resultText.setColor(CONFIG.COLORS.PRIMARY);

                // Check for gem drop
                if (Math.random() < CONFIG.GEM_DROP_CHANCE) {
                    gameState.addGems(1);
                    this.time.delayedCall(1000, () => {
                        this.resultText.setText(`BONUS! +1 GEM`);
                        this.resultText.setColor(CONFIG.COLORS.SECONDARY);
                    });
                }
            } else {
                this.resultText.setText('NO WIN');
                this.resultText.setColor(CONFIG.COLORS.DIM);
            }

            this.isSpinning = false;
            this.spinButton.setAlpha(1);

            // Check if out of spins
            const state = gameState.getState();
            if (state.spinsRemaining === 0) {
                this.time.delayedCall(2000, () => {
                    this.endStage();
                });
            }
        });
    }

    private getRandomSymbolChar(): { char: string; color: string } {
        const state = gameState.getState();
        const symbolTypes = state.unlockedSymbols;
        const randomType = symbolTypes[Math.floor(Math.random() * symbolTypes.length)];
        const symbol = SYMBOLS[randomType];
        return { char: symbol.char, color: symbol.color };
    }

    private endStage(): void {
        // For now, just go to next stage
        gameState.nextStage();
        gameState.saveToStorage();

        const state = gameState.getState();

        if (state.currentStage > CONFIG.STAGES_PER_RUN) {
            // Run complete!
            this.scene.stop('UIScene');
            this.scene.start('MenuScene');
        } else {
            // Continue to next stage
            this.scene.restart();
        }
    }

    private addScanlines(): void {
        const { width, height } = this.cameras.main;
        const graphics = this.add.graphics();

        for (let y = 0; y < height; y += 2) {
            graphics.fillStyle(0x000000, CONFIG.CRT_SCANLINE_INTENSITY);
            graphics.fillRect(0, y, width, 1);
        }
    }
}
