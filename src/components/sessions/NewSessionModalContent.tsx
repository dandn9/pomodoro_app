import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { z } from 'zod';
import useCommands from '../../hooks/useCommands';
import useStateStore from '../../hooks/useStateStore';
import { TModalContentProps, TModalContent } from '../../types/ModalContent';

const formSchema = z.object({
	sessionName: z.string().max(20).min(1),
	tasks: z
		.string()
		.max(20)
		.array()
		.transform((arr) => arr.filter((str) => str !== '')),
});

const SessionModalContent: TModalContent = ({ open, setOpen }) => {
	const [errors, setErrors] = React.useState<
		z.ZodFormattedError<z.infer<typeof formSchema>>
	>({ _errors: [] });
	const commands = useCommands();

	function resetErrors() {
		setErrors({ _errors: [] });
	}
	async function onSubmitHandler(ev: React.FormEvent<HTMLFormElement>) {
		ev.preventDefault();
		const formData = new FormData(ev.currentTarget);

		console.log(formData.getAll('task'));
		const result = formSchema.safeParse({
			sessionName: formData.get('sessionName'),
			tasks: formData.getAll('task'),
		});

		if (!result.success) {
			setErrors(result.error.format());
		} else {
			const newState = await commands.createSession(
				result.data.sessionName,
				'#000',
				result.data.tasks
			);
			useStateStore.getState().setStateData(newState);
			setOpen(false);
		}
	}
	return (
		<div className='fixed inset-1/4 z-20 dark:text-white bg-gray-800 rounded-xl'>
			<div className='flex justify-between p-2'>
				<Dialog.Title>Add new session</Dialog.Title>
				<Dialog.Close>X</Dialog.Close>
			</div>
			<form onSubmit={onSubmitHandler}>
				<input
					type='text'
					name='sessionName'
					className='bg-black'
					onChange={resetErrors}
				/>
				{errors.sessionName?._errors.map((error) => (
					<p className='error' key={error}>
						{error}
					</p>
				))}
				<input type='text' name='task' className='bg-black block mt-2' />
				<input type='text' name='task' className='bg-black block mt-2' />
				<input type='text' name='task' className='bg-black block mt-2' />
				<button type='submit' className='block'>
					create
				</button>
			</form>
		</div>
	);
};
export default SessionModalContent;
