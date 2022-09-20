import React, { useEffect, useRef } from 'react';
// import { appWindow } from '@tauri-apps/api/window';
import Image from 'next/image';
// import { app } from '@tauri-apps/api';

declare global {
	interface Window {
		__TAURI__: any;
	}
}

const CustomWindowbar = () => {
	const minimize = useRef<HTMLDivElement | null>(null);
	const maximize = useRef<HTMLDivElement | null>(null);
	const close = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		console.log('window', window);
		console.log(close);
		const appWindow = window.__TAURI__.window.appWindow;
		// console.log(a.appWindow.close());
		// console.log('bb', a);
	}, []);
	return (
		<div
			data-tauri-drag-region
			className='titlebar h-7 gap-1 z-50 pr-1  shadow-sm fixed bg-main_bg border-b border-main_outline flex justify-end items-center  overflow-hidden'
		>
			<div
				onClick={() => {
					window.__TAURI__.window.appWindow.minimize();
				}}
				className='flex justify-center items-center hover:brightness-125 transition-all'
				ref={minimize}
			>
				<Image
					src='/assets/icons/minimize.svg'
					alt='minimize'
					width={20}
					height={20}
				/>
			</div>
			<div
				className='flex justify-center items-center hover:brightness-125 transition-all'
				ref={maximize}
				onClick={() => {
					console.log(window.__TAURI__.window.appWindow.isMaximized());
					window.__TAURI__.window.appWindow
						.isMaximized()
						.then((res: boolean) => {
							if (res) {
								window.__TAURI__.window.appWindow.unmaximize();
							} else {
								window.__TAURI__.window.appWindow.maximize();
							}
						});
				}}
			>
				<Image
					src='/assets/icons/maximize.svg'
					alt='maximize'
					width={20}
					height={20}
				/>
			</div>
			<div
				className='flex justify-center items-center hover:brightness-125 transition-all'
				ref={close}
				onClick={() => {
					window.__TAURI__.window.appWindow.close();
				}}
			>
				<Image
					src='/assets/icons/close.svg'
					alt='close'
					width={20}
					height={20}
				/>
			</div>
		</div>
	);
};
export default CustomWindowbar;
