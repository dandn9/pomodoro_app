import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useRef } from 'react';
import create from 'zustand';
import useStore from '../hooks/useStore';
import Layout from '../components/Layout';

const tick = useStore.getState().tick;

function MyApp({ Component, pageProps }: AppProps) {
	const isRunning = useStore((state) => state.isRunning);
	const intervalRef = useRef<NodeJS.Timer | null>(null);

	useEffect(() => {
		useStore.getState().getInitialState();
	}, []);

	useEffect(() => {
		if (isRunning) {
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
	}, [isRunning]);
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
}

export default MyApp;
