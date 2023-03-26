import React, { useState } from 'react';
import { Task } from '../../utils/classes';
import Checkbox from '../UI/Checkbox';
import { UniqueIdentifier, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
    AnimateLayoutChanges,
    defaultAnimateLayoutChanges,
    useSortable,
} from '@dnd-kit/sortable';
import { classnames } from '../../utils/classnames';

interface TaskItemSessionProps {
    task: Task;
    index?: number;
    onTaskChecked?: (taskId: number, checked: boolean) => void;
    id: UniqueIdentifier;
}
const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const TaskItemSession = React.forwardRef<
    React.MutableRefObject<HTMLElement | null>,
    TaskItemSessionProps
>(({ index, task, onTaskChecked, id }, ref) => {
    const {
        setNodeRef,
        setActivatorNodeRef,
        listeners,
        isDragging,
        isSorting,
        over,
        overIndex,
        transform,
        transition,
    } = useSortable({
        id,
        animateLayoutChanges,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            className={classnames(
                `flex h-20 justify-between border border-black bg-slate-500 px-20`,
                {
                    // ['text-red-500']: isOver,
                }
            )}
            ref={setNodeRef}
            {...listeners}
            style={style}>
            <div className="select-none">
                {task.id} - {index} - {task.name}
            </div>
            <div>
                <Checkbox
                    defaultChecked={task.is_done}
                    onCheckedChange={(checked) => {
                        onTaskChecked?.(task.id, !!checked);
                    }}
                />
            </div>
        </li>
    );
});
export default TaskItemSession;
