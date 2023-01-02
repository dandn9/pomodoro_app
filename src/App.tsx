import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import reactLogo from './assets/react.svg';
import './App.css';
import { W } from '@tauri-apps/api/event-2a9960e7';

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

	async function onOpenHandle() {
		const input = document.createElement('input');
		input.type = 'file';
		// input.webkitdirectory = true;

		input.onchange = async (ev) => {
			if (!input.files) return;

			const files = [...input.files];
			const first = files[0];

			const fileStream = first.stream().getReader();

			console.log('on change');
			let isDone = false;
			let bytesReceived = 0;
			const allChunks: Uint8Array[] = [];
			while (!isDone) {
				console.log('is done?');
				const { done, value } = await fileStream.read();
				if (done) {
					console.log('it is done');
					isDone = true;
					break;
				}
				bytesReceived += value.length;
				allChunks.push(value);
			}
			// 10 mb
			if (bytesReceived > 10000000) {
				throw new Error('File is too big');
			}
			const dataToSend = new Uint8Array(bytesReceived);
			let dataStore = 0;
			for (const fileChunk of allChunks) {
				dataToSend.set(fileChunk, dataStore);
				dataStore += fileChunk.length;
			}

			console.log('data', dataToSend);
			console.log('data from array', Array.from(dataToSend));
			await invoke('set_timer_sound', {
				soundData: Array.from(dataToSend),
				fileInfo: { FileInfo: 'hi', FileName: 'test!' },
			});
		};
		input.click();
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
			<div>
				<button onClick={onOpenHandle}>OPEN</button>
			</div>
		</>
	);
}

export default App;
