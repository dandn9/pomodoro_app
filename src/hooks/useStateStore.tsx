import React, { useState } from 'react';
import create from 'zustand';
import produce from 'immer';

interface Session {
	id: number;
	name: string;
	color: string;
	is_selected: boolean;
	time_spent: number;
	total_sessions: number;
	created_at: Date;
}
export interface AppStateData {
	timer: {
		is_running: boolean;
		pause_duration: number;
		timer_duration: number;
	};
	sessions: Session[];
	theme: {
		notification: {
			audio_on_pause: string;
			audio_on_timer: string;
			message_on_pause: string;
			message_on_timer: string;
		};
		preferred_theme: 'dark' | 'light';
	};
}
interface AppState {
	data: AppStateData;
	setStateData: (newState: AppStateData) => void;
}

const initialDataState: AppStateData = {
	timer: {
		is_running: false,
		pause_duration: 0,
		timer_duration: 0,
	},
	sessions: [],
	theme: {
		notification: {
			audio_on_pause: '',
			audio_on_timer: '',
			message_on_pause: '',
			message_on_timer: '',
		},
		preferred_theme: 'dark',
	},
};

export const useStateStore = create<AppState>()((set, get) => ({
	data: initialDataState,
	setStateData: (newStateData: AppStateData) => {
		set((state) =>
			produce(state, (draft) => {
				draft.data = newStateData;
			})
		);
	},
}));

export default useStateStore;
