import React, { useCallback } from 'react';
import produce from 'immer';

type OptionalDragging = { is_dragging?: boolean };

interface useDragHandlerArgs<
    D extends HTMLElement,
    T extends HTMLElement,
    G extends {} = any,
    P extends {} = any
> {
    onDropElement?: (
        target: D,
        draggedEl: T,
        droppableData: G,
        draggableData: P
    ) => void;
    onDragOver?: (
        target: D,
        draggedEl: T,
        droppableData: G,
        draggableData: P & OptionalDragging
    ) => void;
    onDragLeave?: (
        target: D,
        draggedEl: T,
        droppableData: G,
        draggableData: P
    ) => void;
    // draggedProp: () => void;
    // droppedProp: () => void;
}

// interface DragState<D, T> {
//     draggedEl?: T;
//     droppableEls: D[];
//     isDragging: boolean;
// }
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
    console.log('use drag handler render');
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
                    onDragLeave(
                        el,
                        currentDrag.current!.el,
                        droppableMap.current.get(key)!,
                        draggableMap.current.get(currentDrag!.current!.key)!
                    );
                }
            };
            const dragOverHandler = (e: DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (onDragOver) {
                    onDragOver(
                        el,
                        currentDrag.current!.el,
                        droppableMap.current.get(key)!,
                        draggableMap.current.get(currentDrag!.current!.key)!
                    );
                }
            };
            const dropHandler = (e: DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (onDropElement) {
                    onDropElement(
                        el,
                        currentDrag.current!.el,
                        droppableMap.current.get(key)!,
                        draggableMap.current.get(currentDrag!.current!.key)!
                    );
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

    // const droppableRefs = React.useRef<D | null>();
    // const dropProxy = new Proxy(droppableRefs, {
    //     set(target, prop, val: D) {
    //         console.log('setting!', target, prop, val);
    //         if (prop in target && prop == 'current') {
    //             if (val) {
    //                 // is mounting
    //                 val.addEventListener('dragover', () => {
    //                     if (onDragOver) {
    //                         onDragOver(val, currentDrag.current!);
    //                     }
    //                 });
    //                 val.addEventListener('dragleave', () => {
    //                     if (onDragLeave) {
    //                         onDragLeave(val, currentDrag.current!);
    //                     }
    //                 });
    //                 val.addEventListener('drop', () => {
    //                     if (onDropElement) {
    //                         onDropElement(val, currentDrag.current!);
    //                     }
    //                 });
    //             } else {
    //                 // is unmounting
    //                 droppableRefs.current = null;
    //             }
    //         }
    //         return true;
    //     },
    // }) as any as React.MutableRefObject<D | null>;
    React.useEffect(() => {
        console.log('use Drag handler');
        return () => {
            console.log('clean up Drag Handler');
        };
    }, []);
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
        };
    }, []);

    return {
        // dropProxy,
        setDroppable,
        setDraggable,
    };
};
export default useDragHandler;
