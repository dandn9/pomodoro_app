import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Session } from '../../utils/classTypes';
import SessionItem from './SessionItem';

const SessionList: React.FC<{
	sessions: Session[];
	onEdit: (session: Session) => void;
}> = ({ sessions, onEdit }) => {
	return (
		<Accordion.Root type='multiple'>
			{sessions.map((session) => (
				<SessionItem session={session} key={session.id} onEdit={onEdit} />
			))}
		</Accordion.Root>
	);
};
export default SessionList;
