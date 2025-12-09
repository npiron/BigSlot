import { random, clamp } from 'lodash';

/**
 * Math utility functions
 */
export class MathUtils {
    /**
     * Generate random integer between min and max (inclusive)
     */
    static randomInt(min: number, max: number): number {
        return random(min, max);
    }

    /**
     * Clamp value between min and max
     */
    static clamp(value: number, min: number, max: number): number {
        return clamp(value, min, max);
    }

    /**
     * Map value from one range to another
     */
    static mapRange(
        value: number,
        inMin: number,
        inMax: number,
        outMin: number,
        outMax: number
    ): number {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    /**
     * Linear interpolation
     */
    static lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    /**
     * Check if number is in range
     */
    static inRange(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }
}
