import React, { useEffect } from 'react';
import { Task } from '../../utils/classTypes';
import TextInput from '../UI/TextInput';
import Checkbox from '../UI/Checkbox';

interface TaskProps {
	task: Task;
	index: number;
}

const TaskItemEdit: React.FC<TaskProps> = ({ task, index }) => {
	const [toDelete, setToDelete] = React.useState(false);
	const inputEl = React.useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (task.is_draft && inputEl.current) {
			inputEl.current.focus();
		}
	}, []);
	const bg = toDelete ? 'bg-red-400' : task.is_draft ? 'bg-slate-400' : 'bg-slate-200';

	return (
		<li className={`w-full flex justify-between ${bg}`}>
			<div>
				<TextInput
					defaultValue={task.name}
					name={`task-${index}`}
					ref={inputEl}
				/>
				- {task.id}
			</div>
			<div>
				<button
					className='text-red-600'
					type='button'
					onClick={() => {
						setToDelete((x) => !x);
					}}>
					DELETE
				</button>
				<Checkbox defaultChecked={task.is_done} name={`task-${index}-done`} />
			</div>
			<input type='hidden' name={`task-${index}-id`} value={task.id} />
			<input type='hidden' name={`task-${index}-delete`} value={`${toDelete}`} />
		</li>
	);
};
export default TaskItemEdit;
