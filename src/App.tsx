import react, { useEffect, useMemo, useRef, useState } from 'react';
import useAppStore from './hooks/useAppTempStore';
import useStateStore from './hooks/useStateStore';
import Home from './pages/Home';
import Preferences from './pages/Preferences';
import Sessions from './pages/Sessions';
import Sidebar from './components/Sidebar';

// this component is used for routing
function App() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const currPage = useAppStore((state) => state.curr_page);
	const isPlaying = useAppStore((state) => state.is_playing);

	const timeoutRef = useRef<NodeJS.Timer | null>(null);
	useEffect(() => {
		// starts the timer if the app is playing
		if (isPlaying) {
			let tick = useAppStore.getState().tick;
			timeoutRef.current = setInterval(() => {
				tick();
			}, 1000);
		}
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [isPlaying]);

	const currComponent = useMemo(() => {
		if (currPage === 'home') return <Home />;
		if (currPage === 'sessions') return <Sessions />;
		if (currPage === 'preferences') return <Preferences />;
	}, [currPage]);

	return (
		<main className='dark:text-white relative flex justify-center items-center w-screen h-screen'>
			<button className='absolute top-0 left-0 z-10' onClick={() => setSidebarOpen((open) => !open)}>
				Open
			</button>
			<Sidebar isOpen={sidebarOpen} />
			<>{currComponent}</>
		</main>
	);
}

export default App;
