import React, { useState } from 'react';
import { Task } from '../../utils/classTypes';
import Checkbox from '../UI/Checkbox';

interface TaskItemSessionProps {
    task: Task;
    sessionId: number;
    index: number;
    onTaskChecked: (taskId: number, checked: boolean) => void;
}

const TaskItemSession = React.forwardRef<HTMLLIElement, TaskItemSessionProps>(
    ({ index, task, onTaskChecked, sessionId }, ref) => {
        // use a ref here to pass the element to the sessionItem component in order to drag it

        return (
            <li
                className={`flex justify-between bg-slate-500 px-20
                `}
                ref={ref}
                data-session-id={sessionId}>
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
