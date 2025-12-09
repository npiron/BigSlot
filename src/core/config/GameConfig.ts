import { z } from 'zod';

/**
 * Game Configuration Schema (with Zod validation)
 */
const GameConfigSchema = z.object({
    display: z.object({
        width: z.number().positive(),
        height: z.number().positive(),
    }),
    slot: z.object({
        rows: z.number().int().min(1),
        cols: z.number().int().min(1),
        spinCost: z.number().positive(),
        cellSize: z.number().positive(),
        spacing: z.number().nonnegative(),
    }),
    progression: z.object({
        stagesPerRun: z.number().int().positive(),
        initialSpins: z.number().int().positive(),
        spinsPerStage: z.number().int().positive(),
        initialCoins: z.number().int().nonnegative(),
    }),
    rewards: z.object({
        gemDropChance: z.number().min(0).max(1),
        bigWinMultiplier: z.number().positive(),
    }),
});

type Config = z.infer<typeof GameConfigSchema>;

/**
 * GameConfig - Centralized configuration with validation
 * Singleton pattern ensures single source of truth
 * 
 * @example
 * const config = GameConfig.getInstance();
 * const width = config.get('display').width;
 */
export class GameConfig {
    private static instance: GameConfig;
    private config: Config;

    private constructor() {
        // Default configuration
        const rawConfig = {
            display: {
                width: 1024,
                height: 768,
            },
            slot: {
                rows: 3,
                cols: 5,
                spinCost: 10,
                cellSize: 100,
                spacing: 12,
            },
            progression: {
                stagesPerRun: 10,
                initialSpins: 10,
                spinsPerStage: 10,
                initialCoins: 1000,
            },
            rewards: {
                gemDropChance: 0.1,
                bigWinMultiplier: 10,
            },
        };

        // Validate configuration
        this.config = GameConfigSchema.parse(rawConfig);
    }

    static getInstance(): GameConfig {
        if (!GameConfig.instance) {
            GameConfig.instance = new GameConfig();
        }
        return GameConfig.instance;
    }

    /**
     * Get configuration section
     */
    get<K extends keyof Config>(key: K): Config[K] {
        return this.config[key];
    }

    /**
     * Get entire config (readonly)
     */
    getAll(): Readonly<Config> {
        return Object.freeze({ ...this.config });
    }
}

// Export singleton instance for convenience
export const gameConfig = GameConfig.getInstance();

// Export legacy constant for backwards compatibility
export const CONFIG = {
    STAGES_PER_RUN: gameConfig.get('progression').stagesPerRun,
    INITIAL_SPINS: gameConfig.get('progression').initialSpins,
    SPINS_PER_STAGE: gameConfig.get('progression').spinsPerStage,
    INITIAL_COINS: gameConfig.get('progression').initialCoins,
    GEM_DROP_CHANCE: gameConfig.get('rewards').gemDropChance,
    BIG_WIN_MULTIPLIER: gameConfig.get('rewards').bigWinMultiplier,
};
