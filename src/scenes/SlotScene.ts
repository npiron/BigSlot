import Phaser from 'phaser';
import { gameState } from '../systems/GameState';
import { SlotMachine } from '../systems/SlotMachine';
import { CONFIG } from '../data/config';
import { SYMBOLS } from '../data/symbols';

export class SlotScene extends Phaser.Scene {
    private slotMachine!: SlotMachine;
    private reelContainers: Phaser.GameObjects.Container[] = [];
    private isSpinning = false;
    private spinButton!: Phaser.GameObjects.Container;
    private betButton!: Phaser.GameObjects.Container;
    private resultText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'SlotScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // Custom background image
        const bg = this.add.image(width / 2, height / 2, 'customBackground');
        bg.setDisplaySize(width, height);

        // Optional: Add subtle overlay for better readability
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.2);

        // Add ambient spotlight behind reels
        this.createAmbientLight();

        // Subtle scanlines for depth
        this.addSubtleScanlines();

        this.slotMachine = new SlotMachine();

        // Create slot display with glass effect
        this.createSlotDisplay();

        // Create modern buttons
        this.createModernButtons();

        // Result text
        this.resultText = this.add.text(width / 2, height / 2 + 200, '', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#00ff88',
            stroke: '#000000',
            strokeThickness: 4,
        });
        this.resultText.setOrigin(0.5);

        // Input
        this.input.keyboard?.on('keydown-SPACE', () => {
            this.handleSpin();
        });
    }

    private createAmbientLight(): void {
        const { width, height } = this.cameras.main;

        // Spotlight behind reel area
        const spotlight = this.add.graphics();
        const centerX = width / 2;
        const centerY = height / 2 - 20;

        for (let i = 0; i < 15; i++) {
            const alpha = (15 - i) / 100;
            spotlight.fillStyle(0xffffff, alpha);
            spotlight.fillEllipse(centerX, centerY, 300 + i * 15, 280 + i * 15);
        }
    }

    private createSlotDisplay(): void {
        const { width, height } = this.cameras.main;
        const state = gameState.getState();
        const { rows, cols } = state.slotConfig;

        const cellSize = 100;
        const spacing = 12;
        const totalWidth = cols * (cellSize + spacing) - spacing;
        const totalHeight = rows * (cellSize + spacing) - spacing;
        const startX = width / 2 - totalWidth / 2;
        const startY = height / 2 - totalHeight / 2 - 20;

        // Clear previous displays
        this.reelContainers.forEach(container => container.destroy());
        this.reelContainers = [];

        // Create reel containers
        for (let col = 0; col < cols; col++) {
            const reelContainer = this.add.container(0, 0);

            for (let row = 0; row < rows; row++) {
                const x = startX + col * (cellSize + spacing) + cellSize / 2;
                const y = startY + row * (cellSize + spacing) + cellSize / 2;

                // Glass cell background
                const cellBg = this.add.rectangle(x, y, cellSize, cellSize, 0x14142880);

                // Neon border with glow
                const border = this.add.rectangle(x, y, cellSize, cellSize);
                border.setStrokeStyle(2, 0x00d9ff, 0.6);
                border.isFilled = false;

                // Add subtle glow effect
                const glow = this.add.rectangle(x, y, cellSize + 4, cellSize + 4);
                glow.setStrokeStyle(6, 0x00d9ff, 0.2);
                glow.isFilled = false;

                // Symbol sprite
                const symbolSprite = this.add.image(x, y, 'symbol_cherries');
                symbolSprite.setDisplaySize(cellSize - 15, cellSize - 15);
                symbolSprite.setData('col', col);
                symbolSprite.setData('row', row);

                reelContainer.add([glow, cellBg, border, symbolSprite]);
            }

            this.reelContainers.push(reelContainer);
        }
    }

    private createModernButtons(): void {
        const { width, height } = this.cameras.main;

        // SPIN button (right side)
        this.spinButton = this.createGlassButton(
            width / 2 + 250,
            height / 2,
            'btnSpin',
            0x00ff88,
            () => this.handleSpin()
        );

        // BET button (left side)
        this.betButton = this.createGlassButton(
            width / 2 - 250,
            height / 2,
            'btnBet',
            0xffa500,
            () => this.adjustBet(1)
        );

        // Add idle breathing animation
        this.tweens.add({
            targets: [this.spinButton, this.betButton],
            alpha: { from: 0.9, to: 1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    private createGlassButton(
        x: number,
        y: number,
        iconKey: string,
        glowColor: number,
        onClick: () => void
    ): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);

        // Outer glow
        const outerGlow = this.add.circle(0, 0, 50, glowColor, 0.1);

        // Glass background
        const bg = this.add.circle(0, 0, 42, 0xffffff, 0.05);

        // Border
        const border = this.add.circle(0, 0, 42);
        border.setStrokeStyle(2, glowColor, 0.6);
        border.isFilled = false;

        // Icon
        const icon = this.add.image(0, 0, iconKey);
        icon.setScale(3.5);

        container.add([outerGlow, bg, border, icon]);
        container.setSize(84, 84);
        container.setInteractive({ useHandCursor: true });

        // Hover effect
        container.on('pointerover', () => {
            if (!this.isSpinning) {
                this.tweens.add({
                    targets: container,
                    scale: 1.1,
                    duration: 200,
                    ease: 'Back.easeOut',
                });
                outerGlow.setAlpha(0.3);
            }
        });

        container.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scale: 1,
                duration: 200,
                ease: 'Back.easeIn',
            });
            outerGlow.setAlpha(0.1);
        });

        container.on('pointerdown', () => {
            if (!this.isSpinning) {
                icon.setTexture(iconKey + '_pressed');
                this.tweens.add({
                    targets: container,
                    scale: 0.95,
                    duration: 100,
                });
                this.sound.play('buttonClick');
            }
        });

        container.on('pointerup', () => {
            icon.setTexture(iconKey);
            this.tweens.add({
                targets: container,
                scale: 1.1,
                duration: 100,
            });
            onClick();
        });

        return container;
    }

    private adjustBet(direction: number): void {
        const state = gameState.getState();
        const betOptions = [5, 10, 25, 50, 100];
        const currentIndex = betOptions.indexOf(state.slotConfig.spinCost);
        const newIndex = Math.max(0, Math.min(betOptions.length - 1, currentIndex + direction));

        state.slotConfig.spinCost = betOptions[newIndex];
        this.sound.play('betClick');
        this.scene.get('UIScene').events.emit('update');
    }

    private handleSpin(): void {
        if (this.isSpinning) return;

        const state = gameState.getState();

        if (!gameState.spendCoins(state.slotConfig.spinCost)) {
            this.resultText.setText('NOT ENOUGH COINS!');
            this.resultText.setColor('#ff4757');
            this.sound.play('buttonClick');
            return;
        }

        if (!gameState.consumeSpin()) {
            this.resultText.setText('NO SPINS REMAINING!');
            this.resultText.setColor('#ff4757');
            this.sound.play('buttonClick');
            return;
        }

        this.isSpinning = true;
        this.spinButton.setAlpha(0.4);
        this.betButton.setAlpha(0.4);
        this.resultText.setText('');

        this.sound.play('spinStart');
        this.animateSpin();
    }

    private animateSpin(): void {
        const state = gameState.getState();
        const { rows, cols } = state.slotConfig;

        this.reelContainers.forEach((reel, col) => {
            const symbols = reel.getAll().filter(s => s instanceof Phaser.GameObjects.Image) as Phaser.GameObjects.Image[];
            const delay = col * 100;

            const spinTween = this.tweens.add({
                targets: symbols,
                y: '+=30',
                duration: 50,
                repeat: 15 + col * 3,
                ease: 'Linear',
                onRepeat: () => {
                    symbols.forEach((sprite) => {
                        if (sprite.texture.key.startsWith('symbol_')) {
                            sprite.setTexture(this.getRandomSymbolKey());
                        }
                    });
                },
                delay: delay,
            });

            this.time.delayedCall(1000 + delay * 2, () => {
                spinTween.remove();

                symbols.forEach((sprite) => {
                    const row = sprite.getData('row');
                    const { height } = this.cameras.main;
                    const cellSize = 100;
                    const spacing = 12;
                    const totalHeight = rows * (cellSize + spacing) - spacing;
                    const startY = height / 2 - totalHeight / 2 - 20;
                    sprite.y = startY + row * (cellSize + spacing) + cellSize / 2;
                });

                if (col === cols - 1) {
                    this.sound.play('spinStop');
                    this.finalizeSpin();
                }
            });
        });
    }

    private finalizeSpin(): void {
        const reels = this.slotMachine.spin();

        reels.forEach((reel, col) => {
            const reelContainer = this.reelContainers[col];
            const sprites = reelContainer.getAll().filter(s => s instanceof Phaser.GameObjects.Image) as Phaser.GameObjects.Image[];

            reel.forEach((symbolType, row) => {
                const sprite = sprites.find(s => s.getData('col') === col && s.getData('row') === row);
                if (sprite) {
                    const symbol = SYMBOLS[symbolType];
                    sprite.setTexture(symbol.char);

                    // Elastic bounce effect
                    this.tweens.add({
                        targets: sprite,
                        scaleX: { from: 1.3, to: 1 },
                        scaleY: { from: 1.3, to: 1 },
                        duration: 300,
                        ease: 'Elastic.easeOut',
                    });
                }
            });
        });

        this.time.delayedCall(500, () => {
            const wins = this.slotMachine.calculateWins();
            let totalPayout = 0;

            wins.forEach(win => {
                totalPayout += win.payout;

                win.positions.forEach(([col, row]) => {
                    const reelContainer = this.reelContainers[col];
                    const sprites = reelContainer.getAll().filter(s => s instanceof Phaser.GameObjects.Image) as Phaser.GameObjects.Image[];
                    const sprite = sprites.find(s => s.getData('col') === col && s.getData('row') === row);

                    if (sprite) {
                        // Pulsing glow on winning symbols
                        this.tweens.add({
                            targets: sprite,
                            scale: { from: 1, to: 1.2 },
                            alpha: { from: 1, to: 0.8 },
                            duration: 400,
                            yoyo: true,
                            repeat: 3,
                        });
                    }
                });
            });

            if (totalPayout > 0) {
                gameState.addCoins(totalPayout);
                this.resultText.setText(`WIN! +${totalPayout}`);
                this.resultText.setColor('#00ff88');

                const betAmount = gameState.getState().slotConfig.spinCost;
                if (totalPayout >= betAmount * CONFIG.BIG_WIN_MULTIPLIER) {
                    this.sound.play('winJackpot');
                } else if (totalPayout >= betAmount * 5) {
                    this.sound.play('winBig');
                } else if (totalPayout >= betAmount * 2) {
                    this.sound.play('winMedium');
                } else {
                    this.sound.play('winSmall');
                }

                if (Math.random() < CONFIG.GEM_DROP_CHANCE) {
                    gameState.addGems(1);
                    this.sound.play('coinDrop');
                }
            } else {
                this.resultText.setText('');
            }

            this.isSpinning = false;
            this.spinButton.setAlpha(1);
            this.betButton.setAlpha(1);

            const state = gameState.getState();
            if (state.spinsRemaining === 0) {
                this.time.delayedCall(2000, () => this.endStage());
            }
        });
    }

    private getRandomSymbolKey(): string {
        const state = gameState.getState();
        const symbolTypes = state.unlockedSymbols;
        const randomType = symbolTypes[Math.floor(Math.random() * symbolTypes.length)];
        return SYMBOLS[randomType].char;
    }

    private endStage(): void {
        gameState.nextStage();
        gameState.saveToStorage();

        const state = gameState.getState();
        if (state.currentStage > CONFIG.STAGES_PER_RUN) {
            this.scene.stop('UIScene');
            this.scene.start('MenuScene');
        } else {
            this.scene.restart();
        }
    }

    private addSubtleScanlines(): void {
        const { width, height } = this.cameras.main;
        const graphics = this.add.graphics();

        for (let y = 0; y < height; y += 4) {
            graphics.fillStyle(0x000000, 0.05);
            graphics.fillRect(0, y, width, 1);
        }
    }
}
