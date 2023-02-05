import React from 'react';
import produce from 'immer';

interface useDragHandlerArgs<
    D extends HTMLElement,
    T extends HTMLElement = any
> {
    // droppableElements: D[];
    // draggableElements: T[];
    onDropElement?: (target: D, draggedEl: T) => void;
    onDragOver?: (target: D, draggedEl: T) => void;
    onDragLeave?: (target: D, draggedEl: T) => void;
}

// interface DragState<D, T> {
//     draggedEl?: T;
//     droppableEls: D[];
//     isDragging: boolean;
// }

const useDragHandler = <D extends HTMLElement, T extends HTMLElement>({
    onDropElement,
    onDragOver,
    onDragLeave,
}: useDragHandlerArgs<D>) => {
    console.log('use drag handler call');
    const currentDrag = React.useRef<T | null>(null);

    const draggableRefs = React.useRef<T[]>([]);

    const dragProxy = new Proxy(draggableRefs, {
        set(target, prop, val: T) {
            if (prop in target && prop == 'current') {
                if (val) {
                    // is mounting
                    val.draggable = true;
                    val.addEventListener('dragstart', () => {
                        currentDrag.current = val;
                    });
                    val.addEventListener('dragend', () => {
                        currentDrag.current = null;
                    });
                    target[prop].push(val);
                } else {
                    // is unmounting
                    target[prop].shift();
                }
            }
            return true;
        },
    }) as any as React.MutableRefObject<T | null>;

    const droppableRefs = React.useRef<D[]>([]);
    const dropProxy = new Proxy(droppableRefs, {
        set(target, prop, val: D) {
            console.log('setting!', target, prop, val);
            if (prop in target && prop == 'current') {
                if (val) {
                    // is mounting
                    val.addEventListener('dragover', () => {
                        if (onDragOver) {
                            onDragOver(val, currentDrag.current!);
                        }
                    });
                    val.addEventListener('dragleave', () => {
                        if (onDragLeave) {
                            onDragLeave(val, currentDrag.current!);
                        }
                    });
                    target[prop].push(val);
                } else {
                    // is unmounting
                    target[prop].shift();
                }
            }
            return true;
        },
    }) as any as React.MutableRefObject<D | null>;
    React.useEffect(() => {
        window.addEventListener('keyup', (e) => {
            if (e.key === 'F') {
                console.log(
                    'drag state',
                    dropProxy,
                    dragProxy,
                    draggableRefs,
                    droppableRefs
                );
            }
        });
    }, []);

    console.log('droppable refs', droppableRefs);
    // const [state, setState] = React.useState<DragState<D, T>>({
    //     isDragging: false,
    //     draggedEl: undefined,
    //     droppableEls: droppableElements,
    // });
    // console.log('droppables _', draggableElements);

    // draggableElements.forEach((el) => {
    //     el.draggable = true;
    //     el.setAttribute('id', 'vv');
    //     el.addEventListener('dragstart', (_e) => {
    //         setState((prev) =>
    //             produce(prev, (draft) => {
    //                 draft.isDragging = true;
    //                 draft.draggedEl = el as any; // weird typescript bug
    //             })
    //         );
    //     });
    // });
    // // droppableElements.forEach((el, index) => {
    // //     el.addEventListener('drop', onDropElement.bind(null, el, index));
    // // });

    // // const dragRef = React.useRef(draggedElement);
    // return state;

    // dragRef.current.addEventListener('');

    return {
        dropProxy,
        dragProxy,
        currentDrag,
        droppableRefs,
        draggableRefs,
    };
};
export default useDragHandler;
