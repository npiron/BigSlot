/**
 * AmbientLight - Create ambient lighting effects
 * Extracted from SlotScene for reusability
 */
export class AmbientLight {
    constructor(private scene: Phaser.Scene) { }

    /**
     * Create multi-layer spotlight with gradient
     */
    createSpotlight(x: number, y: number): Phaser.GameObjects.Graphics {
        const spotlight = this.scene.add.graphics();

        // Outer glow
        for (let i = 0; i < 20; i++) {
            const alpha = (20 - i) / 250;
            const colors = [0x4a00e0, 0x8e2de2, 0xffd700]; // Purple to gold gradient
            const color = colors[Math.floor((i / 20) * colors.length)];
            spotlight.fillStyle(color, alpha);
            spotlight.fillEllipse(x, y, 350 + i * 20, 320 + i * 20);
        }

        // Inner bright spotlight
        for (let i = 0; i < 10; i++) {
            const alpha = (10 - i) / 80;
            spotlight.fillStyle(0xffffff, alpha);
            spotlight.fillEllipse(x, y, 280 + i * 10, 250 + i * 10);
        }

        return spotlight;
    }

    /**
     * Create scanlines effect for depth
     */
    createScanlines(width: number, height: number): Phaser.GameObjects.Graphics {
        const graphics = this.scene.add.graphics();

        for (let y = 0; y < height; y += 4) {
            graphics.fillStyle(0x000000, 0.05);
            graphics.fillRect(0, y, width, 1);
        }

        return graphics;
    }
}
