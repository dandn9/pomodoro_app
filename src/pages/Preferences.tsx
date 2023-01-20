import React, { useState } from 'react';
import Slider from '../components/Slider';
import useCommands from '../hooks/useCommands';
import useStateStore from '../hooks/useStateStore';
import type { AppStateData } from '../hooks/useStateStore';
import useAppStore from '../hooks/useAppTempStore';
import produce from 'immer';

const Preferences = () => {
	const appStore = useStateStore((state) => ({
		...state.data.timer,
		setStateData: state.setStateData,
	}));

	const [timerPreferences, setPreferences] = React.useState({
		timerDuration: [appStore.timer_duration],
		pauseDuration: [appStore.pause_duration],
		longPauseDuration: [appStore.long_pause_duration],
	});

	function onUpdatePreferences(
		newVal: number[],
		key: 'timerDuration' | 'pauseDuration' | 'longPauseDuration'
	) {
		setPreferences((prev) =>
			produce(prev, (draft) => {
				draft[key] = newVal;
			})
		);
	}

	const commands = useCommands();
	function onCommitVal(newVal: number, updater: (val: number) => Promise<AppStateData>) {
		updater(newVal).then((newState) => {
			appStore.setStateData(newState);
			useAppStore.getState().resetState();
		});
	}
	return (
		<div className='w-full h-full flex justify-center items-center'>
			<ul>
				<li>
					<p>Timer duration</p>
					<Slider
						min={1}
						max={500}
						value={timerPreferences.timerDuration}
						onValueChange={(val) => onUpdatePreferences(val, 'timerDuration')}
						onValueCommit={(val) => onCommitVal(val[0], commands.setTimerDuration)}
					/>
					{timerPreferences.timerDuration[0]}
				</li>
				<li>
					<p>Pause duration</p>
					<Slider
						min={1}
						max={500}
						value={timerPreferences.pauseDuration}
						onValueChange={(val) => onUpdatePreferences(val, 'pauseDuration')}
						onValueCommit={(val) => onCommitVal(val[0], commands.setPauseDuration)}
					/>
					{timerPreferences.pauseDuration[0]}
				</li>
				<li>
					<p>Long pause duration</p>
					<Slider
						min={1}
						max={500}
						value={timerPreferences.longPauseDuration}
						onValueChange={(val) => onUpdatePreferences(val, 'longPauseDuration')}
						onValueCommit={(val) => onCommitVal(val[0], commands.setLongPauseDuration)}
					/>
					{timerPreferences.longPauseDuration[0]}
				</li>
			</ul>
		</div>
	);
};
export default Preferences;
