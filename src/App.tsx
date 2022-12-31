import { useState } from 'react';
import { invoke } from '@tauri-apps/api';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
	invoke('greet', { name: 'World' }).then((res) => {
		console.log(`res : ${res}`);
	});
	invoke('get_state').then((res) => {
		console.log(`res get : ${JSON.stringify(res)}`);
	});
	return <div>YO</div>;
}

export default App;
