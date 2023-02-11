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
import { Session, Task } from '../../utils/classTypes';
import TaskItemSession from '../tasks/TaskItemSession';
import * as Accordion from '@radix-ui/react-accordion';
import { z } from 'zod';
import useDragHandler from '../../hooks/useDragHandler';
import { DragSessionTypeData } from './SessionList';

interface SessionItemProps {
    index: number;
    session: Session;
    onEdit: (session: Session) => void;
    setDroppable: (
        el: HTMLLIElement | HTMLDivElement | null,
        key: any,
        data: DragSessionTypeData
    ) => void;
    setDraggable: (
        el: HTMLLIElement | HTMLDivElement | null,
        key: any,
        data: DragSessionTypeData
    ) => void;
}

const SessionItem = React.forwardRef<HTMLDivElement, SessionItemProps>(
    ({ index, session, onEdit, setDroppable, setDraggable }, ref) => {
        function onEditClick(ev: React.MouseEvent) {
            ev.stopPropagation();
            onEdit(session);
        }
        function onTaskCheck(taskId: number, checked: boolean) {
            session.updateTaskDone(taskId, checked);
        }

        return (
            <Accordion.Item value={`${session.id}`} ref={ref}>
                <AccordionTrigger asChild>
                    <div className={`flex justify-between `}>
                        <h3>{session.name}</h3>
                        <div onClick={onEditClick}>EDIT</div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    {session.tasks.map((task, index) => {
                        return (
                            <TaskItemSession
                                ref={(el) => {
                                    setDroppable(
                                        el,
                                        `${session.id}-${task.id}`,
                                        {
                                            id: task.id,
                                            sessionId: session.id,
                                            order: index,
                                            type: 'task',
                                        }
                                    );
                                    setDraggable(
                                        el,
                                        `${session.id}-${task.id}`,
                                        {
                                            id: task.id,
                                            sessionId: session.id,
                                            order: index,
                                            type: 'task',
                                        }
                                    );
                                }}
                                index={index}
                                task={task}
                                key={task.id}
                                onTaskChecked={onTaskCheck}
                            />
                        );
                    })}
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
