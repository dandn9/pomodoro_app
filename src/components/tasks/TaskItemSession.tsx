import React, { useState } from 'react';
import { Task } from '../../utils/classTypes';
import Checkbox from '../UI/Checkbox';
import { DragContext } from '../sessions/SessionList';

interface TaskItemSessionProps {
    task: Task;
    sessionId: number;
    index: number;
    onTaskChecked: (taskId: number, checked: boolean) => void;
}

const TaskItemSession = React.forwardRef<HTMLLIElement, TaskItemSessionProps>(
    ({ index, task, onTaskChecked, sessionId }, ref) => {
        // use a ref here to pass the element to the sessionItem component in order to drag it
        const [isDraggedOver, setIsDraggedOver] = useState(false);
        const dragContext = React.useContext(DragContext);

        function onDropInt(ev: React.DragEvent<HTMLLIElement>) {
            // ev.preventDefault();
            setIsDraggedOver(false);
            console.log(ev, ev.currentTarget);

            // dragContext?.onDrop(ev, liRef.current!);
        }
        function onDragLeave(ev: React.DragEvent) {
            // console.log('drag leave', liRef.current);
            setIsDraggedOver(false);
        }

        return (
            <li
                className={`flex justify-between px-20 ${
                    isDraggedOver ? 'bg-slate-500' : 'bg-slate-800'
                }`}
                ref={ref}
                onDragStart={(ev) => dragContext?.onDragStart(ev)}
                onDragEnd={dragContext?.onDragEnd}
                onDrag={dragContext?.onDrag}
                onDragLeave={onDragLeave}
                onDrop={onDropInt}
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
