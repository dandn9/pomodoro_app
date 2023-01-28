import React, { startTransition } from 'react';
import SessionItem from '../components/sessions/SessionItem';
import useAppStore from '../hooks/useAppTempStore';
import useStateStore from '../hooks/useStateStore';
import Modal from '../components/Modal';
import SessionModalContent from '../components/sessions/NewSessionModalContent';
import EditSessionModalContent from '../components/sessions/EditSessionModalContent';

const Sessions = () => {
	const [editOpen, setEditOpen] = React.useState(false);
	const [editSession, setEditSession] = React.useState(-1);
	const sessionsData = useStateStore((state) => state.data.sessions.sessions);

	function onEdit(sessionId: number) {
		startTransition(() => {
			setEditSession(sessionId);
			setEditOpen(true);
		});
	}
	function onEditClose() {
		startTransition(() => {
			setEditSession(-1);
			setEditOpen(false);
		});
	}

	return (
		<div className='relative'>
			<CreateSessionModal />
			<SessionEditModal
				isOpen={editOpen}
				onEditClose={onEditClose}
				setIsOpen={setEditOpen}
				sessionId={editSession}
			/>

			<ul className='flex flex-col w-full gap-2 max-w-xl mx-auto'>
				{sessionsData.map((session) => (
					<SessionItem key={session.id} session={session} onEdit={onEdit} />
				))}
			</ul>
		</div>
	);
};
export default Sessions;

const SessionEditModal: React.FC<{
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onEditClose: () => void;
	sessionId: number;
}> = ({ isOpen, setIsOpen, sessionId, onEditClose }) => {
	return (
		<Modal setOpen={setIsOpen} open={isOpen}>
			<EditSessionModalContent
				onEditClose={onEditClose}
				sessionId={sessionId}
				setOpen={setIsOpen}
			/>
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
