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
    const [tempSessions, setTempSessions] = useState(stateSessions.sessions);
    const sessionsId = tempSessions.map(
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
                    const session = tempSessions.find(
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
        [tempSessions, activeId]
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
                    const getTargetInfo = (id: UniqueIdentifier) => {
                        let taskIndex = -1;
                        let containerIndex = sessionsId.indexOf(id);
                        if (containerIndex !== -1) {
                            return {
                                containerId: id,
                                containerIndex,
                                taskIndex,
                            };
                        } else {
                            containerIndex = tempSessions.findIndex(
                                (session) => {
                                    const taskIdx = session.tasks.findIndex(
                                        (task) => `task-${task.id}` === id
                                    );
                                    if (taskIdx !== -1) {
                                        console.log('found task', id);
                                        taskIndex = taskIdx;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            );
                            if (containerIndex === -1) return undefined;
                            return {
                                containerIndex,
                                taskIndex,
                                containerId: `sess-${tempSessions[containerIndex].id}`,
                            };
                        }
                    };
                    const findSession = (id: UniqueIdentifier) => {
                        return tempSessions.find(
                            (session) => `sess-${session.id}` === id
                        );
                    };
                    const overId = over?.id;
                    if (overId == null || sessionsId.includes(active.id)) {
                        console.log('return early');
                        return;
                    }
                    const overInfo = getTargetInfo(overId);
                    const activeInfo = getTargetInfo(active.id);
                    console.log(
                        'over container e active',
                        overInfo,
                        activeInfo
                    );

                    if (!overInfo || !activeInfo) return;

                    if (activeInfo !== overInfo) {
                        setTempSessions((items) => {
                            const activeSession = findSession(
                                activeInfo.containerId
                            );
                            const overSession = findSession(
                                overInfo.containerId
                            );
                            if (!overSession || !activeSession) return items;
                            if (
                                !accordionValue.includes(
                                    overSession.id.toString()
                                )
                            ) {
                                // open the over accordion
                                setAccordionValue((val) => [
                                    ...val,
                                    overSession.id.toString(),
                                ]);
                            }

                            const activeItems = activeSession.tasks;
                            const overItems = overSession.tasks;

                            const overIndex = overInfo.taskIndex;
                            const activeIndex = activeInfo.taskIndex;
                            const activeContainerIndex =
                                activeInfo.containerIndex;
                            const overContainerIndex = overInfo.containerIndex;
                            console.log(
                                'infos',
                                overContainerIndex,
                                activeContainerIndex,
                                overIndex,
                                activeIndex,
                                tempSessions
                            );

                            let newIndex: number;
                            if (
                                overInfo.containerIndex >= 0 &&
                                overInfo.taskIndex === -1
                            ) {
                                // we're over a container
                                newIndex = overItems.length + 1;
                            } else {
                                const isBelowOverItem =
                                    over &&
                                    active.rect.current.translated &&
                                    active.rect.current.translated.top >
                                        over.rect.top + over.rect.height;

                                const modifier = isBelowOverItem ? 1 : 0;

                                newIndex =
                                    overIndex >= 0
                                        ? overIndex + modifier
                                        : overItems.length + 1;
                            }
                            console.log('new index!', newIndex);

                            recentlyMovedToNewContainer.current = true;

                            const newState = produce(items, (draft) => {
                                const newElem = draft[
                                    activeContainerIndex
                                ].tasks.splice(activeIndex, 1);
                                draft[overContainerIndex].tasks = [
                                    ...draft[overContainerIndex].tasks.slice(
                                        0,
                                        newIndex
                                    ),
                                    newElem[0],
                                    ...draft[overContainerIndex].tasks.slice(
                                        newIndex
                                    ),
                                ];
                            });
                            return newState;
                        });
                    }
                }}>
                <SortableContext
                    items={sessionsId}
                    strategy={verticalListSortingStrategy}>
                    {tempSessions.map((session, index) => (
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
        const session = tempSessions.find(
            (session) => `sess-${session.id}` === id
        );
        if (!session) return undefined;
        return <SessionItem session={session} id={id}></SessionItem>;
    }
    function renderTask(id: UniqueIdentifier) {
        const tasks = tempSessions.flatMap((session) => session.tasks);
        const task = tasks.find((task) => `task-${task.id}` === id);
        if (!task) return undefined;

        return <TaskItemSession task={task} id={id}></TaskItemSession>;
    }
};
export default SessionList;
