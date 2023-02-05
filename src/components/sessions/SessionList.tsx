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
        onDragOver(el, dragged, droppableData, draggableData) {
            if (el === dragged) {
                // do nothing
            } else {
                el.classList.add('text-red-500');
            }
        },
        onDragLeave(el, _dragged, dropData, dragData) {
            console.log('drop data', dropData);
            el.classList.remove('text-red-500');
        },
        onDropElement(el, dragged, dropData, dragData) {
            console.log('on drop!', el, dragged, dropData, dragData);
            sessions.onUpdateTaskOrder(
                dropData.order,
                dragData.order,
                dropData.sessionId,
                dragData.sessionId
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
