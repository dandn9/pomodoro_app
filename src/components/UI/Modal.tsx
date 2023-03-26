import * as Dialog from '@radix-ui/react-dialog';
import React, { useEffect } from 'react';
import {
    TModalUpdater,
    TModalContent,
    TModalContentProps,
} from '../../types/ModalContent';

interface ModalProps {
    children?: React.ReactElement;
    open: boolean;
    setOpen:
        | React.Dispatch<React.SetStateAction<boolean>>
        | ((v: boolean) => void);
}

const Modal = ({ children, open, setOpen }: ModalProps): JSX.Element => {
    useEffect(() => {
        if (open) {
            document
                .querySelector('#root')
                ?.classList.add('blur-sm', 'transition-all');
        }
        if (!open) {
            document
                .querySelector('#root')
                ?.classList.remove('blur-sm', 'transition-all');
        }
    }, [open]);
    return (
        <Dialog.Root modal open={open}>
            <Dialog.Portal>
                <Dialog.Overlay asChild onClick={() => setOpen(false)}>
                    <div className="fixed inset-0 z-20 animate-[fade-in_1s_ease] bg-black/50" />
                </Dialog.Overlay>

                <Dialog.Content className="absolute inset-0 flex items-center justify-center">
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
export default Modal;
