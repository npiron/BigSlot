/**
 * UI Component types
 */

export interface UIButton {
    key: string;
    x: number;
    y: number;
    onClick: () => void;
    glowColor?: number;
}

export interface HUDDisplay {
    coins: number;
    gems: number;
    stage: number;
    spins: number;
}
