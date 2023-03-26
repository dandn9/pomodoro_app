import React from 'react';
import Timer from '../components/UI/Timer';
import useAppStore from '../hooks/useAppTempStore';
import { secondsToTimeString } from '../utils/displayTime';

const Home = () => {
	const appStore = useAppStore();
	const timerState = appStore.getTimerState();
	return (
		<div className='w-full h-full flex justify-center items-center'>
			<div>
				timer: {timerState.state} - {secondsToTimeString(timerState.timer)} left -
				{timerState.session?.name}
				<Timer
					progress={timerState.progress}
					radius={200}
					className='dark:stroke-white transition-all'
				/>
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
			</div>
		</div>
	);
};
export default Home;
