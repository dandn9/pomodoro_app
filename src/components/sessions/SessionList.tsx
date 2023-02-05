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
};

const SessionList: React.FC<{
    sessions: Sessions;
    onEdit: (session: Session) => void;
}> = ({ sessions, onEdit }) => {
    const { setDraggable, setDroppable } = useDragHandler<
        HTMLLIElement,
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
        onDropElement({ draggableData, droppableData }) {
            // console.log('on drop!', el, dragged, dropData, dragData);
            sessions.onUpdateTaskOrder(
                droppableData.order,
                draggableData.order,
                droppableData.sessionId,
                draggableData.sessionId
            );
        },
    });

    return (
        <Accordion.Root type="multiple">
            {sessions.sessions.map((session) => (
                <SessionItem
                    setDraggable={setDraggable}
                    setDroppable={setDroppable}
                    session={session}
                    key={session.id}
                    onEdit={onEdit}
                />
            ))}
        </Accordion.Root>
    );
};
export default SessionList;
