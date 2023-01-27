import { current, produceWithPatches } from 'immer';
import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import useCommands from '../../hooks/useCommands';
import { SessionType } from '../../utils/schemas';

interface SessionItemProps {
	session: SessionType;
	onSelect: (sessionId: number) => void;
	onEdit: (sessionId: number) => void;
}

type ftype = (p: string, x: string) => ReactElement;
interface XProps {
	children: (x: ftype) => ReactElement;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onSelect, onEdit }) => {
	function onEditClick(ev: React.MouseEvent) {
		ev.stopPropagation();
		onEdit(session.id);
	}

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
			{/* <X>{(func) => func('X', 'D')}</X> */}
			<button className='absolute right-2 top-0' onClick={onEditClick}>
				E
			</button>
		</li>
	);
};
export default SessionItem;

// const P = () => {
// 	return <X>{(f) => <div>{f}</div>}</X>;
// };
