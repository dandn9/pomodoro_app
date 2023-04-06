import { invoke } from '@tauri-apps/api';
import React from 'react';
import { permanentStore, PersistentData } from './store/PermanentStore';
import { exit } from '@tauri-apps/api/process'
import useAppStore from './hooks/useTempStore';
import { PhysicalSize, appWindow } from '@tauri-apps/api/window';
import { stateDataSchema } from './utils/schemas';
import { Commands } from './utils/commands';

// makes sure state is correct before loading the app and attaches some event listeners
const LazyApp = React.lazy(() => {
    return new Promise<typeof import('./App')>((resolve) => {
        invoke<PersistentData>('get_state').then(async (res) => {
            const savedState = stateDataSchema.parse(res)
            permanentStore()._set(savedState);

            /**
             * Debug Utils
             */
            window.addEventListener('keydown', async (ev) => {
                if (ev.key === 'K') {
                    console.log('state', permanentStore());
                    console.log('app state', useAppStore.getState());
                }

                if (ev.key === 'X') {
                    console.log('reloading state');
                    const res = await invoke<PersistentData>('reload_state');
                    permanentStore()._set(res);
                }
            });

            let timeoutRef: NodeJS.Timeout | null = null;
            console.log(permanentStore())

            /**
             * Window events
             */
            await appWindow.onResized(async (ev) => {
                if (ev.payload.width === 0 || ev.payload.height === 0) return; // means whe minimized the app
                if (timeoutRef) clearTimeout(timeoutRef);

                timeoutRef = setTimeout(async () => {

                    permanentStore()
                        .data.preferences?.onChangeAppResolution([
                            ev.payload.width,
                            ev.payload.height,
                        ]);
                }, 400);
            });
            /**
             * Save before quitting
             */
            await appWindow.onCloseRequested(async (ev) => {
                ev.preventDefault()
                console.log(permanentStore().data)
                const ok = await Commands.saveState(permanentStore().data)
                if (ok) {
                    await exit(1)
                }
            })

            resolve(import('./App'));
        });
    });
});
export default LazyApp;
