import type { ParticleConfig } from '../../../shared/types';

/**
 * WinParticles - Particle effects for winning symbols
 * Extracted from SlotScene for reusability
 */
export class WinParticles {
    constructor(private scene: Phaser.Scene) { }

    /**
     * Create small win particles (sparkles around symbol)
     */
    createSmall(x: number, y: number): void {
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.image(x, y, 'particle_sparkle');
            particle.setScale(0.1 + Math.random() * 0.2);
            particle.setAlpha(0.8);

            const angle = (Math.PI * 2 * i) / 8;
            const speed = 50 + Math.random() * 100;
            const targetX = x + Math.cos(angle) * speed;
            const targetY = y + Math.sin(angle) * speed;

            this.scene.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                duration: 600 + Math.random() * 400,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy(),
            });
        }
    }

    /**
     * Create big win explosion
     */
    createExplosion(config: ParticleConfig): void {
        const { x, y, count, intensity = 1 } = config;
        const particleCount = Math.floor(count * intensity);

        for (let i = 0; i < particleCount; i++) {
            const particle = this.scene.add.image(x, y, 'particle_sparkle');
            particle.setScale(0.2 + Math.random() * 0.4);
            particle.setAlpha(0.9);
            particle.setTint(Phaser.Display.Color.GetColor(
                255,
                150 + Math.random() * 105,
                Math.random() * 100
            ));

            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 300;
            const targetX = x + Math.cos(angle) * speed;
            const targetY = y + Math.sin(angle) * speed;

            this.scene.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                duration: 1000 + Math.random() * 1000,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy(),
            });

            // Add rotation
            this.scene.tweens.add({
                targets: particle,
                angle: 360 + Math.random() * 360,
                duration: 1000 + Math.random() * 1000,
                ease: 'Linear',
            });
        }

        // Add screen shake for big wins
        if (intensity >= 0.8) {
            this.scene.cameras.main.shake(300, 0.01);
        }

        // Create expanding ring effect
        this.createExpandingRing(x, y);
    }

    private createExpandingRing(x: number, y: number): void {
        const ring = this.scene.add.graphics();
        ring.lineStyle(4, 0xffd700, 0.8);
        ring.strokeCircle(x, y, 10);

        this.scene.tweens.add({
            targets: ring,
            alpha: 0,
            duration: 800,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                ring.clear();
                const scale = 1 + (1 - ring.alpha) * 5;
                ring.lineStyle(4 * (1 - (1 - ring.alpha) * 0.8), 0xffd700, ring.alpha);
                ring.strokeCircle(x, y, 10 * scale);
            },
            onComplete: () => ring.destroy(),
        });
    }
}
