import React, { useEffect } from 'react';
import { Task } from '../../utils/classTypes';
import TextInput from '../UI/TextInput';
import Checkbox from '../UI/Checkbox';

interface TaskProps {
	task: Task;
	index: number;
}

const TaskItemEdit: React.FC<TaskProps> = ({ task, index }) => {
	const inputEl = React.useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (task.is_draft && inputEl.current) {
			inputEl.current.focus();
		}
	}, []);

	return (
		<li
			className={`w-full flex justify-between ${
				task.is_draft ? 'bg-slate-400' : 'bg-slate-200'
			}`}>
			<div>
				<TextInput defaultValue={task.name} name={`task-${index}`} ref={inputEl} />-{' '}
				{task.id}
			</div>
			<div>
				<Checkbox defaultChecked={task.is_done} name={`task-${index}-done`} />
			</div>
			<input type='hidden' name={`task-${index}-id`} value={task.id} />
			<input type='hidden' name={`task-${index}-order`} value={task.order} />
		</li>
	);
};
export default TaskItemEdit;
