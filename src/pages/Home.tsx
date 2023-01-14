import React from 'react';
import Timer from '../components/Timer';
import useAppStore from '../hooks/useAppTempStore';
import { secondsToTimeString } from '../utils/displayTime';

const Home = () => {
	const appStore = useAppStore();
	const timerWithState = appStore.getTimerWithState();
	return (
		<section>
			timer: {timerWithState.state} - {secondsToTimeString(timerWithState.timer)} left
			<Timer />
			<div className='flex flex-col '>
				<button
					onClick={() => {
						appStore.setIsPlaying(true);
					}}
				>
					Play
				</button>
				<button
					onClick={() => {
						appStore.setIsPlaying(false);
					}}
				>
					Pause
				</button>
			</div>
		</section>
	);
};
export default Home;
