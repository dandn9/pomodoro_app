import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { invoke } from '@tauri-apps/api';
import useStateStore, { AppStateData } from './hooks/useStateStore';
import useAppStore from './hooks/useAppTempStore';

invoke<AppStateData>('get_state').then((res) => {
	console.log(`initial - get `, res);
	useStateStore.getState().setStateData(res);
	useAppStore.getState().resetState();
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
