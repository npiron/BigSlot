import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload(): void {
        // Create loading text
        const { width, height } = this.cameras.main;

        const loadingText = this.add.text(
            width / 2,
            height / 2,
            'LOADING...',
            {
                fontFamily: '"Courier New", monospace',
                fontSize: '32px',
                color: '#00FF41',
            }
        );
        loadingText.setOrigin(0.5);

        // Simulate CRT scan effect on loading text
        this.tweens.add({
            targets: loadingText,
            alpha: { from: 0.8, to: 1 },
            duration: 500,
            yoyo: true,
            repeat: -1,
        });
    }

    create(): void {
        // Add CRT shader effects to camera
        this.cameras.main.setBackgroundColor('#000814');

        // Transition to menu after brief delay
        this.time.delayedCall(500, () => {
            this.scene.start('MenuScene');
        });
    }
}
