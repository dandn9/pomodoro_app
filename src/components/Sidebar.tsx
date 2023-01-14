import React, { useState } from 'react';
import useAppStore from '../hooks/useAppTempStore';

const Sidebar: React.FC<{ isOpen: boolean }> = (props) => {
	function onMenuClick(page: 'home' | 'sessions' | 'preferences') {
		// i want the type to be equal to the type of changePage, could use <Parameters<typeof changePage>[0]> but that would not be very readable
		// and i want the menu to include all of the possible pages, so that if the type mistamatch it will be caught by the compiler

		useAppStore.getState().setPage(page);
	}
	return (
		<aside
			className={`h-full absolute left-0 bg-gray-800 transition-all 
				${props.isOpen ? `` : `-translate-x-full`}`}
		>
			<ul className='flex flex-col justify-center h-full '>
				<li onClick={() => onMenuClick('home')} className='cursor-pointer hover:bg-white/25 '>
					home
				</li>
				<li onClick={() => onMenuClick('sessions')} className='cursor-pointer hover:bg-white/25 '>
					sessions
				</li>
				<li onClick={() => onMenuClick('preferences')} className='cursor-pointer hover:bg-white/25 '>
					preferences
				</li>
			</ul>
		</aside>
	);
};
export default Sidebar;
