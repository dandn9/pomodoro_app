import React, { createContext, PropsWithChildren, ReactElement, ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { TModalUpdater, TModalContent, TModalContentProps } from '../types/ModalContent';

export const Context = createContext({ open: false });

interface ModalProps {
	children?: ReactElement;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>> | ((v: boolean) => void);
}

const Modal = ({ children, open, setOpen }: ModalProps): JSX.Element => {
	return (
		<Dialog.Root open={open} modal>
			<Dialog.Portal>
				<Dialog.Overlay asChild onClick={() => setOpen(false)}>
					<div className='fixed inset-0 bg-black/50 z-20 animate-[fade-in_1s_ease]' />
				</Dialog.Overlay>
				{children}
			</Dialog.Portal>
		</Dialog.Root>
	);
};
export default Modal;
