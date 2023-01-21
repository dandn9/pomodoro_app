import { produceWithPatches } from 'immer';
import React from 'react';
import type { AppStateData } from '../hooks/useStateStore';

interface SessionItemProps {
	session: AppStateData['sessions']['sessions'][0];
	onSelect: (sessionId: number) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onSelect }) => {
	return (
		<>
			<li
				onClick={onSelect.bind(null, session.id)}
				className={`w-full max-h-32 border 
                ${session.is_selected ? 'border-white' : 'border-gray-400'}
                `}
			>
				{session.name} - {session.id}{' '}
			</li>
		</>
	);
};
export default SessionItem;
