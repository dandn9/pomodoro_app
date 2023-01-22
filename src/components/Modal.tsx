import React, { createContext, PropsWithChildren, ReactElement, ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { TModalUpdater, TModalContent, TModalContentProps } from '../types/ModalContent';

export const Context = createContext({ open: false });

const Modal: React.FC<
	PropsWithChildren<{ ModalContent: React.FC<TModalContentProps> }>
> = (props) => {
	const [open, _setOpen] = React.useState(false);

	function setOpen(val: TModalUpdater) {
		_setOpen(val);
	}

	function sayHello(childName: string) {
		console.log(childName);
	}

	// const child = React.forwardRef(() => props.children);
	const modalProps: TModalContentProps = {
		open,
		setOpen,
	};

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<div className='flex justify-end max-w-xl'>
					<button className='text-white'>+</button>
				</div>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay asChild onClick={() => setOpen(false)}>
					<div className='fixed inset-0 bg-black/50 z-20 animate-[fade-in_1s_ease]' />
				</Dialog.Overlay>
				{props.ModalContent(modalProps, null)}
			</Dialog.Portal>
		</Dialog.Root>
	);
};
export default Modal;
