import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import reactLogo from './assets/react.svg';
import './App.css';

interface AppState {
	timer: {
		is_running: boolean;
		pause_duration: number;
		timer_duration: number;
	};
}

function App() {
	const [shouldGetState, setShouldGetState] = useState(true);
	useEffect(() => {
		if (shouldGetState) {
			invoke<AppState>('get_state').then((res) => {
				console.log(`res get : ${JSON.stringify(res)}`);
				setShouldGetState(false);
			});
		}
	}, [shouldGetState]);

	async function onTimerHandle(num: number) {
		const res = await invoke<AppState>('set_timer_duration', { timerNum: num });
		setShouldGetState(true);
	}

	async function onPauseHandle(num: number) {
		const res = await invoke<AppState>('set_pause_duration', { pauseNum: num });
		setShouldGetState(true);
	}
	return (
		<>
			<div>TIMER</div>
			<input
				type='number'
				onChange={(ev) => onTimerHandle(parseInt(ev.target.value))}
			/>
			<div>PAUSE</div>
			<input
				type='number'
				onChange={(ev) => onPauseHandle(parseInt(ev.target.value))}
			/>
		</>
	);
}

export default App;
