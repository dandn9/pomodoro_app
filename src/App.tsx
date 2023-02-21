import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import useAppStore from './hooks/useAppTempStore';
import useStateStore from './hooks/useStateStore';
import Sidebar from './components/UI/Sidebar';
import Toast from './components/UI/Toast';
import { appWindow } from '@tauri-apps/api/window';
const Home = React.lazy(() => import('./pages/Home'));
const Sessions = React.lazy(() => import('./pages/Sessions'));
const Preferences = React.lazy(() => import('./pages/Preferences'));
const NotFound = React.lazy(() => import('./pages/404'));

// this component is used for routing
function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toastSaved = useAppStore((state) => state.toast_saved);
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

    useEffect(() => {
        // global event listeners

        let timeoutRef: NodeJS.Timeout;
        let unlisten: ReturnType<typeof appWindow.onResized> extends Promise<
            infer K
        >
            ? K | undefined
            : never;
        async function handleResize() {
            unlisten = await appWindow.onResized((ev) => {
                if (timeoutRef) clearTimeout(timeoutRef);
                timeoutRef = setTimeout(async () => {
                    const factor = await appWindow.scaleFactor();
                    console.log('new size', ev.payload.width, factor);
                }, 400);
            });
        }
        handleResize();
        console.log('effect');
        return () => {
            if (unlisten) unlisten();
            if (timeoutRef) clearTimeout(timeoutRef);
            console.log('remove effect', unlisten);
        };
    }, []);

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
}

export default App;
