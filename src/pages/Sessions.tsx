import React from 'react';
import Session from '../components/sessions/SessionItem';
import useAppStore from '../hooks/useAppTempStore';
import useCommands from '../hooks/useCommands';
import useStateStore from '../hooks/useStateStore';
import NewSessionModal from '../components/sessions/NewSession';

const Sessions = () => {
	const [isModalOpen, setIsModalOpen] = React.useState(true);

	const sessionsData = useStateStore((state) => state.data.sessions.sessions);
	const setState = useStateStore((state) => state.setStateData);
	const setNewSession = useAppStore((state) => state.setSession);

	const commands = useCommands();

	async function onSelect(sessionId: number) {
		const newState = await commands.onSelectedSession(sessionId);
		setState(newState);
		const new_session = newState.sessions.sessions.find((s) => s.id === sessionId);
		if (new_session) {
			setNewSession(new_session);
		}
	}
	async function onAddNewTerminal() {}

	return (
		<div className='relative'>
			<NewSessionModal onOpenChange={setIsModalOpen} />

			<ul className='flex flex-col w-full gap-2 max-w-xl mx-auto'>
				{sessionsData.map((session) => (
					<Session onSelect={onSelect} key={session.id} session={session} />
				))}
			</ul>
		</div>
	);
};
export default Sessions;
