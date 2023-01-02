import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import reactLogo from './assets/react.svg';
import './App.css';
import { readBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';
import useStateStore from './hooks/useStateStore';
import type { AppStateData } from './hooks/useStateStore';

function App() {
	const [shouldGetState, setShouldGetState] = useState(true);
	const store = useStateStore();
	useEffect(() => {
		if (shouldGetState) {
			invoke<AppStateData>('get_state').then((res) => {
				console.log(`res get : ${JSON.stringify(res)}`);
				setShouldGetState(false);
			});
		}
	}, [shouldGetState]);

	async function onTimerHandle(num: number) {
		const res = await invoke<AppStateData>('set_timer_duration', {
			timerNum: num,
		});
		setShouldGetState(true);
	}

	async function onPauseHandle(num: number) {
		const res = await invoke<AppStateData>('set_pause_duration', {
			pauseNum: num,
		});
		setShouldGetState(true);
	}

	async function onSetTimerAudio() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'audio/*,.mp4';
		// input.webkitdirectory = true;

		input.onchange = async (ev) => {
			if (!input.files) return;

			const files = [...input.files];
			const first = files[0];

			const fileStream = first.stream().getReader();

			// 10 mb
			if (first.size > 10000000) {
				throw new Error('File is too big');
			}
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
			const dataToSend = new Uint8Array(bytesReceived);
			let dataStored = 0;
			for (const fileChunk of allChunks) {
				dataToSend.set(fileChunk, dataStored);
				dataStored += fileChunk.length;
			}

			const res = await invoke<AppStateData>('set_timer_sound', {
				soundData: Array.from(dataToSend),
				fileInfo: { name: first.name },
			});
			store.setStateData(res);
		};
		input.click();
	}
	async function onPlayTimerAudio() {
		// await invoke('play_timer_sound');
		console.log(store.data);
		console.log(BaseDirectory.AppData);
		const audioBin = await readBinaryFile(
			`audio/${store.data.theme.notification.audio_on_timer}`,
			{
				dir: BaseDirectory.AppData,
			}
		);
		const audioBlob = new Blob([audioBin], { type: 'audio/webm' });
		const audiourl = URL.createObjectURL(audioBlob);
		const audio = new Audio(audiourl);
		audio.play();
		// readB;
		// let audio = new Audio("")
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
				<button onClick={onSetTimerAudio}>SET TIMER AUDIO</button>
			</div>
			<div>
				<button onClick={onPlayTimerAudio}>PLAY TIMER AUDIO</button>
			</div>
		</>
	);
}

export default App;
