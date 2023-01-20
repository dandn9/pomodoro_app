import React from 'react';
import { AppStateData, useStateStore } from './useStateStore';
import { invoke } from '@tauri-apps/api';
const useCommands = () => {
	return {
		setTimerDuration: async (timerDuration: number) => {
			return await invoke<AppStateData>('set_timer_duration', {
				timerNum: timerDuration,
			});
		},
		setPauseDuration: async (pauseDuration: number) => {
			return await invoke<AppStateData>('set_pause_duration', {
				pauseNum: pauseDuration,
			});
		},
		setLongPauseDuration: async (longPauseDuration: number) => {
			return await invoke<AppStateData>('set_long_pause_duration', {
				pauseNum: longPauseDuration,
			});
		},
		onSessionDone: async (id: number, time: number) => {
			return await invoke<AppStateData>('on_completed_session', { id, time });
		},
		onSelectedSession: async (sessionId: number) => {
			return await invoke<AppStateData>('on_selected_session', { id: sessionId });
		},
	};
};

export default useCommands;
