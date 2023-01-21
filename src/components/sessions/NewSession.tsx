import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { z } from 'zod';
import useCommands from '../../hooks/useCommands';
// component displaying a modal to create a new session

interface NewSessionProps {
	onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
	sessionName: z.string().max(20).min(1),
	tasks: z
		.string()
		.max(20)
		.array()
		.transform((arr) => arr.filter((str) => str !== '')),
});

const NewSession: React.FC<NewSessionProps> = ({ onOpenChange }) => {
	const [open, setOpen] = React.useState(false);
	const [errors, setErrors] = React.useState<
		z.ZodFormattedError<z.infer<typeof formSchema>>
	>({ _errors: [] });

	const commands = useCommands();

	function resetErrors() {
		setErrors({ _errors: [] });
	}
	function onSubmitHandler(ev: React.FormEvent<HTMLFormElement>) {
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
			commands.createSession(result.data.sessionName, '#000', result.data.tasks);
		}
		// const sessionName = z
		// 	.string()
		// 	.max(20)
		// 	.min(1)
		// 	.safeParse((element.namedItem('session-name') as HTMLInputElement).value, {});

		// console.log(sessionName);
	}

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<div className='flex justify-end max-w-xl'>
					<button className='text-white'>+</button>
				</div>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay asChild onClick={() => setOpen(false)}>
					<div className='fixed inset-0 bg-black/50 z-20 animate-[fade-in_1s_ease]' />
				</Dialog.Overlay>
				<Dialog.Content className='fixed inset-1/4 z-20 dark:text-white bg-gray-800 rounded-xl'>
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
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
export default NewSession;
