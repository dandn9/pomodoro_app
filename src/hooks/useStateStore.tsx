import React from 'react';
import create from 'zustand';
// import produce from 'immer';
import { immer } from 'zustand/middleware/immer';
import { invoke } from '@tauri-apps/api/tauri';
import { timerExpires } from '../utils/sendNotification';
import { saveSession } from '../utils/session';

interface AppState {
	timer: {
		is_running: boolean;
		pause_duration: number;
		timer_duration: number;
	};
}

interface Session {
	label: string;
	id: number;
	started_at: number;
	total_time: number;
	selected: boolean;
}

interface IStore {
	timer: number;
	currTimer: number;
	pause: number;
	currPause: number;
	interruptedTime: number; // if the user switches task during timer, here should be the time left that was done [reset it to 0 if no task was switched]
	isRunning: boolean;
	sessions: Session[];
	currSession?: Session;
	saveTimer: () => void;
	savePause: () => void;
	getInitialState: () => void;
	tick: () => void;
	setLocalTimer: (n: number) => void;
	setLocalPause: (n: number) => void;
	loadSessions: () => void;
	mode: 'timer' | 'pause'; // describes if it needs to count down the timer or the pause

	// setTimer: () => void;
}

function playSound() {
	const audio = new Audio('/assets/bonk.mp3');
	audio.play();
}

const useStore = create<IStore>()(
	immer((set) => ({
		currTimer: 0,
		timer: 0,
		pause: 0,
		sessions: [],
		currPause: 0,
		interruptedTime: 0,
		isRunning: false,
		mode: 'timer',

		getInitialState: async () => {
			try {
				const timerState = await invoke<{
					label: string;
					pause: number;
					timer: number;
				}>('get_timer_state');

				const sessionsState = await invoke<{ sessions: Session[] }>(
					'get_sessions'
				);
				const latestSession = sessionsState.sessions.find(
					(session) => session.selected === true
				);

				console.log('sesssion', sessionsState);
				console.log('timer', timerState);

				set(() => ({
					...timerState,
					currTimer: timerState.timer,
					currPause: timerState.pause,
					sessions: sessionsState.sessions,
					currSession: latestSession,
				}));
			} catch (e) {
				console.error('error', e);
			}
		},
		tick: () => {
			set((state) => {
				if (state.mode === 'timer') {
					if (state.currTimer <= 0) {
						// make sound
						playSound();
						timerExpires();

						if (state.currSession) {
							console.log('FINISHED!', state.interruptedTime);
							if (state.interruptedTime > 0) {
								saveSession(state.currSession.label, state.interruptedTime);
								state.interruptedTime = 0;
							} else {
								saveSession(state.currSession.label, state.timer);
							}
						}
						state.mode = 'pause';
						state.currTimer = state.timer;
						state.isRunning = false;
						return;
					}
					state.currTimer--;
				} else if (state.mode === 'pause') {
					if (state.currPause <= 0) {
						playSound();
						timerExpires();
						state.mode = 'timer';
						state.currPause = state.pause;
						state.isRunning = false;
						return;
					}
					state.currPause--;
				}
			});
		},
		loadSessions: async () => {
			const sessionsState = await invoke<{ sessions: Session[] }>(
				'get_sessions'
			);
			const latestSession = sessionsState.sessions.find(
				(session) => session.selected === true
			);

			console.log('LOAD SESSIONS', sessionsState, latestSession);

			set((state) => {
				state.sessions = sessionsState.sessions;
				state.currSession = latestSession;
			});
		},
		setLocalTimer: (n: number) => {
			set((state) => {
				state.isRunning = false;

				state.timer = n;
				state.currTimer = n;
			});
		},
		setLocalPause: (n: number) => {
			set((state) => {
				state.isRunning = false;

				state.pause = n;
				state.currPause = n;
			});
		},

		saveTimer: async () => {
			try {
				const curr_timer = useStore.getState().timer;
				if (curr_timer < 0) return;
				await invoke('set_timer', { newTimer: curr_timer });
			} catch (e) {
				console.log('error', e);
			}
		},

		savePause: async () => {
			try {
				const curr_pause = useStore.getState().pause;
				if (curr_pause < 0) return;
				await invoke('set_pause', { newPause: curr_pause });
			} catch (e) {
				console.error('error', e);
			}
		},
	}))
);

export default useStore;
