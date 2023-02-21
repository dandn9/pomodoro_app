import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import './index.css';
import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';

import useStateStore, { AppStateData } from './hooks/useStateStore';
import useAppStore from './hooks/useAppTempStore';

/* TODO BLOCK
/**
 *
 * TODO: Optimize renders on playable sound and not re-render everything on state changes
 * TODO: Look into start up time (looks like it's rust side of things)
 * TODO: Change UI components to be more like Select.tsx
 *
 */

const App = React.lazy(() => {
    return new Promise<typeof import('./App')>((resolve) => {
        invoke<AppStateData>('get_state').then((res) => {
            console.log(`initial - get `, res);
            console.log('hihi!');
            useStateStore.getState().setStateData(res);

            window.addEventListener('keydown', async (ev) => {
                if (ev.key === 'K') {
                    console.log('state', useStateStore.getState());
                    console.log('app state', useAppStore.getState());
                }
                if (ev.key === 'X') {
                    console.log('reloading state');
                    const res = await invoke<AppStateData>('reload_state');
                    useStateStore.getState().setStateData(res);
                }
            });
            // let timeoutRef: NodeJS.Timeout;

            // const _unlisten = await appWindow.onResized((ev) => {
            //     if (timeoutRef) clearTimeout(timeoutRef);
            //     timeoutRef = setTimeout(async () => {
            //         const factor = await appWindow.scaleFactor();
            //         console.log('new size mainn', ev.payload.width, factor);
            //     }, 400);
            // });

            // debug infos
            console.log('app');
            resolve(import('./App'));
        });
    });
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense
            fallback={<div className="text-red-400">Loading..</div>}>
            <App />
        </React.Suspense>
    </React.StrictMode>
);
