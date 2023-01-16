import create from 'zustand';
import produce from 'immer';
import useStateStore from './useStateStore';
import useCommands from './useCommands';
import type { stateDataSchema } from '../utils/schemas';
import { object, z } from 'zod';

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

	tick: () => void;
	resetState: () => void;
	setPage: (curr_page: AppTempStore['curr_page']) => void;
	setIsPlaying: (is_playing: boolean) => void;
	getTimerWithState: () => { state: AppTempStore['curr_state']; timer: number };
}

const useAppStore = create<AppTempStore>()((set, get) => ({
	curr_timer: 0,
	curr_pause: 0,
	curr_long_pause: 0,
	is_playing: false,
	curr_page: 'preferences',
	curr_session_count: 0,
	curr_state: 'timer',
	curr_session: undefined,
	temp_time_added: 0,

	tick: () => {
		set((state) =>
			produce(state, (draft) => {
				if (!state.is_playing) return;
				if (!state.curr_session) return;

				const curr_state = state.curr_state;

				if (state[`curr_${curr_state}`] <= 0) {
					const app_state = useStateStore.getState().data;
					draft.is_playing = app_state.preferences.autoplay;

					if (curr_state === 'timer') {
						draft.curr_session_count++;

						useCommands().onSessionDone(
							state.curr_session.id!,
							app_state.timer.timer_duration + state.temp_time_added
						);
						// should setup a flag to queue ? useCommands().onSessionDone()
					}
					// switches state based on current one
					if (
						curr_state === 'timer' &&
						draft.curr_session_count % app_state.preferences.sessions_for_long_pause === 0
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
					draft[`curr_${curr_state}`] = app_state.timer[`${curr_state}_duration`];
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
				draft.curr_session = curr_state.sessions.sessions.find((sess) => sess.is_selected) || undefined;
				draft.curr_timer = curr_state.timer.timer_duration;
				draft.curr_pause = curr_state.timer.pause_duration;
				draft.curr_long_pause = curr_state.timer.long_pause_duration;
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
	getTimerWithState: () => {
		const state = get().curr_state;
		const timer = get()[`curr_${state}`];
		return { state, timer };
	},
}));
export default useAppStore;
