import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useRef } from 'react';
import create from 'zustand';
import useStore from '../hooks/useStore';
import Layout from '../components/Layout';
import CustomWindowbar from '../components/CustomWindowbar';

const tick = useStore.getState().tick;

function MyApp({ Component, pageProps }: AppProps) {
	const [isRunning, currSession] = useStore((state) => [
		state.isRunning,
		state.currSession,
	]);
	const intervalRef = useRef<NodeJS.Timer | null>(null);

	useEffect(() => {
		useStore.getState().getInitialState();
	}, []);

	useEffect(() => {
		if (isRunning && currSession) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			intervalRef.current = setInterval(() => {
				tick();
			}, 1000);
		}
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning, currSession]);
	return (
		<div className='h-screen w-screen flex flex-col justify-end'>
			<CustomWindowbar />
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</div>
	);
}

export default MyApp;

/* 

			*/
