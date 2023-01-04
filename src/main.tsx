import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { invoke } from '@tauri-apps/api';
import useStateStore, { AppStateData } from './hooks/useStateStore';

invoke<AppStateData>('get_state').then((res) => {
	console.log(`initial - get `, res);
	useStateStore.getState().setStateData(res);
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
