import { invoke } from '@tauri-apps/api';
import React from 'react';
import useStateStore, { AppStateData } from './hooks/useStateStore';
import useAppStore from './hooks/useAppTempStore';
import { appWindow } from '@tauri-apps/api/window';

const LazyApp = React.lazy(() => {
    return new Promise<typeof import('./App')>((resolve) => {
        invoke<AppStateData>('get_state').then(async (res) => {
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
            let timeoutRef: NodeJS.Timeout | null = null;
            const _unlisten = await appWindow.onResized((ev) => {
                if (timeoutRef) clearTimeout(timeoutRef);
                timeoutRef = setTimeout(async () => {
                    const factor = await appWindow.scaleFactor();
                    console.log('new size in test', ev.payload.width, factor);
                }, 400);
            });

            console.log('finished');
            resolve(import('./App'));
        });
    });
});
export default LazyApp;
