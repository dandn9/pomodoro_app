import React from 'react';
import { AppStateData, useStateStore } from '../hooks/useStateStore';
import { invoke } from '@tauri-apps/api';

export class TimerCommands {
	static async setTimerDuration(timerDuration: number) {
		return await invoke<AppStateData>('set_timer_duration', {
			timerNum: timerDuration,
		});
	}
	static async setPauseDuration(pauseDuration: number) {
		return await invoke<AppStateData>('set_pause_duration', {
			pauseNum: pauseDuration,
		});
	}
	static async setLongPauseDuration(longPauseDuration: number) {
		return await invoke<AppStateData>('set_long_pause_duration', {
			pauseNum: longPauseDuration,
		});
	}
}

export class SessionCommands {
	static async onSessionDone(id: number, time: number) {
		return await invoke<AppStateData>('on_completed_session', { id, time });
	}
	static async onSelectedSession(sessionId: number) {
		return await invoke<AppStateData>('on_selected_session', { id: sessionId });
	}
	static async createSession(name: string, color: string, tasks: string[]) {
		return await invoke<AppStateData>('create_session', { name, color, tasks });
	}
}
