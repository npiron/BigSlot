import Phaser from 'phaser';
import { gameStateManager } from '../core/state';
import { COLORS, FONTS, UI_CONFIG } from '../shared/constants';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // Add CRT background
        this.cameras.main.setBackgroundColor(COLORS.BACKGROUND);

        // Add scanline effect
        this.addScanlines();

        // Title with glitch effect
        const title = this.add.text(width / 2, height * 0.2, 'BIG$LOT', {
            fontFamily: FONTS.FAMILY,
            fontSize: `${FONTS.SIZE_LARGE * 1.5}px`,
            color: COLORS.PRIMARY,
            stroke: COLORS.SECONDARY,
            strokeThickness: 4,
        });
        title.setOrigin(0.5);

        // Subtitle
        this.add.text(width / 2, height * 0.3, 'ROGUELITE SLOT MACHINE', {
            fontFamily: FONTS.FAMILY,
            fontSize: `${FONTS.SIZE_SMALL}px`,
            color: COLORS.ACCENT,
        }).setOrigin(0.5);

        // Load save data
        // gameStateManager loads automatically on instantiation
        const state = gameStateManager.getState();

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
                fontFamily: FONTS.FAMILY,
                fontSize: `${FONTS.SIZE_SMALL}px`,
                color: COLORS.DIM,
            }).setOrigin(0.5);
        });

        // Start button
        const startButton = this.add.text(
            width / 2,
            height * 0.7,
            '> START NEW RUN <',
            {
                fontFamily: FONTS.FAMILY,
                fontSize: `${FONTS.SIZE_MEDIUM}px`,
                color: COLORS.PRIMARY,
            }
        );
        startButton.setOrigin(0.5);
        startButton.setInteractive({ useHandCursor: true });

        // Button hover effect
        startButton.on('pointerover', () => {
            startButton.setColor(COLORS.ACCENT);
        });

        startButton.on('pointerout', () => {
            startButton.setColor(COLORS.PRIMARY);
        });

        startButton.on('pointerdown', () => {
            this.scene.start('SlotScene');
            this.scene.launch('UIScene');
        });

        // Add flicker effect to title
        this.time.addEvent({
            delay: 50,
            callback: () => {
                if (Math.random() < UI_CONFIG.CRT_FLICKER_RATE) {
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
            graphics.fillStyle(0x000000, UI_CONFIG.CRT_SCANLINE_INTENSITY);
            graphics.fillRect(0, y, width, 1);
        }
    }
}
