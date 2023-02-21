import React, {
    ComponentType,
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import useAppStore from './hooks/useAppTempStore';
import useStateStore, { AppStateData } from './hooks/useStateStore';
import Sidebar from './components/UI/Sidebar';
import Toast from './components/UI/Toast';
import { appWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api';
const Home = React.lazy(() => import('./pages/Home'));
const Sessions = React.lazy(() => import('./pages/Sessions'));
const Preferences = React.lazy(() => import('./pages/Preferences'));
const NotFound = React.lazy(() => import('./pages/404'));

// this component is used for routing
const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toastSaved = useAppStore((state) => state.toast_saved);
    const currPage = useAppStore((state) => state.curr_page);
    const isPlaying = useAppStore((state) => state.is_playing);

    const timeoutRef = useRef<NodeJS.Timer | null>(null);
    const CurrComponent = useMemo(() => {
        if (currPage === 'home') return Home;
        if (currPage === 'sessions') return Sessions;
        if (currPage === 'preferences') return Preferences;
        return NotFound;
    }, [currPage]);

    return (
        <main className="relative h-screen w-screen dark:bg-zinc-800 dark:text-white">
            <section>
                <button
                    className="absolute top-0 left-0 z-20"
                    onClick={() => setSidebarOpen((open) => !open)}>
                    Open
                </button>
                <Sidebar isOpen={sidebarOpen} />
            </section>

            <section className="h-full w-full">
                <Suspense fallback={<div>Loading page</div>}>
                    <CurrComponent />
                </Suspense>
            </section>
            <Toast open={toastSaved.open} />
        </main>
    );
};

// const a = import('./App');
export default App;
