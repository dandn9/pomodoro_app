import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Session, Sessions } from '../../utils/classTypes';
import SessionItem from './SessionItem';
import { z } from 'zod';
import { SessionCommands } from '../../utils/commands';
import useDragHandler from '../../hooks/useDragHandler';

export type DragSessionTypeData = {
    id: number;
    sessionId: number;
    order: number;
    type: 'task' | 'session';
};

const SessionList: React.FC<{
    sessions: Sessions;
    onEdit: (session: Session) => void;
}> = ({ sessions, onEdit }) => {
    console.log('session list render');
    const { setDraggable, setDroppable } = useDragHandler<
        HTMLLIElement | HTMLDivElement,
        DragSessionTypeData
    >({
        onDragOver({ target, draggedEl }) {
            if (target === draggedEl) {
                // do nothing
            } else {
                target.classList.add('text-red-500');
            }
        },
        onDragLeave({ target, droppableData }) {
            console.log('drop data', droppableData);
            target.classList.remove('text-red-500');
        },
        onDropElement({ draggableData, droppableData, draggedEl, target }) {
            // console.log('on drop!', el, dragged, dropData, dragData);
            console.log('sessions!', sessions);
            if (
                droppableData.type === 'session' &&
                draggableData.type === 'task'
            ) {
                // we're dropping a task on a session
                sessions.onUpdateTaskOrder(
                    sessions.sessions[droppableData.order].tasks.length,
                    draggableData.order,
                    droppableData.sessionId,
                    draggableData.sessionId
                );
            }
            if (
                droppableData.type === 'task' &&
                draggableData.type === 'task'
            ) {
                // we're dropping a task on another task
                sessions.onUpdateTaskOrder(
                    droppableData.order,
                    draggableData.order,
                    droppableData.sessionId,
                    draggableData.sessionId
                );
            }
        },
    });

    return (
        <Accordion.Root type="multiple">
            {sessions.sessions.map((session, index) => (
                <SessionItem
                    session={session}
                    setDraggable={setDraggable}
                    setDroppable={setDroppable}
                    key={session.id}
                    onEdit={onEdit}
                    index={index}
                />
            ))}
        </Accordion.Root>
    );
};
export default SessionList;
