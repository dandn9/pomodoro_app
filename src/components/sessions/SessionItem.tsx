import { produceWithPatches } from 'immer';
import React from 'react';
import useCommands from '../../hooks/useCommands';
import { SessionType } from '../../utils/schemas';

interface SessionItemProps {
	session: SessionType;
	onSelect: (sessionId: number) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onSelect }) => {
	return (
		<li
			onClick={onSelect.bind(null, session.id)}
			className={`w-full relative max-h-32 border 
                ${session.is_selected ? 'border-white' : 'border-gray-400'}
                `}
		>
			<p>
				{session.name} - {session.id}
			</p>
			<div>
				{session.tasks.map((task) => (
					<p key={task.id}>
						{task.name} - {task.is_done ? 'done' : 'not done'}
					</p>
				))}
			</div>
			<button className='absolute right-2 top-0'>X</button>
		</li>
	);
};
export default SessionItem;
