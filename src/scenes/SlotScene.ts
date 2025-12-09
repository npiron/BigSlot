import Phaser from 'phaser';
import { gameStateManager } from '../core/state';
import { CONFIG } from '../core/config';
import { WinParticles, AmbientLight } from '../features/effects';
import { SYMBOLS } from '../shared/constants';


import { SlotMachine } from '../features/slot';

export class SlotScene extends Phaser.Scene {
    private slotMachine!: SlotMachine;
    private reelContainers: Phaser.GameObjects.Container[] = [];
    private isSpinning = false;
    private particles!: WinParticles;
    private lighting!: AmbientLight;
    private spinButton!: Phaser.GameObjects.Container;
    private betButton!: Phaser.GameObjects.Container;
    private resultText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'SlotScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // Initialize new modular services
        this.particles = new WinParticles(this);
        this.lighting = new AmbientLight(this);

        // Custom background image with enhanced effects
        const bg = this.add.image(width / 2, height / 2, 'customBackground');
        bg.setDisplaySize(width, height);

        // Subtle vignette overlay
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.15);

        // Add ambient spotlight using new service
        this.lighting.createSpotlight(width / 2, height / 2 - 20);

        // Add slot machine frame
        const frame = this.add.image(width / 2, height / 2, 'slotFrame');
        frame.setDisplaySize(width * 0.9, height * 0.9);
        frame.setAlpha(0.3); // Semi-transparent overlay

        // Subtle scanlines for depth
        this.lighting.createScanlines(width, height);

        const state = gameStateManager.getState();
        this.slotMachine = new SlotMachine(state.unlockedSymbols);

        // Create slot display with glass effect
        this.createSlotDisplay();

        // Create modern buttons
        this.createModernButtons();

        // Result text
        this.resultText = this.add.text(width / 2, height / 2 + 200, '', {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#00ff88',
            stroke: '#000000',
            strokeThickness: 6,
        });
        this.resultText.setOrigin(0.5);

        // Input
        this.input.keyboard?.on('keydown-SPACE', () => {
            this.handleSpin();
        });
    }



    private createSlotDisplay(): void {
        const { width, height } = this.cameras.main;
        const state = gameStateManager.getState();
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
        const state = gameStateManager.getState();
        const betOptions = [5, 10, 25, 50, 100];
        const currentIndex = betOptions.indexOf(state.slotConfig.spinCost);
        const newIndex = Math.max(0, Math.min(betOptions.length - 1, currentIndex + direction));

        state.slotConfig.spinCost = betOptions[newIndex];
        this.sound.play('betClick');
        this.scene.get('UIScene').events.emit('update');
    }

    private handleSpin(): void {
        if (this.isSpinning) return;

        const state = gameStateManager.getState();

        if (!gameStateManager.spendCoins(state.slotConfig.spinCost)) {
            this.resultText.setText('NOT ENOUGH COINS!');
            this.resultText.setColor('#ff4757');
            this.sound.play('buttonClick');
            return;
        }

        if (!gameStateManager.consumeSpin()) {
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
        const state = gameStateManager.getState();
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
        const state = gameStateManager.getState();
        const reels = this.slotMachine.spin(state.slotConfig);

        reels.forEach((reel, col) => {
            const reelContainer = this.reelContainers[col];
            const sprites = reelContainer.getAll().filter(s => s instanceof Phaser.GameObjects.Image) as Phaser.GameObjects.Image[];

            reel.forEach((symbolType, row) => {
                const sprite = sprites.find(s => s.getData('col') === col && s.getData('row') === row);
                if (sprite) {
                    const symbol = SYMBOLS[symbolType as keyof typeof SYMBOLS];
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
            const spinCost = gameStateManager.getState().slotConfig.spinCost;
            const wins = this.slotMachine.calculateWins(spinCost);
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

                        // Emit particles from winning symbols
                        this.particles.createSmall(sprite.x, sprite.y);
                    }
                });
            });

            if (totalPayout > 0) {
                gameStateManager.addCoins(totalPayout);
                this.resultText.setText(`WIN! +${totalPayout}`);
                this.resultText.setColor('#00ff88');

                const betAmount = gameStateManager.getState().slotConfig.spinCost;

                // Create celebration particles based on win size
                const { width, height } = this.cameras.main;
                if (totalPayout >= betAmount * CONFIG.BIG_WIN_MULTIPLIER) {
                    this.sound.play('winJackpot');
                    this.particles.createExplosion({ x: width / 2, y: height / 2, count: 50, intensity: 1 });
                } else if (totalPayout >= betAmount * 5) {
                    this.sound.play('winBig');
                    this.particles.createExplosion({ x: width / 2, y: height / 2, count: 30, intensity: 0.6 });
                } else if (totalPayout >= betAmount * 2) {
                    this.sound.play('winMedium');
                } else {
                    this.sound.play('winSmall');
                }

                if (Math.random() < CONFIG.GEM_DROP_CHANCE) {
                    gameStateManager.addGems(1);
                    this.sound.play('coinDrop');
                }
            } else {
                this.resultText.setText('');
            }

            this.isSpinning = false;
            this.spinButton.setAlpha(1);
            this.betButton.setAlpha(1);

            const state = gameStateManager.getState();
            if (state.spinsRemaining === 0) {
                this.time.delayedCall(2000, () => this.endStage());
            }
        });
    }

    private getRandomSymbolKey(): string {
        const state = gameStateManager.getState();
        const symbolTypes = state.unlockedSymbols;
        const randomType = symbolTypes[Math.floor(Math.random() * symbolTypes.length)];
        return SYMBOLS[randomType as keyof typeof SYMBOLS].char;
    }

    private endStage(): void {
        gameStateManager.nextStage();
        gameStateManager.saveToStorage();

        const state = gameStateManager.getState();
        if (state.currentStage > CONFIG.STAGES_PER_RUN) {
            this.scene.stop('UIScene');
            this.scene.start('MenuScene');
        } else {
            this.scene.restart();
        }
    }






}
