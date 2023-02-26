import { current, produceWithPatches } from 'immer';
import React, {
    PropsWithChildren,
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
} from 'react';
import ReactDOM from 'react-dom';
import { SessionType } from '../../utils/schemas';
import { Session, Task } from '../../utils/classes';
import TaskItemSession from '../tasks/TaskItemSession';
import * as Accordion from '@radix-ui/react-accordion';
import { z } from 'zod';
import useDragHandler from '../../hooks/useDragHandler';
import { DragSessionTypeData } from './SessionList';
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    UniqueIdentifier,
    closestCenter,
    useDndContext,
    useDndMonitor,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChangeTaskOrderArgs } from '../../utils/types';

interface SessionItemProps {
    index?: number;
    session: Session;
    id: UniqueIdentifier;
    onEdit?: (session: Session) => void;
    onUpdateOrder?: (data: ChangeTaskOrderArgs) => void;
}

const SessionItem = React.forwardRef<HTMLDivElement, SessionItemProps>(
    ({ index, session, onEdit, onUpdateOrder, id }, ref) => {
        const sessionRef = useRef<HTMLDivElement>(null);
        function onEditClick(ev: React.MouseEvent) {
            ev.stopPropagation();
            onEdit?.(session);
        }

        function onTaskCheck(taskId: number, checked: boolean) {
            session.updateTaskDone(taskId, checked);
        }
        const {
            active,
            attributes,
            isDragging,
            listeners,
            over,
            setNodeRef,
            transition,
            transform,
        } = useSortable({
            id,
            data: { type: 'session', children: session.tasks },
        });
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : undefined,
        };

        const taskIds = session.tasks.map(
            (task) => `task-${task.id}` as UniqueIdentifier
        );

        // console.log('new items', items);
        return (
            <Accordion.Item
                value={`${session.id}`}
                ref={setNodeRef}
                style={style}
                onClick={() => {
                    console.log('click');
                }}>
                <div>
                    <AccordionTrigger asChild>
                        <div className={`flex justify-between `}>
                            <h3>{session.id}</h3>
                            <h3>{session.name}</h3>
                            <div onClick={onEditClick}>EDIT</div>

                            <div
                                className="h-5 w-5 rounded-full bg-green-400"
                                {...attributes}
                                {...listeners}>
                                H
                            </div>
                        </div>
                    </AccordionTrigger>
                </div>
                <AccordionContent>
                    <SortableContext items={taskIds}>
                        {session.tasks.map((task, index) => {
                            return (
                                <TaskItemSession
                                    ref={(el) => {
                                        return el;
                                    }}
                                    id={taskIds[index]}
                                    index={index}
                                    task={task}
                                    key={task.id}
                                    onTaskChecked={onTaskCheck}
                                />
                            );
                        })}
                    </SortableContext>
                </AccordionContent>
            </Accordion.Item>
        );
    }
);

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    Accordion.AccordionTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Trigger
        className={`w-full bg-gray-700 ${className}`}
        {...props}
        ref={forwardedRef}>
        {children}
    </Accordion.Trigger>
));

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    Accordion.AccordionContentProps
>(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
        asChild
        className={`bg-blue-400 ${className}`}
        {...props}
        ref={forwardedRef}>
        <ul className="tasks-container">{children}</ul>
    </Accordion.Content>
));

export default SessionItem;

// const P = () => {
// 	return <X>{(f) => <div>{f}</div>}</X>;
// };
