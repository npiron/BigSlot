/**
 * Color constants for the game
 */
export const COLORS = {
    BACKGROUND: '#000814',
    PRIMARY: '#00FF41', // Matrix green
    SECONDARY: '#FF006E',
    ACCENT: '#FFD60A',
    TEXT: '#FFFFFF',
    DIM: '#888888',
    NEON_BLUE: '#00d9ff',
    NEON_PURPLE: '#8e2de2',
    GOLD: '#ffd700',
} as const;

export type ColorName = keyof typeof COLORS;
