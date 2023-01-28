import React from 'react';
import { TaskType } from '../../utils/schemas';

interface TaskProps {
	task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }) => {
	return (
		<li className='w-full'>
			<div>
				{task.name} - {task.id}
			</div>
			<div>is done: {task.is_done ? 'yes' : 'no'}</div>
		</li>
	);
};
export default Task;
