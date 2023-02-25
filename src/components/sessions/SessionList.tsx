import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Session, Sessions } from '../../utils/classes';
import SessionItem from './SessionItem';
import { z } from 'zod';
import { SessionCommands } from '../../utils/commands';
import useDragHandler from '../../hooks/useDragHandler';
import { ChangeTaskOrderArgs } from '../../utils/types';
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

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
    const [sessionsState, setSessions] = React.useState(sessions.sessions);
    const updateTaskOrder = (data: ChangeTaskOrderArgs) => {
        sessions.onUpdateTaskOrder(data);
    };

    const sensors = useSensors(useSensor(PointerSensor));
    const onDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!active || !over) return;
        console.log('active and over', active, over);
    };

    return (
        <Accordion.Root type="multiple">
            <DndContext
                onDragEnd={onDragEnd}
                sensors={sensors}
                collisionDetection={closestCenter}>
                <SortableContext
                    items={sessionsState}
                    strategy={verticalListSortingStrategy}>
                    {sessions.sessions.map((session, index) => (
                        <SessionItem
                            onUpdateOrder={updateTaskOrder}
                            session={session}
                            key={session.id}
                            onEdit={onEdit}
                            index={index}
                            ref={(el) => {
                                return el;
                            }}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </Accordion.Root>
    );
};
export default SessionList;
