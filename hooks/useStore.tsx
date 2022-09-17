import React from 'react';
import create from 'zustand';
// import produce from 'immer';
import { immer } from 'zustand/middleware/immer';
import { invoke } from '@tauri-apps/api/tauri';

interface IStore {
	timer: number;
	currTimer: number;
	pause: number;
	label: string;
	isRunning: boolean;
	saveTimer: () => void;
	getInitialState: () => void;
	// setTimer: () => void;
}

const useStore = create<IStore>()(
	immer((set) => ({
		currTimer: 0,
		timer: 0,
		pause: 0,
		label: '',
		isRunning: false,

		getInitialState: async () => {
			try {
				const timerState = await invoke<{
					label: string;
					pause: number;
					timer: number;
				}>('get_timer_state');
				set(() => ({
					...timerState,
					currTimer: timerState.timer,
				}));
			} catch (e) {
				console.error('error', e);
			}
		},

		saveTimer: async () => {
			try {
				const curr_timer = useStore.getState().timer;
				if (curr_timer < 0) return;
				await invoke('set_timer', { newTimer: curr_timer });
				const timer = await invoke<number>('get_timer');
				set((state) => {
					state.timer = timer;
					state.currTimer = timer;
				});
			} catch (e) {
				console.log('error', e);
			}
		},
	}))
);

export default useStore;
