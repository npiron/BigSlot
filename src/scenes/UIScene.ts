import Phaser from 'phaser';
import { gameState } from '../systems/GameState';
import { CONFIG } from '../data/config';

export class UIScene extends Phaser.Scene {
    private coinsText!: Phaser.GameObjects.Text;
    private gemsText!: Phaser.GameObjects.Text;
    private spinsText!: Phaser.GameObjects.Text;
    private stageText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'UIScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // Top bar background
        const topBar = this.add.rectangle(0, 0, width, 60, 0x000814, 0.8);
        topBar.setOrigin(0, 0);

        // Coins display
        this.coinsText = this.add.text(20, 20, '', {
            fontFamily: CONFIG.FONT_FAMILY,
            fontSize: `${CONFIG.FONT_SIZE_SMALL}px`,
            color: CONFIG.COLORS.ACCENT,
        });

        // Gems display
        this.gemsText = this.add.text(width / 2 - 100, 20, '', {
            fontFamily: CONFIG.FONT_FAMILY,
            fontSize: `${CONFIG.FONT_SIZE_SMALL}px`,
            color: CONFIG.COLORS.SECONDARY,
        });

        // Spins remaining
        this.spinsText = this.add.text(width / 2 + 50, 20, '', {
            fontFamily: CONFIG.FONT_FAMILY,
            fontSize: `${CONFIG.FONT_SIZE_SMALL}px`,
            color: CONFIG.COLORS.PRIMARY,
        });

        // Current stage
        this.stageText = this.add.text(width - 20, 20, '', {
            fontFamily: CONFIG.FONT_FAMILY,
            fontSize: `${CONFIG.FONT_SIZE_SMALL}px`,
            color: CONFIG.COLORS.TEXT,
        });
        this.stageText.setOrigin(1, 0);

        // Update UI every frame
        this.events.on('update', this.updateUI, this);
    }

    private updateUI(): void {
        const state = gameState.getState();

        this.coinsText.setText(`COINS: ${state.coins}`);
        this.gemsText.setText(`♦ ${state.gems}`);
        this.spinsText.setText(`SPINS: ${state.spinsRemaining}`);
        this.stageText.setText(`STAGE ${state.currentStage}/${CONFIG.STAGES_PER_RUN}`);
    }
}
