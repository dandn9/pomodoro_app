import React, { useState } from 'react';
import create from 'zustand';
import produce from 'immer';
import { z } from 'zod';
import { stateDataSchema } from '../utils/schemas';
import useCommands from './useCommands';

type k = ReturnType<typeof useCommands>;
type c = keyof k;
type p = Parameters<k[c]>;

export type AppStateData = z.infer<typeof stateDataSchema>;

interface AppState {
	data: AppStateData;
	setStateData: (newState: AppStateData) => void;
	getSessions: () => AppStateData['sessions']['sessions'];
}

const initialDataState: AppStateData = {
	timer: {
		long_pause_duration: 0,
		pause_duration: 0,
		timer_duration: 0,
	},
	sessions: {
		sessions: [],
	},
	preferences: {
		notification: {
			audio_on_pause: '',
			audio_on_timer: '',
			message_on_pause: '',
			message_on_timer: '',
		},
		autoplay: false,
		enable_sessions: false,
		sessions_to_complete: 0,
		sessions_for_long_pause: 0,
		available_sounds: [],
		show_percentage: false,
		resolution: [0, 0],
	},
};

export const useStateStore = create<AppState>()((set, get) => ({
	data: initialDataState,
	setStateData: (newStateData: AppStateData) => {
		set((state) =>
			produce(state, (draft) => {
				// draft.data = newStateData;
				console.log('new state!', newStateData);
				const new_state = stateDataSchema.parse(newStateData);
				draft.data = new_state;
			})
		);
	},
	getSessions: () => {
		return get().data.sessions.sessions;
	},
}));

export default useStateStore;
