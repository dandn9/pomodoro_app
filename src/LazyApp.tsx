import { invoke } from '@tauri-apps/api';
import React from 'react';
import useStateStore, { AppStateData } from './hooks/useStateStore';
import useAppStore from './hooks/useAppTempStore';
import { PhysicalSize, appWindow } from '@tauri-apps/api/window';

// makes sure state is correct before loading the app and attaches some event listeners
const LazyApp = React.lazy(() => {
    return new Promise<typeof import('./App')>((resolve) => {
        invoke<AppStateData>('get_state').then(async (res) => {
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
            await appWindow.onResized((ev) => {
                if (timeoutRef) clearTimeout(timeoutRef);

                timeoutRef = setTimeout(async () => {
                    useStateStore
                        .getState()
                        .data.preferences.onChangeAppResolution([
                            ev.payload.width,
                            ev.payload.height,
                        ]);
                }, 400);
            });

            console.log('finished');
            resolve(import('./App'));
        });
    });
});
export default LazyApp;
