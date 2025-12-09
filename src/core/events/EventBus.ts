import { Subject, Observable, filter } from 'rxjs';

/**
 * Game Events Enum
 * Centralized event names for type safety
 */
export enum GameEvent {
    // Spin events
    SPIN_START = 'spin:start',
    SPIN_COMPLETE = 'spin:complete',

    // Win events
    WIN = 'win',
    BIG_WIN = 'win:big',
    JACKPOT = 'win:jackpot',

    // State events
    COINS_CHANGED = 'state:coins',
    GEMS_CHANGED = 'state:gems',
    STAGE_CHANGED = 'state:stage',
    SPINS_CHANGED = 'state:spins',

    // UI events
    BUTTON_CLICK = 'ui:button:click',
    BET_CHANGED = 'ui:bet:changed',

    // Audio events
    SOUND_PLAY = 'audio:play',
    MUSIC_START = 'audio:music:start',
    MUSIC_STOP = 'audio:music:stop',
}

export interface GameEventPayload {
    type: GameEvent;
    payload?: any;
    timestamp?: number;
}

/**
 * EventBus - Global event system using RxJS
 * Singleton pattern for centralized event management
 * 
 * @example
 * // Emit event
 * EventBus.getInstance().emit(GameEvent.SPIN_START, { betAmount: 10 });
 * 
 * // Listen to event
 * EventBus.getInstance().on(GameEvent.WIN).subscribe(data => {
 *   console.log('Win!', data);
 * });
 */
export class EventBus {
    private static instance: EventBus;
    private subject$ = new Subject<GameEventPayload>();

    private constructor() { }

    static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    /**
     * Emit an event
     */
    emit(type: GameEvent, payload?: any): void {
        this.subject$.next({
            type,
            payload,
            timestamp: Date.now(),
        });
    }

    /**
     * Listen to a specific event type
     */
    on<T = any>(eventType: GameEvent): Observable<T> {
        return this.subject$.pipe(
            filter(event => event.type === eventType),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (source: any) => source as Observable<T>
        );
    }

    /**
     * Get all events stream
     */
    getAll(): Observable<GameEventPayload> {
        return this.subject$.asObservable();
    }

    /**
     * Destroy the event bus (for cleanup)
     */
    destroy(): void {
        this.subject$.complete();
    }
}

// Export singleton instance for convenience
export const eventBus = EventBus.getInstance();
