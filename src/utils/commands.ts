import React from 'react';
import { AppStateData, useStateStore } from '../hooks/useStateStore';
import { invoke } from '@tauri-apps/api';
import { Session } from './classes/Sessions';
import { ChangeSessionOrderArgs, ChangeTaskOrderArgs } from './types';
import { CircleStyles, ThemeOptions } from './classes';

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

export class SessionsCommands {

	static async updateTaskOrder(data: ChangeTaskOrderArgs) {
		return await invoke<AppStateData>('update_order_task', data)
	}

	static async updateSessionOrder(data: ChangeSessionOrderArgs) {
		return await invoke<AppStateData>('update_order_session', data)
	}

	static async createSession(name: string, color: string, tasks: string[]) {
		return await invoke<AppStateData>('create_session', { name, color, tasks });
	}
}
export class SessionCommands {
	static async onSessionDone(id: number, time: number) {
		return await invoke<AppStateData>('on_completed_session', { id, time });
	}
	static async onSelectedSession(id: number) {
		return await invoke<AppStateData>('on_selected_session', { id });
	}
	static async deleteSession(id: number) {
		return await invoke<AppStateData>('delete_session', { id });
	}
	static async updateSession(session: Session) {
		return await invoke<AppStateData>('update_session', { session });
	}
	static async updateDoneTask(taskId: number, sessionId: number, isDone: boolean) {
		return await invoke<AppStateData>('update_done_task', { sessionId, taskId, isDone });
	}
}

export class PreferencesCommands {

	static async setAudioSoundById(id: number) {
		return await invoke<AppStateData>('set_timer_sound_id', { id });
	}

	static async setPauseSoundById(id: number) {
		return await invoke<AppStateData>('set_pause_sound_id', { id });
	}

	static async addSound(name: string, pathName: string) {
		return await invoke<AppStateData>('add_sound', { name, pathName });
	}
	static async deleteSound(id: number) {
		return await invoke<AppStateData>('delete_sound', { id });
	}
	static async renameSound(id: number, name: string) {
		return await invoke<AppStateData>('rename_sound', { id, name });
	}
	static async changeTheme(theme: ThemeOptions) {
		return await invoke<AppStateData>('change_theme', { theme });
	}
	static async changeCircleStyle(style: CircleStyles) {
		return await invoke<AppStateData>('change_circle_style', { style });
	}
	static async setAutoplay(autoplay: boolean) {
		return await invoke<AppStateData>('set_autoplay', { autoplay });
	}
	static async setShowPercentage(showPercentage: boolean) {
		return await invoke<AppStateData>('set_show_percentage', { showPercentage });
	}
}