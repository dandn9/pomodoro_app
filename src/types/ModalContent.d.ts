import React from 'react'


export type TModalUpdater = boolean | ((prevState: boolean) => boolean);
export type TModalContent<T = {}> = React.FC<{ open?: boolean; setOpen: (v: ModalUpdaterType) => void; } & T>
export type TModalContentProps<T> = TModalContent<T> extends React.FunctionComponent<infer X> ? X : never