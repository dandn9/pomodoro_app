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
