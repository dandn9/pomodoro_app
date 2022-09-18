import type { NextPage } from 'next';
import Head from 'next/head';
import { invoke } from '@tauri-apps/api/tauri';
import { currentMonitor } from '@tauri-apps/api/window';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import useStore from '../hooks/useStore';
import {
	minutesToTime,
	secondsToTime,
	timeToMinutes,
	timeToSeconds,
} from '../utils/displayTime';
// import Slider from '../components/Slider';
import SettinginsMenu from '../components/SettingsMenu';
import SessionsMenu from '../components/SessionsMenu';

// in server side next js context does not know about tauri, so tauri calls can only happen in clientside code

const Home: NextPage = () => {
	const [isMenuOpened, setIsMenuOpened] = useState(false);
	const [isSessionsOpened, setIsSessionsOpened] = useState(false);

	const [timer, isRunning, pause, mode, currSession] = useStore((state) => [
		state.currTimer,
		state.isRunning,
		state.currPause,
		state.mode,
		state.currSession,
	]);

	const onStartTimer = () => {
		if (isRunning) return;
		useStore.setState((state) => {
			state.isRunning = true;
		});
	};

	const onPauseTimer = () => {
		if (!isRunning) return;
		useStore.setState((state) => {
			state.isRunning = false;
		});
	};

	const onStopTimer = () => {
		useStore.setState((state) => {
			state.isRunning = false;
			state.currTimer = state.timer;
		});
	};

	console.log(mode);
	return (
		<div className='w-screen h-screen flex justify-center items-center flex-col'>
			<span className='absolute top-0'>{mode}</span>
			<div
				onClick={() => setIsSessionsOpened(!isSessionsOpened)}
				className='relative'
			>
				<span>{currSession ? currSession.label : 'Select a session'}</span>
				{isSessionsOpened && <SessionsMenu />}
			</div>
			<div className='flex gap-2'>
				<div
					className='text-red-600 p-12 bg-white/10 rounded-full relative'
					onClick={() => {
						setIsMenuOpened(!isMenuOpened);
					}}
				>
					{isMenuOpened && <SettinginsMenu />}
					<span>
						{mode === 'timer' ? timeToMinutes(timer) : timeToMinutes(pause)}
					</span>
					:
					<span>
						{mode === 'timer' ? timeToSeconds(timer) : timeToSeconds(pause)}
					</span>
				</div>
			</div>
			<div className='flex gap-4 mt-2'>
				<button onClick={onStartTimer}>START</button>
				<button onClick={onPauseTimer}>PAUSE</button>
				<button onClick={onStopTimer}>STOP</button>
			</div>
		</div>
	);
};

export default Home;
