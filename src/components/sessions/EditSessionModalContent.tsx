import React, { useEffect, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { TModalContent } from '../../types/ModalContent';
import useStateStore from '../../hooks/useStateStore';
const EditSessionModalContent: TModalContent<{ sessionId: number }> = (props) => {
	const allSessions = useStateStore((state) => state.getSessions());
	const session = useMemo(() => {
		return allSessions.find((session) => session.id === props.sessionId);
	}, [allSessions]);

	if (!session) {
		return <div>Couldn't load the session</div>;
	}

	return (
		<div className='fixed inset-1/4 z-20 dark:text-white bg-gray-800/50 backdrop-blur-3xl rounded-xl'>
			<div className='flex justify-between p-2'>
				<Dialog.Title>Edit session</Dialog.Title>
				<Dialog.Close>X</Dialog.Close>
			</div>
			<form>
				<div>Name: {session.name}</div>
				<div>Color: {session.color}</div>
				<div>Time Spent: {session.time_spent}</div>
				SESSION: {props.sessionId}
				<button type='submit' className='block'>
					save
				</button>
			</form>
		</div>
	);
};
export default EditSessionModalContent;
