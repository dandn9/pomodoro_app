import React, { useState, useEffect } from 'react';
import R_Slider from '../components/R_Slider';
import { invoke } from '@tauri-apps/api/tauri';

import * as Slider from '@radix-ui/react-slider';
import useStore from '../hooks/useStore';
const SettingsPage = () => {
	const { setLocalPause, savePause, pause, setLocalTimer, timer, saveTimer } =
		useStore();
	console.log(timer);
	const onTimerChange = (val: number) => {
		setLocalTimer(val);
		saveTimer();
	};
	const onPauseChange = (val: number) => {
		setLocalPause(val);
		savePause();
	};
	console.log(timer);

	return (
		<>
			<div>Settings</div>
			<div>
				<p>Timer</p>
				<R_Slider
					onValueChange={(val) => {
						onTimerChange(val[0]);
					}}
					defaultValue={[timer]}
					hasToolTip
					max={3000}
					min={1}
				/>
			</div>
			<div>
				<p>Pause Timer</p>
				<R_Slider
					onValueChange={(val) => {
						onPauseChange(val[0]);
					}}
					defaultValue={[pause]}
					max={600}
					min={1}
				/>
			</div>
		</>
	);
};
export default SettingsPage;
