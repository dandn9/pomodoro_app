import { stat } from 'fs';
import React from 'react';
import useStore from '../hooks/useStore';
import { timeToMinutes, timeToSeconds } from '../utils/displayTime';
const Stats = () => {
	const sessions = useStore((state) => state.sessions);

	return (
		<div className='flex justify-center flex-col items-center'>
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
						</li>
					);
				})}
			</ul>
			<button className='mt-2 border border-red-300'>Add new session</button>
		</div>
	);
};
export default Stats;
