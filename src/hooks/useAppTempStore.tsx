import create from 'zustand';
import produce from 'immer';
import useStateStore from './useStateStore';
import type { stateDataSchema } from '../utils/schemas';
import { object, z } from 'zod';
import { SessionCommands } from '../utils/commands';

type Sessions = z.infer<typeof stateDataSchema>['sessions']['sessions'];
type Session = Sessions extends Array<infer U> ? U : never;

interface AppTempStore {
    curr_timer: number;
    curr_pause: number;
    curr_long_pause: number;
    is_playing: boolean;
    temp_time_added: number;
    curr_page: 'home' | 'sessions' | 'preferences';
    curr_session_count: number;
    curr_state: 'timer' | 'pause' | 'long_pause';
    curr_session?: Session;
    toast_saved: { open: boolean; curr_timer?: NodeJS.Timeout };
    queue: ((...args: any) => any)[];

    tick: () => void;
    resetState: () => void;
    setPage: (curr_page: AppTempStore['curr_page']) => void;
    setIsPlaying: (is_playing: boolean) => void;
    setSession: (session: Session) => void;
    getTimerState: () => {
        state: AppTempStore['curr_state'];
        timer: number;
        progress: number;
        session?: Session;
    };
}

const useAppStore = create<AppTempStore>()((set, get) => ({
    curr_timer: 0,
    curr_pause: 0,
    curr_long_pause: 0,
    is_playing: false,
    curr_page: 'sessions',
    curr_session_count: 0,
    curr_state: 'timer',
    curr_session: undefined,
    temp_time_added: 0,
    queue: [],
    toast_saved: { open: false, curr_timer: undefined },

    tick: () => {
        set((state) =>
            produce(state, (draft) => {
                if (!state.is_playing) return;
                if (!state.curr_session) return;

                const curr_state = state.curr_state;
                console.log('ticking!', curr_state);
                console.log(state.curr_timer);

                if (state[`curr_${curr_state}`] <= 0) {
                    console.log('timed out');
                    const app_state = useStateStore.getState().data;
                    draft.is_playing = app_state.preferences.autoplay;

                    if (curr_state === 'timer') {
                        draft.curr_session_count++;

                        draft.queue.push(async () => {
                            const newState =
                                await SessionCommands.onSessionDone(
                                    state.curr_session!.id!,
                                    app_state.timer.timer_duration +
                                        state.temp_time_added
                                );
                            useStateStore.getState().setStateData(newState);
                        });
                    }
                    if (
                        curr_state === 'timer' &&
                        draft.curr_session_count %
                            app_state.preferences.sessions_for_long_pause ===
                            0
                    ) {
                        draft.curr_state = 'long_pause';
                    } else if (curr_state === 'timer') {
                        draft.curr_state = 'pause';
                    } else {
                        draft.curr_state = 'timer';
                    }
                    draft.temp_time_added = 0;
                    // send notification
                    // +1 session
                    draft[`curr_${curr_state}`] =
                        app_state.timer[`${curr_state}_duration`];

                    while (draft.queue.length > 0) {
                        console.log('clearing queue');
                        const fn = draft.queue.shift();
                        if (fn) {
                            fn();
                        }
                    }
                } else {
                    draft[`curr_${curr_state}`] -= 1;
                }
            })
        );
    },
    resetState: () => {
        set((state) =>
            produce(state, (draft) => {
                const curr_state = useStateStore.getState().data;
                console.log('resetting state to', curr_state);
                draft.curr_session =
                    curr_state.sessions.sessions.find(
                        (sess) => sess.is_selected
                    ) || undefined;
                draft.curr_timer = curr_state.timer.timer_duration;
                draft.curr_pause = curr_state.timer.pause_duration;
                draft.curr_long_pause = curr_state.timer.long_pause_duration;
                draft.toast_saved.open = true;
            })
        );
        // logic for the "saved" toast
        if (get().toast_saved.curr_timer) {
            clearTimeout(get().toast_saved.curr_timer);
        }
        const timer = setTimeout(() => {
            set((state) =>
                produce(state, (draft) => {
                    draft.toast_saved.open = false;
                    draft.toast_saved.curr_timer = undefined;
                })
            );
        }, 1500);
        set((state) => ({
            ...state,
            toast_saved: { open: state.toast_saved.open, curr_timer: timer },
        }));
    },
    setSession(session: Session) {
        set((state) =>
            produce(state, (draft) => {
                draft.curr_session = session;
            })
        );
    },
    setPage: (page: AppTempStore['curr_page']) => {
        set((state) =>
            produce(state, (draft) => {
                draft.curr_page = page;
            })
        );
    },
    setIsPlaying(is_playing: boolean) {
        set((state) =>
            produce(state, (draft) => {
                draft.is_playing = is_playing;
            })
        );
    },
    // object as {state: state, time:time}
    getTimerState: () => {
        const state = get().curr_state;
        const timer = get()[`curr_${state}`];
        const timerDuration =
            useStateStore.getState().data.timer[`${state}_duration`];
        const session = get().curr_session;

        const progress = timer / Math.max(timerDuration, timer); // in case we added some temporary time

        return { state, timer, progress, session };
    },
}));
export default useAppStore;
