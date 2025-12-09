import Phaser from 'phaser';
import { gameState } from '../systems/GameState';
import { CONFIG } from '../data/config';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // Add CRT background
        this.cameras.main.setBackgroundColor(CONFIG.COLORS.BACKGROUND);

        // Add scanline effect
        this.addScanlines();

        // Title with glitch effect
        const title = this.add.text(width / 2, height * 0.2, 'BIG$LOT', {
            fontFamily: CONFIG.FONT_FAMILY,
            fontSize: `${CONFIG.FONT_SIZE_LARGE * 1.5}px`,
            color: CONFIG.COLORS.PRIMARY,
            stroke: CONFIG.COLORS.SECONDARY,
            strokeThickness: 4,
        });
        title.setOrigin(0.5);

        // Subtitle
        this.add.text(width / 2, height * 0.3, 'ROGUELITE SLOT MACHINE', {
            fontFamily: CONFIG.FONT_FAMILY,
            fontSize: `${CONFIG.FONT_SIZE_SMALL}px`,
            color: CONFIG.COLORS.ACCENT,
        }).setOrigin(0.5);

        // Load save data
        gameState.loadFromStorage();
        const state = gameState.getState();

        // Stats display
        const statsY = height * 0.45;
        const statsText = [
            `TOTAL RUNS: ${state.totalRuns}`,
            `LONGEST RUN: ${state.longestRun} stages`,
            `BIGGEST WIN: ${state.biggestWin} coins`,
            `GEMS: ${state.gems}`,
        ];

        statsText.forEach((text, index) => {
            this.add.text(width / 2, statsY + index * 30, text, {
                fontFamily: CONFIG.FONT_FAMILY,
                fontSize: `${CONFIG.FONT_SIZE_SMALL}px`,
                color: CONFIG.COLORS.DIM,
            }).setOrigin(0.5);
        });

        // Start button
        const startButton = this.add.text(
            width / 2,
            height * 0.7,
            '> START NEW RUN <',
            {
                fontFamily: CONFIG.FONT_FAMILY,
                fontSize: `${CONFIG.FONT_SIZE_MEDIUM}px`,
                color: CONFIG.COLORS.PRIMARY,
            }
        );
        startButton.setOrigin(0.5);
        startButton.setInteractive({ useHandCursor: true });

        // Button hover effect
        startButton.on('pointerover', () => {
            startButton.setColor(CONFIG.COLORS.ACCENT);
        });

        startButton.on('pointerout', () => {
            startButton.setColor(CONFIG.COLORS.PRIMARY);
        });

        startButton.on('pointerdown', () => {
            this.scene.start('SlotScene');
            this.scene.launch('UIScene');
        });

        // Add flicker effect to title
        this.time.addEvent({
            delay: 50,
            callback: () => {
                if (Math.random() < CONFIG.CRT_FLICKER_RATE) {
                    title.setAlpha(0.9);
                    this.time.delayedCall(50, () => title.setAlpha(1));
                }
            },
            loop: true,
        });
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
