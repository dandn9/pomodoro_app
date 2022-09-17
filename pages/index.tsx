import type { NextPage } from 'next';
import Head from 'next/head';
import { invoke } from '@tauri-apps/api/tauri';
import { currentMonitor } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';

// in server side next js context does not know about tauri, so tauri calls can only happen in clientside code

const Home: NextPage = () => {
	const [timer, setTimer] = useState(0);
	const [hasChanged, setHasChanged] = useState(true);
	useEffect(() => {
		if (hasChanged) {
			invoke<number>('get_timer')
				.then((val) => {
					console.log(val);
					setTimer(val);
					setHasChanged(false);
				})
				.catch((err) => console.log('someting went wrong', err));
		}
	}, [hasChanged]);

	const modifyTimer = (modifier: number) => {
		invoke('set_timer', { newTimer: timer + modifier })
			.then((val) => {
				setHasChanged(true);
			})
			.catch((err) => console.log('error', err));
	};

	return (
		<>
			<button onClick={modifyTimer.bind(null, -1)}>MINUS</button>
			<div className='text-red-600'>{timer}</div>
			<button onClick={modifyTimer.bind(null, +1)}>ADD</button>
		</>
	);
};

export default Home;
