import React, { useState, useEffect } from 'react';
import R_Slider from '../components/R_Slider';
import { invoke } from '@tauri-apps/api/tauri';

import * as Slider from '@radix-ui/react-slider';
import useStore from '../hooks/useStore';
const SettingsPage = () => {
	const { setLocalTimer, timer, saveTimer } = useStore();
	console.log(timer);
	const onTimerChange = async (val: number) => {
		setLocalTimer(val);
		saveTimer();
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
					value={[timer]}
					max={3000}
					min={60}
				/>
			</div>
			<div>
				<p>Pause Timer</p>
				<R_Slider />
			</div>
		</>
	);
};
export default SettingsPage;
