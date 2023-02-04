import { current, produceWithPatches } from 'immer';
import React, {
    PropsWithChildren,
    ReactElement,
    ReactNode,
    useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import { SessionType } from '../../utils/schemas';
import { Session, Task } from '../../utils/classTypes';
import TaskItemSession from '../tasks/TaskItemSession';
import * as Accordion from '@radix-ui/react-accordion';
import { z } from 'zod';

interface SessionItemProps {
    session: Session;
    onEdit: (session: Session) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onEdit }) => {
    const [isDraggedOver, setIsDraggedOver] = React.useState(false);
    function onEditClick(ev: React.MouseEvent) {
        ev.stopPropagation();
        onEdit(session);
    }
    function onTaskCheck(taskId: number, checked: boolean) {
        session.updateTaskDone(taskId, checked);
    }
    function onDragOver(ev: React.DragEvent) {
        ev.preventDefault();
        setIsDraggedOver(true);
    }
    function onDragLeave(ev: React.DragEvent) {
        setIsDraggedOver(false);
    }

    return (
        <Accordion.Item value={`${session.id}`}>
            <AccordionTrigger asChild>
                <div
                    className={`flex justify-between ${
                        isDraggedOver ? 'bg-slate-300' : 'bg-slate-500'
                    }`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}>
                    <h3>{session.name}</h3>
                    <div onClick={onEditClick}>EDIT</div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                {session.tasks.map((task, index) => {
                    return (
                        <TaskItemSession
                            sessionId={session.id}
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
};

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
