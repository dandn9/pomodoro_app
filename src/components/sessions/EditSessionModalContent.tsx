import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { TModalContent } from '../../types/ModalContent';
const EditSessionModalContent: TModalContent = (props) => {
	return (
		<Dialog.Content className='fixed inset-1/4 z-20 dark:text-white bg-gray-800 rounded-xl'>
			<div className='flex justify-between p-2'>
				<Dialog.Title>Edit session</Dialog.Title>
				<Dialog.Close>X</Dialog.Close>
			</div>
			<form></form>
		</Dialog.Content>
	);
};
export default EditSessionModalContent;
