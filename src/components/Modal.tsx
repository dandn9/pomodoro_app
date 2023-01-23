import React, { createContext, PropsWithChildren, ReactElement, ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { TModalUpdater, TModalContent, TModalContentProps } from '../types/ModalContent';

export const Context = createContext({ open: false });

interface ModalProps {
	children?: (openUpdater: (val: boolean) => void) => ReactElement;
	ModalContent: React.FC<TModalContentProps>;
}

const Modal: React.FC<ModalProps> = ({ children, ModalContent }) => {
	const [open, _setOpen] = React.useState(false);

	function setOpen(val: TModalUpdater) {
		_setOpen(val);
	}

	const modalProps: TModalContentProps = {
		open,
		setOpen,
	};

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{children && children(setOpen)}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay asChild onClick={() => setOpen(false)}>
					<div className='fixed inset-0 bg-black/50 z-20 animate-[fade-in_1s_ease]' />
				</Dialog.Overlay>
				{ModalContent(modalProps, null)}
			</Dialog.Portal>
		</Dialog.Root>
	);
};
export default Modal;