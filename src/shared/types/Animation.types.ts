/**
 * Animation configuration types
 */

export interface TweenConfig {
    duration?: number;
    ease?: string;
    delay?: number;
    yoyo?: boolean;
    repeat?: number;
}

export interface ParticleConfig {
    x: number;
    y: number;
    count: number;
    intensity?: number;
}
