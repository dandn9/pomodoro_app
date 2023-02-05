import React, { useCallback } from 'react';
import produce from 'immer';

type OptionalDragging = { is_dragging?: boolean };

type DroppableEvent<D, T, G, P> = {
    target: D;
    draggedEl: T;
    droppableData: G;
    draggableData: P & OptionalDragging & { el: T; listeners: {} }; // cba typing these
    event: DragEvent;
};

interface useDragHandlerArgs<
    D extends HTMLElement,
    T extends HTMLElement,
    G extends {} = any,
    P extends {} = any
> {
    onDropElement?: (data: DroppableEvent<D, T, G, P>) => void;
    onDragOver?: (data: DroppableEvent<D, T, G, P>) => void;
    onDragLeave?: (data: DroppableEvent<D, T, G, P>) => void;
}

/**
 *
 * @param D typeof the draggable Element
 * @param T typeof the droppable Element
 * @param G typeof meta-data for  Droppable Element
 * @param P typeof meta-data for Draggable
 * @returns
 */
const useDragHandler = <
    D extends HTMLElement,
    G extends {} = any,
    T extends HTMLElement = D,
    P extends {} = G
>({
    onDropElement,
    onDragOver,
    onDragLeave,
}: useDragHandlerArgs<D, T, G, P>) => {
    const currentDrag = React.useRef<{ el: T; key: number } | null>(null);

    const droppableMap = React.useRef(
        new Map<
            number,
            G & {
                el: D;
                listeners: {
                    dragLeave: (e: DragEvent) => void;
                    dragOver: (e: DragEvent) => void;
                    drop: (e: DragEvent) => void;
                };
            }
        >()
    );
    const setDroppable = useCallback((el: D | null, key: number, data: G) => {
        if (el) {
            const dragLeaveHandler = (e: DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (onDragLeave && el) {
                    console.log('on drag leave');
                    onDragLeave({
                        target: el,
                        draggedEl: currentDrag.current!.el,
                        droppableData: droppableMap.current.get(key)!,
                        draggableData: draggableMap.current.get(
                            currentDrag!.current!.key
                        )!,
                        event: e,
                    });
                }
            };
            const dragOverHandler = (e: DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (onDragOver) {
                    onDragOver({
                        target: el,
                        draggedEl: currentDrag.current!.el,
                        droppableData: droppableMap.current.get(key)!,
                        draggableData: draggableMap.current.get(
                            currentDrag!.current!.key
                        )!,
                        event: e,
                    });
                }
            };
            const dropHandler = (e: DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (onDropElement) {
                    onDropElement({
                        target: el,
                        draggedEl: currentDrag.current!.el,
                        droppableData: droppableMap.current.get(key)!,
                        draggableData: draggableMap.current.get(
                            currentDrag!.current!.key
                        )!,
                        event: e,
                    });
                }
            };
            // is mounting
            droppableMap.current.set(key, {
                el,
                ...data,
                listeners: {
                    dragLeave: dragLeaveHandler,
                    dragOver: dragOverHandler,
                    drop: dropHandler,
                },
            });

            const listeners = droppableMap.current.get(key)!.listeners;
            el.addEventListener('dragover', listeners.dragOver);
            el.addEventListener('dragleave', listeners.dragLeave);
            el.addEventListener('drop', listeners.drop);
        } else {
            // is unmounting

            const ob = droppableMap.current.get(key)!;
            ob.el.removeEventListener('dragleave', ob.listeners.dragLeave);
            ob.el.removeEventListener('dragover', ob.listeners.dragOver);
            ob.el.removeEventListener('drop', ob.listeners.drop);

            droppableMap.current.delete(key);
        }
    }, []);

    const draggableMap = React.useRef(
        new Map<
            number,
            P &
                OptionalDragging & {
                    el: T;
                    listeners: {
                        dragStart: (e: DragEvent) => void;
                        dragEnd: (e: DragEvent) => void;
                    };
                }
        >()
    );

    const setDraggable = useCallback((el: T | null, key: number, data: P) => {
        if (el) {
            const dragStartHandler = (e: DragEvent) => {
                currentDrag.current = { el, key };
                const currData = draggableMap.current.get(key)!;
                draggableMap.current.set(key, {
                    ...currData,
                    is_dragging: true,
                });
            };
            const dragEndHandler = (e: DragEvent) => {
                const currData = draggableMap.current.get(key)!;
                draggableMap.current.set(key, {
                    ...currData,
                    is_dragging: false,
                });
            };

            el.draggable = true;
            draggableMap.current.set(key, {
                el,
                ...data,
                listeners: {
                    dragEnd: dragEndHandler,
                    dragStart: dragStartHandler,
                },
            });

            const listeners = draggableMap.current.get(key)!.listeners;
            el.addEventListener('dragstart', listeners.dragStart);
            el.addEventListener('dragend', listeners.dragEnd);
        } else {
            if (draggableMap.current.get(key)?.is_dragging) {
                currentDrag.current = null;
            }
            const ob = draggableMap.current.get(key)!;
            ob.el.removeEventListener('dragstart', ob.listeners.dragStart);
            ob.el.removeEventListener('dragend', ob.listeners.dragEnd);

            draggableMap.current.delete(key);
        }
    }, []);

    // cleanup effect
    React.useEffect(() => {
        const x = (e: KeyboardEvent) => {
            if (e.key === 'F') {
                console.log(
                    'drag state - droppable - draggable',
                    droppableMap,
                    draggableMap
                );
            }
        };
        window.addEventListener('keyup', x);
        return () => {
            window.removeEventListener('keyup', x);

            draggableMap.current.forEach((entry) => {
                entry.el.removeEventListener(
                    'dragstart',
                    entry.listeners.dragStart
                );
                entry.el.removeEventListener(
                    'dragend',
                    entry.listeners.dragEnd
                );
            });
            droppableMap.current.forEach((entry) => {
                entry.el.removeEventListener(
                    'dragleave',
                    entry.listeners.dragLeave
                );
                entry.el.removeEventListener(
                    'dragover',
                    entry.listeners.dragOver
                );
                entry.el.removeEventListener('drop', entry.listeners.drop);
            });
        };
    }, []);

    return {
        setDroppable,
        setDraggable,
    };
};
export default useDragHandler;
