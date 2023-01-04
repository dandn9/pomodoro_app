import { useEffect, useRef, useState } from 'react';
import { app, invoke } from '@tauri-apps/api';
import reactLogo from './assets/react.svg';
import './App.css';
import { readBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';
import useStateStore from './hooks/useStateStore';
import type { AppStateData } from './hooks/useStateStore';
import {
	isPermissionGranted,
	sendNotification,
	requestPermission,
} from '@tauri-apps/api/notification';
import { appWindow } from '@tauri-apps/api/window';

function App() {
	const [shouldGetState, setShouldGetState] = useState(true);
	const store = useStateStore();
	const session_name = useRef<HTMLInputElement>(null);
	const session_color = useRef<HTMLInputElement>(null);
	const session_id = useRef<HTMLInputElement>(null);
	const task_name = useRef<HTMLInputElement>(null);
	appWindow.theme().then((theme) => {
		console.log('theme', theme);
	});
	appWindow.onThemeChanged(({ payload: theme }) => {
		console.log('new theme', theme);
	});

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
	async function onSendNotification() {
		let permissionGranted = await isPermissionGranted();
		if (!permissionGranted) {
			const permission = await requestPermission();
			permissionGranted = permission === 'granted';
		}
		if (permissionGranted) {
			sendNotification({
				title: 'HI!',
				body: 'Hello world',
			});
		}
	}
	async function onSendTimerEvent() {
		appWindow.emit('toggle_timer_app', { message: 'Start TTTimer' });
	}

	async function onCreateSession() {
		const res = await invoke<AppStateData>('create_session', {
			name: session_name.current!.value,
			color: session_color.current!.value,
		});

		store.setStateData(res);
	}
	async function onRemoveSession() {
		const res = await invoke<AppStateData>('remove_session', {
			id: parseInt(session_id.current!.value),
		});

		store.setStateData(res);
		console.log('new store', store);
	}
	async function onUpdateSession() {
		const color = session_color.current!.value;
		const name = session_name.current!.value;
		const payload = {} as { id: number; name?: string; color?: string };
		if (color) payload.color = color;
		if (name) payload.name = name;
		payload.id = parseInt(session_id.current!.value);

		const res = await invoke<AppStateData>('update_session', payload);
		store.setStateData(res);
		console.log('new store', res);
	}
	async function onAddTask() {
		const res = await invoke<AppStateData>('task', { action: 'SetIsDone' });
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
			<div>
				<button onClick={onSendNotification}>SEND NOTIFICATION</button>
			</div>
			<div>
				<button onClick={onSendTimerEvent}>SEND TIMER EVENT</button>
			</div>
			<p>Session Name</p>
			<input ref={session_name} />
			<p>Session Color</p>
			<input ref={session_color} />
			<p>Session Id</p>
			<input type='number' ref={session_id} />
			<div>
				<button onClick={onCreateSession}>CREATE SESSION</button>
			</div>
			<div>
				<button onClick={onRemoveSession}>REMOVE SESSION</button>
			</div>
			<div>
				<button onClick={onUpdateSession}>UPDATE SESSION</button>
			</div>
			<p>Task name</p>
			<div>
				<button onClick={onAddTask}>UPDATE SESSION</button>
			</div>
		</>
	);
}

export default App;
