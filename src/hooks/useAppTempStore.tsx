import create from 'zustand';
import produce from 'immer';

interface AppTempStore {
	curr_timer: number;
	curr_pause: number;
	curr_long_pause: number;
	is_playing: boolean;
	curr_page: 'home' | 'sessions' | 'preferences';
	curr_session_count: number;
}
const useAppStore = create<{}>();
