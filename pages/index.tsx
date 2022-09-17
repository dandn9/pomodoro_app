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
import Slider from '../components/slider';

// in server side next js context does not know about tauri, so tauri calls can only happen in clientside code

const Home: NextPage = () => {
	const [isMenuOpened, setIsMenuOpened] = useState(false);

	const [timer, isRunning, pause] = useStore((state) => [
		state.currTimer,
		state.isRunning,
		state.pause,
	]);
	const [timerSlider, setTimerSlider] = useState(timer);
	const [pauseSlider, setPauseSlider] = useState(pause);

	const timerTimeout = useRef<NodeJS.Timer | null>(null);

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

	const onMinutesChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const setMinutes = parseInt(ev.target.value);
		useStore.setState((state) => {
			state.timer = setMinutes;
			state.currTimer = setMinutes;
		});
		setTimerSlider(setMinutes);

		if (timerTimeout.current) {
			clearTimeout(timerTimeout.current);
		}
		// waits 1 s on changes before sending it to backend to get saved
		timerTimeout.current = setTimeout(() => {
			useStore.getState().saveTimer();
		}, 1000);
	};

	return (
		<div className='w-screen h-screen flex justify-center items-center flex-col'>
			<div className='flex gap-2'>
				<div
					className='text-red-600 p-12 bg-white/10 rounded-full relative'
					onClick={() => {
						setIsMenuOpened(!isMenuOpened);
					}}
				>
					{isMenuOpened && (
						<div
							className='absolute left-[80%] bg-slate-900 top-0 py-2 px-4 border-slate-600 border rounded-md'
							onClick={(ev) => {
								// ev.preventDefault();
								ev.stopPropagation();
								console.log('capture');
							}}
						>
							<Slider
								max={minutesToTime(60)}
								min={minutesToTime(5)}
								onChange={onMinutesChange}
								value={timerSlider}
								converValue={timeToMinutes}
								label='Minutes'
							/>
							<Slider
								max={minutesToTime(20)}
								min={minutesToTime(1)}
								onChange={(ev) => {
									console.log(ev.target.value);
									setPauseSlider(parseInt(ev.target.value));
								}}
								converValue={timeToMinutes}
								value={pauseSlider}
								label='Pause'
							/>
						</div>
					)}
					<span>{timeToMinutes(timer)}</span>:
					<span>{timeToSeconds(timer)}</span>
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
