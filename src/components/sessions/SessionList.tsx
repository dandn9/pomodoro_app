import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Session, Sessions } from '../../utils/classTypes';
import SessionItem from './SessionItem';
import { z } from 'zod';
import { SessionCommands } from '../../utils/commands';

export const DragContext = React.createContext<
    | {
          onDragStart: (ev: React.DragEvent<HTMLLIElement>) => void;
          onDragEnd: (ev: React.DragEvent<HTMLLIElement>) => void;
          onDrag: (ev: React.DragEvent<HTMLLIElement>) => void;
          onDrop: (
              ev: React.DragEvent<HTMLLIElement>,
              ref: HTMLLIElement
          ) => void;
      }
    | undefined
>(undefined);

const SessionList: React.FC<{
    sessions: Sessions;
    onEdit: (session: Session) => void;
}> = ({ sessions, onEdit }) => {
    const droppableItems = React.useRef(null);
    const draggedElement = React.useRef<HTMLLIElement | null>(null);

    function onDragStart(ev: React.DragEvent<HTMLLIElement>) {
        draggedElement.current = ev.currentTarget;
    }
    function onDrop(ev: React.DragEvent<HTMLLIElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        const droppedTarget = ev.currentTarget as HTMLLIElement;
        if (
            droppedTarget &&
            droppedTarget.tagName === 'LI' &&
            draggedElement.current
        ) {
            const fromSessionId = z.coerce
                .number()
                .parse(draggedElement.current.dataset.sessionId);
            const fromOrder = z.coerce
                .number()
                .parse(draggedElement.current.dataset.order);
            const targetOrder = z.coerce
                .number()
                .parse(droppedTarget.dataset.order);
            const targetSessionId = z.coerce
                .number()
                .parse(droppedTarget.dataset.sessionId);
            if (draggedElement.current !== null) {
                sessions.onUpdateTaskOrder(
                    targetOrder,
                    fromOrder,
                    targetSessionId,
                    fromSessionId
                );
            }
        }

        draggedElement.current = null;
    }
    function onDragEnd(ev: React.DragEvent<HTMLLIElement>) {}

    function onDrag(ev: React.DragEvent<HTMLLIElement>) {
        // console.log('drag !', ev);
    }

    return (
        <Accordion.Root type="multiple">
            <DragContext.Provider
                value={{ onDrag, onDrop, onDragStart, onDragEnd }}>
                {sessions.sessions.map((session) => (
                    <SessionItem
                        session={session}
                        key={session.id}
                        onEdit={onEdit}
                    />
                ))}
            </DragContext.Provider>
        </Accordion.Root>
    );
};
export default SessionList;
