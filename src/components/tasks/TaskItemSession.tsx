import React from 'react';
import { Task } from '../../utils/classTypes';
import Checkbox from '../UI/Checkbox';
const TaskItemSession: React.FC<{
	task: Task;
	onTaskChecked: (taskId: number, checked: boolean) => void;
}> = ({ task, onTaskChecked }) => {
	return (
		<li className='bg-slate-800 flex justify-between px-20' draggable>
			<div>{task.name}</div>
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
