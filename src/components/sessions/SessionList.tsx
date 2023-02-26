import React, { useCallback, useRef, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Session, Sessions } from '../../utils/classes';
import SessionItem from './SessionItem';
import { z } from 'zod';
import { SessionCommands } from '../../utils/commands';
import useDragHandler from '../../hooks/useDragHandler';
import { ChangeTaskOrderArgs } from '../../utils/types';
import {
    CollisionDetection,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DropAnimation,
    PointerSensor,
    UniqueIdentifier,
    closestCenter,
    defaultDropAnimationSideEffects,
    getFirstCollision,
    pointerWithin,
    rectIntersection,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import TaskItemSession from '../tasks/TaskItemSession';
import produce from 'immer';

export type DragSessionTypeData = {
    id: number;
    sessionId: number;
    order: number;
    type: 'task' | 'session';
};
const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

function getSessionsId(sessions: Session[]) {
    return sessions.map((session) => session.id) as UniqueIdentifier[];
}

const SessionList: React.FC<{
    sessions: Sessions;
    onEdit: (session: Session) => void;
}> = ({ sessions: stateSessions, onEdit }) => {
    const [sessions, setSessions] = useState(stateSessions.sessions);
    const sessionsId = sessions.map(
        (session) => `sess-${session.id}`
    ) as UniqueIdentifier[];
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [accordionValue, setAccordionValue] = useState<string[]>([]);
    const lastOverId = useRef<UniqueIdentifier | null>(null);
    const recentlyMovedToNewContainer = useRef(false);
    const updateTaskOrder = (data: ChangeTaskOrderArgs) => {
        // sessions.onUpdateTaskOrder(data);
    };

    const sensors = useSensors(useSensor(PointerSensor));
    const onDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!active || !over) return;
        console.log('active and over', active, over);
    };

    console.log('accordion', accordionValue);
    const collisionDetectionStrategy: CollisionDetection = useCallback(
        (args) => {
            if (activeId && activeId in sessionsId) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => container.id in sessionsId
                    ),
                });
            }

            const pointerIntersection = pointerWithin(args);
            const intersections =
                pointerIntersection.length > 0
                    ? pointerIntersection
                    : rectIntersection(args);

            let overId = getFirstCollision(intersections, 'id');
            if (overId != null) {
                if (overId in sessionsId) {
                    const session = sessions.find(
                        (session) => session.id === overId
                    );
                    const containerItemsIds = session?.tasks.map(
                        (item) => item.id as UniqueIdentifier
                    );
                    if (containerItemsIds && containerItemsIds.length > 0) {
                        overId = closestCenter({
                            ...args,
                            droppableContainers:
                                args.droppableContainers.filter(
                                    (container) =>
                                        container.id !== overId &&
                                        containerItemsIds.includes(container.id)
                                ),
                        })[0]?.id;
                    }
                }

                lastOverId.current = overId;
                return [{ id: overId }];
            }

            // When a draggable item moves to a new container, the layout may shift
            // and the `overId` may become `null`. We manually set the cached `lastOverId`
            // to the id of the draggable item that was moved to the new container, otherwise
            // the previous `overId` will be returned which can cause items to incorrectly shift positions
            if (recentlyMovedToNewContainer.current) {
                lastOverId.current = activeId;
            }

            return lastOverId.current ? [{ id: lastOverId.current }] : [];
        },
        [sessions, activeId]
    );

    return (
        <Accordion.Root
            type="multiple"
            onValueChange={(val) => setAccordionValue(val)}
            value={accordionValue}>
            <DndContext
                onDragEnd={onDragEnd}
                sensors={sensors}
                collisionDetection={collisionDetectionStrategy}
                onDragStart={({ active }) => {
                    setActiveId(active.id);
                }}
                onDragOver={({ active, over }) => {
                    const findContainer = (id: UniqueIdentifier) => {
                        console.log('over', over, 'searrching', id, sessionsId);
                        if (sessionsId.includes(id)) {
                            console.log('is in');
                            return id;
                        }

                        const session = sessions.find((session) => {
                            const hasTask = session.tasks.find(
                                (task) => `task-${task.id}` === id
                            );
                            return !!hasTask;
                        });
                        if (!session) return undefined;
                        return `sess-${session?.id}` as UniqueIdentifier;
                    };
                    const findSession = (id: UniqueIdentifier) => {
                        return sessions.find(
                            (session) => `sess-${session.id}` === id
                        );
                    };
                    const overId = over?.id;
                    if (overId == null || active.id in sessionsId) {
                        return;
                    }
                    const overContainer = findContainer(overId);
                    const activeContainer = findContainer(active.id);
                    console.log(
                        'over container e active',
                        overContainer,
                        activeContainer
                    );

                    if (!overContainer || !activeContainer) return;

                    if (activeContainer !== overContainer) {
                        setSessions((items) => {
                            const activeItems =
                                findSession(activeContainer)?.tasks;
                            const overSession = findSession(overContainer);
                            if (
                                !accordionValue.includes(
                                    overSession!.id.toString()
                                )
                            ) {
                                setAccordionValue((val) => [
                                    ...val,
                                    overSession!.id.toString(),
                                ]);
                            }
                            const overItems = overSession?.tasks;
                            const overIndex = overItems?.findIndex(
                                (item) => `task-${item.id}` === overId
                            );
                            const activeIndex = activeItems?.findIndex(
                                (item) => `task-${item.id}` === active.id
                            );
                            const activeContainerIndex = items.findIndex(
                                (sess) => `sess-${sess.id}` === activeContainer
                            );
                            const overContainerIndex = items.findIndex(
                                (sess) => `sess-${sess.id}` === overContainer
                            );
                            if (
                                activeIndex === -1 ||
                                activeContainerIndex === -1 ||
                                overContainerIndex === -1
                            ) {
                                console.log(
                                    'exiting',
                                    activeIndex,
                                    activeContainerIndex,
                                    overContainerIndex
                                );
                                return items;
                            }

                            let newIndex: number;
                            if (overId in sessionsId && overItems) {
                                newIndex = overItems.length + 1;
                            } else {
                                console.log(
                                    'over',
                                    over,
                                    active,
                                    activeContainer,
                                    overContainer
                                );
                                const isBelowOverItem =
                                    over &&
                                    active.rect.current.translated &&
                                    active.rect.current.translated.top >
                                        over.rect.top + over.rect.height;

                                const modifier = isBelowOverItem ? 1 : 0;

                                newIndex =
                                    overIndex! >= 0
                                        ? overIndex! + modifier
                                        : overItems!.length + 1;
                            }

                            recentlyMovedToNewContainer.current = true;
                            console.log('prev state', items);

                            const newState = produce(items, (draft) => {
                                draft[overContainerIndex].tasks = [
                                    ...draft[overContainerIndex].tasks.slice(
                                        0,
                                        newIndex
                                    ),
                                    draft[activeContainerIndex].tasks[
                                        activeIndex!
                                    ],
                                    ...draft[overContainerIndex].tasks.slice(
                                        newIndex
                                    ),
                                ];
                                draft[activeContainerIndex].tasks.splice(
                                    activeIndex!,
                                    1
                                );
                            });
                            console.log('new state!', newState);
                            return newState;

                            return items;
                        });
                    }
                }}>
                <SortableContext
                    items={sessionsId}
                    strategy={verticalListSortingStrategy}>
                    {sessions.map((session, index) => (
                        <SessionItem
                            onUpdateOrder={updateTaskOrder}
                            session={session}
                            key={session.id}
                            id={sessionsId[index]}
                            onEdit={onEdit}
                            index={index}
                            ref={(el) => {
                                return el;
                            }}
                        />
                    ))}
                </SortableContext>
                {createPortal(
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeId
                            ? sessionsId.includes(activeId)
                                ? renderSession(activeId)
                                : renderTask(activeId)
                            : undefined}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </Accordion.Root>
    );
    function renderSession(id: UniqueIdentifier) {
        const session = sessions.find((session) => `sess-${session.id}` === id);
        if (!session) return undefined;
        return <SessionItem session={session} id={id}></SessionItem>;
    }
    function renderTask(id: UniqueIdentifier) {
        const tasks = sessions.flatMap((session) => session.tasks);
        const task = tasks.find((task) => `task-${task.id}` === id);
        if (!task) return undefined;

        return <TaskItemSession task={task} id={id}></TaskItemSession>;
    }
};
export default SessionList;
