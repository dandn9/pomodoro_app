import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Session, Sessions } from '../../utils/classes';
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
        onDropElement({
            draggableData,
            droppableData,
            draggedEl,
            target,
            event,
        }) {
            console.log('event', event);
            console.log(
                'on drop!',
                draggableData,
                droppableData,
                draggedEl,
                target
            );
            if (
                droppableData.type === 'session' &&
                draggableData.type === 'session'
            ) {
                sessions.onUpdateSessionOrder({
                    fromOrder: draggableData.order,
                    targetOrder: droppableData.order,
                });
            }
            if (
                droppableData.type === 'session' &&
                draggableData.type === 'task'
            ) {
                // we're dropping a task on a session
                sessions.onUpdateTaskOrder({
                    fromOrder: draggableData.order,
                    targetOrder:
                        sessions.sessions[droppableData.order].tasks.length,
                    sessionIdFrom: draggableData.sessionId,
                    sessionIdTarget: droppableData.sessionId,
                });
            }
            if (
                droppableData.type === 'task' &&
                draggableData.type === 'task'
            ) {
                // we're dropping a task on another task
                sessions.onUpdateTaskOrder({
                    targetOrder: droppableData.order,
                    fromOrder: draggableData.order,
                    sessionIdTarget: droppableData.sessionId,
                    sessionIdFrom: draggableData.sessionId,
                });
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
                    ref={(el) => {
                        console.log('ref from session', el);
                        setDroppable(el, session.id, {
                            id: session.id,
                            sessionId: session.id,
                            order: index,
                            type: 'session',
                        });
                        setDraggable(el, session.id, {
                            id: session.id,
                            sessionId: session.id,
                            order: index,
                            type: 'session',
                        });
                    }}
                />
            ))}
        </Accordion.Root>
    );
};
export default SessionList;
