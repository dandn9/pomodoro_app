import { Reac } from 'react'

export type TModalUpdater = boolean | ((prevState: boolean) => boolean);
export type TModalContent = React.FC<{ open: boolean; setOpen: (v: ModalUpdaterType) => void }>
export type TModalContentProps = TModalContent extends React.FunctionComponent<infer X> ? X : never