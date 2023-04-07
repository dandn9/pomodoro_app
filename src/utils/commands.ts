import React from 'react';
import { invoke } from '@tauri-apps/api';
import { PermanentData } from '../store/PermanentStore';

export class Commands {
	public static async saveState(data: PermanentData) {
		console.log('saving', data)
		return await invoke<boolean>('save_state', { state: data })
	}
	public static async getState() {
		return await invoke<PermanentData>('get_state')
	}
}