import create from 'zustand';
import produce from 'immer';
import useStateStore from './useStateStore';

interface AppTempStore {
	curr_timer: number;
	curr_pause: number;
	curr_long_pause: number;
	is_playing: boolean;
	curr_page: 'home' | 'sessions' | 'preferences';
	curr_session_count: number;
	curr_state: 'timer' | 'pause' | 'long_pause';
	tick: () => void;
	resetState: () => void;
	changePage: (curr_page: AppTempStore['curr_page']) => void;
}
const useAppStore = create<AppTempStore>()((set, get) => ({
	curr_timer: 0,
	curr_pause: 0,
	curr_long_pause: 0,
	is_playing: false,
	curr_page: 'home',
	curr_session_count: 0,
	curr_state: 'timer',

	tick: () => {
		set((state) =>
			produce(state, (draft) => {
				if (!state.is_playing) return;

				const curr_state = state.curr_state;

				if (state[`curr_${curr_state}`] <= 0) {
					const app_state = useStateStore.getState().data;
					draft.is_playing = app_state.preferences.autoplay;
					// switches state based on current one
					if (
						curr_state === 'timer' &&
						state.curr_session_count ===
							app_state.preferences.sessions_for_long_pause
					) {
						draft.curr_state = 'long_pause';
					} else if (curr_state === 'timer') {
						draft.curr_state = 'pause';
					} else {
						draft.curr_state = 'timer';
					}
					// send notification
					// +1 session
					draft.curr_session_count += 1;
					draft[`curr_${curr_state}`] =
						app_state.timer[`${curr_state}_duration`];
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
				draft.curr_timer = curr_state.timer.timer_duration;
				draft.curr_pause = curr_state.timer.pause_duration;
				draft.curr_long_pause = curr_state.timer.long_pause_duration;
			})
		);
	},
	changePage: (page: AppTempStore['curr_page']) => {
		set((state) =>
			produce(state, (draft) => {
				draft.curr_page = page;
			})
		);
	},
}));
export default useAppStore;
