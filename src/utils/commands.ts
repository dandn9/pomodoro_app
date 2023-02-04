import React from 'react';
import { AppStateData, useStateStore } from '../hooks/useStateStore';
import { invoke } from '@tauri-apps/api';
import { Session } from './classTypes';

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

	static async updateTaskOrder(targetOrder: number, fromOrder: number, sessionIdTarget: number, sessionIdFrom: number) {
		return await invoke<AppStateData>('update_order_task', { targetOrder, fromOrder, sessionIdTarget, sessionIdFrom, })
	}
}
export class SessionCommands {
	static async onSessionDone(id: number, time: number) {
		return await invoke<AppStateData>('on_completed_session', { id, time });
	}
	static async onSelectedSession(id: number) {
		return await invoke<AppStateData>('on_selected_session', { id });
	}
	static async createSession(name: string, color: string, tasks: string[]) {
		try {
			return await invoke<AppStateData | string>('create_session', { name, color, tasks });
		} catch (e) {
			console.log('error', e)
		}
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
