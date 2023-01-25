import React, { startTransition } from 'react';
import SessionItem from '../components/sessions/SessionItem';
import useAppStore from '../hooks/useAppTempStore';
import useCommands from '../hooks/useCommands';
import useStateStore from '../hooks/useStateStore';
import Modal from '../components/Modal';
import SessionModalContent from '../components/sessions/NewSessionModalContent';
import EditSessionModalContent from '../components/sessions/EditSessionModalContent';

const Sessions = () => {
	const [editOpen, setEditOpen] = React.useState(false);
	const [editSession, setEditSession] = React.useState(-1);

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
	function onEdit(sessionId: number) {
		startTransition(() => {
			setEditSession(sessionId);
			setEditOpen(true);
		});
	}

	return (
		<div className='relative'>
			<CreateSessionModal />
			<SessionEditModal
				isOpen={editOpen}
				setIsOpen={setEditOpen}
				sessionId={editSession}
			/>

			<ul className='flex flex-col w-full gap-2 max-w-xl mx-auto'>
				{sessionsData.map((session) => (
					<SessionItem
						onSelect={onSelect}
						key={session.id}
						session={session}
						onEdit={onEdit}
					/>
				))}
			</ul>
		</div>
	);
};
export default Sessions;

const SessionEditModal: React.FC<{
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	sessionId: number;
}> = ({ isOpen, setIsOpen, sessionId }) => {
	return (
		<Modal setOpen={setIsOpen} open={isOpen}>
			<EditSessionModalContent sessionId={sessionId} setOpen={setIsOpen} />
		</Modal>
	);
};

const CreateSessionModal = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<>
			<button onClick={() => setIsOpen(true)} className='w-full '>
				Create Session
			</button>
			<Modal open={isOpen} setOpen={setIsOpen}>
				<SessionModalContent setOpen={setIsOpen} />
			</Modal>
		</>
	);
};
