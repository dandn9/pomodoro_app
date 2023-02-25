import React, { useState } from 'react';
import { Task } from '../../utils/classes';
import Checkbox from '../UI/Checkbox';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { classnames } from '../../utils/classnames';

interface TaskItemSessionProps {
    task: Task;
    index: number;
    onTaskChecked: (taskId: number, checked: boolean) => void;
}

const TaskItemSession = React.forwardRef<
    React.MutableRefObject<HTMLElement | null>,
    TaskItemSessionProps
>(({ index, task, onTaskChecked }, ref) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        node,
        // setActivatorNodeRef,
        setDraggableNodeRef,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    React.useImperativeHandle(ref, () => node, []);

    return (
        <li
            className={classnames(
                `flex h-20 justify-between border border-black bg-slate-500 px-20`,
                {
                    // ['text-red-500']: isOver,
                }
            )}
            ref={(ref) => {
                setNodeRef(ref);
                setDraggableNodeRef(ref);
                // setActivatorNodeRef(ref);
            }}
            {...listeners}
            {...attributes}
            style={style}>
            <div className="select-none">
                {task.id} - {index} - {task.name}
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
});
export default TaskItemSession;
