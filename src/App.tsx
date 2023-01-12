import react, { useMemo } from 'react';
import useAppStore from './hooks/useAppTempStore';
import useStateStore from './hooks/useStateStore';
import Home from './pages/Home';
import Preferences from './pages/Preferences';
import Sessions from './pages/Sessions';
import Sidebar from './components/Sidebar';

// this component is used for routing
function App() {
	const currPage = useAppStore((state) => state.curr_page);
	const currComponent = useMemo(() => {
		if (currPage === 'home') return <Home />;
		if (currPage === 'sessions') return <Sessions />;
		if (currPage === 'preferences') return <Preferences />;
	}, [currPage]);

	return (
		<main className='relative flex justify-center items-center w-screen h-screen'>
			<Sidebar />
			<>{currComponent}</>
		</main>
	);
}

export default App;
