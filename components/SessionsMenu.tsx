/* eslint-disable react/display-name */
import Link from 'next/link';
import React from 'react';
import useStore from '../hooks/useStore';
import Menu from './Menu';
import { setSessionSelected } from '../utils/session';
const SessionsMenu = React.forwardRef<HTMLDivElement>((_props, ref) => {
	const onSessionSelected = (
		ev: React.MouseEvent<HTMLLIElement>,
		sessionId: number
	) => {
		ev.stopPropagation();
		setSessionSelected(sessionId);
	};
	const sessions = useStore((state) => state.sessions);

	return (
		<Menu ref={ref} position='top'>
			{sessions.length === 0 ? (
				<div>
					Please create a
					<Link href='/stats'>
						<span className='underline font-bold cursor-pointer'>Session</span>
					</Link>
				</div>
			) : (
				<ul>
					{sessions.map((session) => (
						<li
							key={session.id}
							className='min-w-[160px] border-b border-gray-700/80 shadow-sm hover:bg-gray-700/40 transition-all cursor-pointer last-of-type:border-b-0 px-4 py-1'
							onClick={(ev) => onSessionSelected(ev, session.id)}
						>
							{session.label}
						</li>
					))}
				</ul>
			)}
		</Menu>
	);
});
export default SessionsMenu;
