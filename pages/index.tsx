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
import SettingsMenu from '../components/SettingsMenu';
import SessionsMenu from '../components/SessionsMenu';
import useClickOutside from '../hooks/useClickOutside';
import CircleTimer from '../components/CircleTimer';
import Button from '../components/Button';
import Image from 'next/image';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';

// in server side next js context does not know about tauri, so tauri calls can only happen in clientside code

const Home: NextPage = () => {
	const [isSessionsOpened, setIsSessionsOpened] = useState(false);
	const [showModeText, setShowModeText] = useState(false);

	const sessionsMenuRef = useRef<HTMLDivElement>(null);
	const sessionsContainerRef = useRef<HTMLDivElement>(null);

	const isJustOpened = useRef(true);
	const labelTimerRef = useRef<NodeJS.Timeout | null>(null);

	useClickOutside(
		sessionsMenuRef,
		(_) => {
			setIsSessionsOpened(false);
		},
		sessionsContainerRef
	);

	const [timer, isRunning, pause, mode, currSession] = useStore((state) => [
		state.currTimer,
		state.isRunning,
		state.currPause,
		state.mode,
		state.currSession,
	]);
	useEffect(() => {
		console.log('useeffect show mode');
		if (isJustOpened.current) {
			setShowModeText(true);
			isJustOpened.current = false;
			return;
		}

		setShowModeText(true);
		labelTimerRef.current = setTimeout(() => {
			console.log('clear it');
			setShowModeText(false);
		}, 6000);

		return () => {
			console.log('clearning function sueeffect');
			if (labelTimerRef.current) {
				clearTimeout(labelTimerRef.current);
			}
		};
	}, [mode]);

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
			if (state.mode === 'timer') {
				state.currTimer = state.timer;
			} else {
				state.currPause = state.pause;
			}
		});
	};

	return (
		<div className='w-full h-full overflow-hidden relative'>
			<AnimatePresence>
				{showModeText && (
					<motion.span
						exit={{
							opacity: 0,
							y: -210,
							x: '-50%',
						}}
						initial={{ opacity: 0, y: -280, x: '-50%' }}
						animate={{ opacity: 1, y: -250, x: '-50%' }}
						transition={{ duration: 0.6 }}
						className='absolute top-1/2 left-1/2'
					>
						{mode}
					</motion.span>
				)}
			</AnimatePresence>
			<div
				ref={sessionsContainerRef}
				onClick={() => setIsSessionsOpened(!isSessionsOpened)}
				className='absolute top-1/2 -translate-y-[215px] left-1/2 -translate-x-1/2 z-50'
			>
				<Button className='flex gap-2 items-center '>
					<Image
						src='/assets/icons/tag.svg'
						width={20}
						className='opacity-40'
						height={20}
						alt='Tag manager'
					/>
					{currSession ? currSession.label : 'Select a session'}
				</Button>
				<AnimatePresence>
					{isSessionsOpened && (
						<SessionsMenu
							ref={sessionsMenuRef}
							clickCb={() => setIsSessionsOpened(false)}
						/>
					)}
				</AnimatePresence>
			</div>
			<div className='z-10'>
				<CircleTimer className={isRunning ? 'animate-glow' : ''} />

				<div className='flex gap-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-black'>
					<span>
						{mode === 'timer' ? timeToMinutes(timer) : timeToMinutes(pause)}
					</span>
					:
					<span>
						{mode === 'timer' ? timeToSeconds(timer) : timeToSeconds(pause)}
					</span>
				</div>
			</div>

			<div className='flex gap-4 mt-2 absolute left-1/2 -translate-x-1/2 top-1/2 translate-y-[160px]'>
				<AnimatePresence mode='wait'>
					{!isRunning && (
						<motion.button
							whileHover={{ opacity: 0.8 }}
							key='playButton'
							initial={{ opacity: 0, y: 60 }}
							animate={{ opacity: 0.5, y: 0 }}
							transition={{
								type: 'spring',
								damping: 10,
								stiffness: 100,
								duration: 0.3,
							}}
							exit={{ opacity: 0, y: 50, transition: { duration: 0.1 } }}
							onClick={onStartTimer}
						>
							<Image
								src='/assets/icons/play.svg'
								alt='play icon'
								width={62}
								height={62}
							/>
						</motion.button>
					)}

					{isRunning && (
						<>
							<motion.button
								layout
								key='pauseButton'
								whileHover={{ opacity: 0.8 }}
								onClick={onPauseTimer}
								initial={{ opacity: 0, y: 60 }}
								animate={{ opacity: 0.5, y: 0 }}
								transition={{
									type: 'spring',
									damping: 10,
									stiffness: 100,
									duration: 0.3,
								}}
								exit={{ opacity: 0, y: 20, transition: { duration: 0.1 } }}
								className='opacity-50 hover:opacity-80'
							>
								<Image
									src='/assets/icons/pause.svg'
									alt='play pause'
									width={62}
									height={62}
								/>
							</motion.button>
							<motion.button
								key='stopButton'
								onClick={onStopTimer}
								whileHover={{ opacity: 0.8 }}
								initial={{ opacity: 0, y: 60 }}
								transition={{
									type: 'spring',
									damping: 10,
									stiffness: 100,
									duration: 0.3,
								}}
								animate={{ opacity: 0.5, y: 0 }}
								exit={{ opacity: 0, y: 20, transition: { duration: 0.1 } }}
								className='opacity-50 hover:opacity-80'
							>
								<Image
									src='/assets/icons/stop.svg'
									alt='play pause'
									width={62}
									height={62}
								/>
							</motion.button>
						</>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Home;
