import React from 'react';
import Session from '../components/SessionItem';
import useCommands from '../hooks/useCommands';
import useStateStore from '../hooks/useStateStore';
const Sessions = () => {
	const sessionsData = useStateStore((state) => state.data.sessions.sessions);
	const setState = useStateStore((state) => state.setStateData);

	const commands = useCommands();

	async function onSelect(sessionId: number) {
		const newState = await commands.onSelectedSession(sessionId);
		setState(newState);
	}

	return (
		<div>
			<ul className='flex flex-col w-full gap-2 max-w-xl mx-auto'>
				{sessionsData.map((session) => (
					<Session onSelect={onSelect} key={session.id} session={session} />
				))}
			</ul>
		</div>
	);
};
export default Sessions;
