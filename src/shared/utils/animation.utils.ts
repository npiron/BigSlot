import type { TweenConfig } from '../types';

/**
 * Animation helper utilities
 */
export class AnimationUtils {
    /**
     * Get default elastic tween config
     */
    static getElasticBounce(duration = 300): TweenConfig {
        return {
            duration,
            ease: 'Elastic.easeOut',
        };
    }

    /**
     * Get default pulse tween config
     */
    static getPulse(duration = 400): TweenConfig {
        return {
            duration,
            yoyo: true,
            repeat: 3,
        };
    }

    /**
     * Calculate correct scale for sprite display size
     */
    static calculateScale(
        originalSize: number,
        targetSize: number
    ): number {
        return targetSize / originalSize;
    }

    /**
     * Create scale tween values preserving sprite size
     */
    static getScaleTween(
        currentScale: number,
        multiplier: number
    ): { from: number; to: number } {
        return {
            from: currentScale * multiplier,
            to: currentScale,
        };
    }
}
