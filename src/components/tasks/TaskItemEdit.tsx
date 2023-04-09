import React, { useEffect } from 'react';
import { Task } from '../../utils/classes';
import TextInput from '../UI/Input';
import Checkbox from '../UI/Checkbox';

interface TaskProps {
    task: Task;
    onDelete: (id: number) => void
}

const TaskItemEdit: React.FC<TaskProps> = ({ task, onDelete }) => {
    const inputEl = React.useRef<HTMLInputElement>(null);
    const isDraft = task.id === -1
    useEffect(() => {
        if (isDraft && inputEl.current) {
            inputEl.current.focus();
        }
    }, []);

    return (
        <li className={`flex w-full justify-between `}>
            <div>
                <TextInput
                    defaultValue={task.name}
                    ref={inputEl}
                    name={`task-name`}
                />
                - {task.id}
            </div>
            <div>
                <button
                    className="text-red-600"
                    type="button"
                    onClick={onDelete.bind(null, task.id)}>
                    DELETE
                </button>
            </div>
            <input type="hidden" name={`task-done`} value={`${task.is_done}`} />

        </li>
    );
};
export default TaskItemEdit;
