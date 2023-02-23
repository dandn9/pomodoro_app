import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import './index.css';
import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';

import useStateStore, { AppStateData } from './hooks/useStateStore';
import useAppStore from './hooks/useAppTempStore';
// import Test from './Test';
import LazyApp from './LazyApp';
// import Test from './Test';
// const App = React.lazy(() => import('./App'));

/* TODO BLOCK
/**
 *
 * TODO: Optimize renders on playable sound and not re-render everything on state changes
 * TODO: Look into start up time (looks like it's rust side of things)
 * TODO: Change UI components to be more like Select.tsx
 * TODO: !! Instead of replacing the state everytime, just check for differences and if so update it - could even just keep internal frontend state and just look for diffs and dont do anything if there are no diffs
 *  -> this will make it so that the app doesn't re-render everything when the state changes and improve performance
 * 
 *
 */

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense
            fallback={<div className="text-red-400">Loading..</div>}>
            <LazyApp />
        </React.Suspense>
    </React.StrictMode>
);
