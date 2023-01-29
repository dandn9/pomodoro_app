import React from 'react';
import { Task } from '../../utils/classTypes';
import Checkbox from '../UI/Checkbox';
const TaskItemSession: React.FC<{
	task: Task;
	onTaskChecked: (taskId: number, checked: boolean) => void;
	onDragStart: (ev: React.DragEvent<HTMLLIElement>) => void;
	onDragEnd: (ev: React.DragEvent<HTMLLIElement>) => void;
	onDrag: (ev: React.DragEvent<HTMLLIElement>) => void;
}> = ({ task, onTaskChecked, onDragStart, onDragEnd, onDrag }) => {
	// use a ref here to pass the element to the sessionItem component in order to drag it
	const liRef = React.useRef<HTMLLIElement>(null);

	return (
		<li
			className='bg-slate-800 flex justify-between px-20 select-none pointer-events-[all] [-webkit-user-drag:element]'
			draggable='true'
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onDrag={onDrag}>
			<div>
				{task.order} - {task.name}
			</div>
			<div>
				<Checkbox
					defaultChecked={task.is_done}
					onCheckedChange={(checked) => {
						onTaskChecked(task.id, !!checked);
					}}
				/>
			</div>
		</li>
	);
};
export default TaskItemSession;
