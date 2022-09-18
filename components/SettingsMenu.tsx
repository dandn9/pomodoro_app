import React, { ChangeEvent, useState, useRef } from 'react';
import Slider from './Slider';
import { minutesToTime, timeToMinutes } from '../utils/displayTime';
import useStore from '../hooks/useStore';

const setTimer = useStore.getState().setLocalTimer;
const setPause = useStore.getState().setLocalPause;

const SliderMenu = () => {
	const [timer, globalTimer, pause, globalPause] = useStore((state) => [
		state.currTimer,
		state.timer,
		state.currPause,
		state.pause,
	]);

	const timerTimeout = useRef<NodeJS.Timer | null>(null);
	const pauseTimeout = useRef<NodeJS.Timer | null>(null);

	const onTimerChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const setMinutes = parseInt(ev.target.value);
		setTimer(setMinutes);

		if (timerTimeout.current) {
			clearTimeout(timerTimeout.current);
		}
		// waits 1 s on changes before sending it to backend to get saved
		timerTimeout.current = setTimeout(() => {
			useStore.getState().saveTimer();
		}, 1000);
	};

	const onPauseChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const setMinutes = parseInt(ev.target.value);
		setPause(setMinutes);

		if (pauseTimeout.current) {
			clearTimeout(pauseTimeout.current);
		}
		// waits 1 s on changes before sending it to backend to get saved
		pauseTimeout.current = setTimeout(() => {
			useStore.getState().savePause();
		}, 1000);
	};

	return (
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
				min={minutesToTime(0.3)}
				onChange={onTimerChange}
				value={globalTimer}
				converValue={timeToMinutes}
				label='Minutes'
				step={30}
			/>
			<Slider
				max={minutesToTime(20)}
				min={minutesToTime(1)}
				onChange={onPauseChange}
				converValue={timeToMinutes}
				value={globalPause}
				label='Pause'
			/>
		</div>
	);
};
export default SliderMenu;
