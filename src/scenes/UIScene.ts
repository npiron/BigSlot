import Phaser from 'phaser';
import { gameStateManager } from '../core/state';

export class UIScene extends Phaser.Scene {
    private coinsText!: Phaser.GameObjects.Text;
    private gemsText!: Phaser.GameObjects.Text;
    private spinsText!: Phaser.GameObjects.Text;
    private stageText!: Phaser.GameObjects.Text;
    private betText!: Phaser.GameObjects.Text;
    private winText!: Phaser.GameObjects.Text;
    private totalText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'UIScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // Top glass bar
        this.createGlassBar(0, 0, width, 50);

        // Bottom glass bar
        this.createGlassBar(0, height - 50, width, 50);

        // Top bar content
        this.coinsText = this.createStatText(80, 25, '💰 0', '#00d9ff');
        this.stageText = this.createStatText(width / 2, 25, '🎲 STAGE 1', '#ffa500');
        this.spinsText = this.createStatText(width - 120, 25, '🎫 0', '#00ff88');

        // Bottom bar content
        this.betText = this.createStatText(100, height - 25, 'BET: 10', '#ffa500');
        this.winText = this.createStatText(width / 2, height - 25, 'WIN: 0', '#00ff88');
        this.totalText = this.createStatText(width - 140, height - 25, 'TOTAL: 0', '#00d9ff');

        // Update UI every frame
        this.events.on('update', this.updateUI, this);
    }

    private createGlassBar(x: number, y: number, width: number, height: number): void {
        const bar = this.add.rectangle(x, y, width, height, 0x000000, 0.3);
        bar.setOrigin(0, 0);

        // Top border glow
        const glow = this.add.rectangle(x, y, width, 2, 0x00d9ff, 0.4);
        glow.setOrigin(0, 0);
    }

    private createStatText(x: number, y: number, text: string, color: string): Phaser.GameObjects.Text {
        const textObj = this.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: color,
            stroke: '#000000',
            strokeThickness: 3,
        });
        textObj.setOrigin(0.5);
        return textObj;
    }

    private updateUI(): void {
        const state = gameStateManager.getState();

        this.coinsText.setText(`💰 ${state.coins}`);
        this.gemsText?.setText(`♦ ${state.gems}`);
        this.spinsText.setText(`🎫 ${state.spinsRemaining}`);
        this.stageText.setText(`🎲 STAGE ${state.currentStage}`);
        this.betText.setText(`BET: ${state.slotConfig.spinCost}`);
        this.winText.setText(`WIN: 0`);
        this.totalText.setText(`TOTAL: ${state.totalWinnings}`);

        // Pulse animation on value changes
        if (state.coins !== parseInt(this.coinsText.text.split(' ')[1])) {
            this.pulseText(this.coinsText);
        }
    }

    private pulseText(textObj: Phaser.GameObjects.Text): void {
        this.tweens.add({
            targets: textObj,
            scale: { from: 1.2, to: 1 },
            duration: 300,
            ease: 'Back.easeOut',
        });
    }
}
