import { stat } from 'fs';
import React, { KeyboardEvent, useRef, useState } from 'react';
import useStore from '../hooks/useStore';
import { timeToMinutes, timeToSeconds } from '../utils/displayTime';
import { saveSession, deleteSession } from '../utils/session';
const Stats = () => {
	const sessions = useStore((state) => state.sessions);
	const [menuOpen, setMenuOpen] = useState(false);
	const newLabelRef = useRef<HTMLInputElement | null>(null);

	const onLabelKeyDown = (ev: KeyboardEvent) => {
		if (ev.key === 'Enter' && newLabelRef.current) {
			const sessionName = newLabelRef.current.value;
			saveSession(sessionName, 0).then(() => {
				useStore.getState().loadSessions();
			});
			newLabelRef.current.value = '';
			setMenuOpen(false);
		}
	};

	const onDeleteSession = (sessionId: number) => {
		deleteSession(sessionId).then(() => {
			useStore.getState().loadSessions();
		});
	};

	return (
		<div className='flex  flex-col items-center relative h-screen'>
			<ul>
				{sessions.map((session) => {
					console.log('session', session);
					return (
						<li key={session.id}>
							<h2>{session.label}</h2>
							<div>
								Total Time: {timeToMinutes(session.total_time)}:
								{timeToSeconds(session.total_time)}
							</div>
							<div>
								Started At: {new Date(session.started_at).toISOString()}
							</div>

							<button
								className='bg-red-500'
								onClick={onDeleteSession.bind(null, session.id)}
							>
								DELETE
							</button>
						</li>
					);
				})}
			</ul>
			{menuOpen && (
				<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col flex border rounded-md border-slate-600 p-4'>
					<input
						className='text-black'
						type='text'
						placeholder='Label...'
						ref={newLabelRef}
						onKeyDown={onLabelKeyDown}
					/>
				</div>
			)}
			<button
				className='mt-2 border border-red-300'
				onClick={() => setMenuOpen(!menuOpen)}
			>
				Add new session
			</button>
		</div>
	);
};
export default Stats;
