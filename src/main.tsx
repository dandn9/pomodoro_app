import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import './index.css';
import { invoke } from '@tauri-apps/api';
import useStateStore, { AppStateData } from './hooks/useStateStore';
import useAppStore from './hooks/useAppTempStore';

const App = React.lazy(() => {
    return new Promise<typeof import('./App')>((resolve) => {
        invoke<AppStateData>('get_state').then((res) => {
            console.log(`initial - get `, res);
            console.log('hihi!');
            useStateStore.getState().setStateData(res);

            // debug infos
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
            resolve(import('./App'));
        });
    });
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense fallback={<div>Loading..</div>}>
            <App />
        </React.Suspense>
    </React.StrictMode>
);
