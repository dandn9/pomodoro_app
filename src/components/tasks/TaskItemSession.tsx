import React, { useState } from 'react';
import { Task } from '../../utils/classes';
import Checkbox from '../UI/Checkbox';

interface TaskItemSessionProps {
    task: Task;
    index: number;
    onTaskChecked: (taskId: number, checked: boolean) => void;
}

const TaskItemSession = React.forwardRef<HTMLLIElement, TaskItemSessionProps>(
    ({ index, task, onTaskChecked }, ref) => {
        return (
            <li
                className={`flex justify-between bg-slate-500 px-20
                `}
                ref={ref}>
                <div className="select-none">
                    {index} - {task.name}
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
    }
);
export default TaskItemSession;
