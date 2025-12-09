// Game balance and configuration constants

export const CONFIG = {
    // Slot machine
    INITIAL_ROWS: 3,
    INITIAL_COLS: 3,
    MAX_ROWS: 5,
    MAX_COLS: 5,
    INITIAL_SPIN_COST: 10,

    // Run progression
    INITIAL_SPINS: 20,
    SPINS_PER_STAGE: 15,
    STAGES_PER_RUN: 10,

    // Currency
    STARTING_COINS: 100,
    GEM_DROP_CHANCE: 0.05, // 5% chance on big wins

    // Win thresholds
    BIG_WIN_MULTIPLIER: 10, // 10x bet = big win
    MEGA_WIN_MULTIPLIER: 50,

    // CRT Effects
    CRT_SCANLINE_INTENSITY: 0.15,
    CRT_PHOSPHOR_GLOW: 0.3,
    CRT_FLICKER_RATE: 0.02,

    // Colors (retro CRT palette)
    COLORS: {
        BACKGROUND: '#000814',
        PRIMARY: '#00FF41', // Matrix green
        SECONDARY: '#FF006E',
        ACCENT: '#FFD60A',
        TEXT: '#FFFFFF',
        DIM: '#888888',
    },

    // Fonts
    FONT_FAMILY: '"Courier New", Courier, monospace',
    FONT_SIZE_LARGE: 48,
    FONT_SIZE_MEDIUM: 32,
    FONT_SIZE_SMALL: 20,
};
