import React from 'react';
import { invoke } from '@tauri-apps/api';
import { PermanentData } from '../store/PermanentStore';

export class Commands {
	public static async saveState(data: PermanentData) {
		return await invoke<boolean>('save_state', { data })
	}
}