import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { TModalContent } from '../../types/ModalContent';
import useStateStore from '../../hooks/useStateStore';
import Input from '../UI/TextInput';
import Switch from '../UI/Switch';
import TaskItemEdit from '../tasks/TaskItemEdit';
import Popover from '../UI/Popover';
import produce from 'immer';
import { Session, Task } from '../../utils/classTypes';
import { Writable } from '../../utils/utilityTypes';
import { z } from 'zod';

export const formSchema = z.object({
	name: z.string(),
	color: z.string(),
	is_selected: z.literal('on').optional(),
	tasks: z
		.object({
			name: z.string().min(1).max(30),
			is_done: z.boolean(),
			id: z.coerce.number(),
			order: z.coerce.number(),
		})
		.array(),
});
export type editFormType = z.infer<typeof formSchema>;

const EditSessionModalContent: TModalContent<{
	session?: Session;
	onEditClose: () => void;
}> = ({ onEditClose, session, setOpen, open }) => {
	if (!session) {
		return <div>Couldn't load the session</div>;
	}
	const allSessions = useStateStore((state) => state.getSessions());
	const [errors, setErrors] = React.useState<
		z.ZodFormattedError<z.infer<typeof formSchema>>
	>({ _errors: [] });
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [sessionDraft, setSessionDraft] = useState(structuredClone(session));

	function onFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget as HTMLFormElement);
		// const tasks: { taskName: string; isDone: boolean } = [];
		const formPayload: any = { tasks: [] };
		for (const [key, value] of formData) {
			if (key.endsWith('-done') || key.endsWith('-id') || key.endsWith('-order'))
				continue;
			if (key.startsWith('task-')) {
				const taskIndex = key[key.length - 1];
				formPayload['tasks'].push({
					name: value,
					is_done: formData.get(`task-${taskIndex}-done`) === 'on',
					id: formData.get(`task-${taskIndex}-id`),
					order: formData.get(`task-${taskIndex}-order`),
				});
			} else {
				formPayload[key] = value;
			}
		}

		const result = formSchema.safeParse(formPayload);
		console.log(formPayload);
		if (!result.success) {
			setErrors(result.error.format());
		} else {
			console.log(result.data);
			session?.update(result.data);
			onEditClose();
		}
	}
	async function onDeleteSession() {
		// this is hoisted up so it needs optional chaining
		await session?.delete();
		onEditClose();
	}
	async function onAddTask() {
		let highestId = 0;
		let highestOrder = 0;
		if (sessionDraft.tasks.length) {
			for (const task of sessionDraft.tasks) {
				if (task.id > highestId) highestId = task.id;
				if (task.order > highestOrder) highestOrder = task.order;
			}
		}
		const newTask = new Task('', highestId + 1, false, highestOrder, true);
		setSessionDraft((prev) =>
			produce(prev, (draft) => {
				draft.tasks.push(newTask);
			})
		);
		// const newTask = new Task('');
	}

	return (
		<div className=' fixed inset-1/4 z-20 dark:text-white bg-gray-800/50 backdrop-blur-3xl rounded-xl'>
			<div className='flex justify-between p-2'>
				<Dialog.Title>Edit session</Dialog.Title>
				<Dialog.Close onClick={() => setOpen(false)}>X</Dialog.Close>
			</div>
			<Popover
				open={isPopoverOpen}
				openSetter={setIsPopoverOpen}
				content={
					<PopOverContent onDelete={onDeleteSession} setPopover={setIsPopoverOpen} />
				}>
				<div
					className='text-red-500 inline-block'
					onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
					DELETE
				</div>
			</Popover>
			<form onSubmit={onFormSubmit}>
				<div>
					Name: <Input defaultValue={session.name} type='text' name='name' />
				</div>
				<div>
					Color: <Input defaultValue={session.color} type='text' name='color' />
				</div>
				<div>
					Id: <Input defaultValue={session.id} type='text' name='id' disabled />
				</div>
				<div>
					Is Selected: <Switch defaultChecked={session.is_selected} name='is_selected' />
				</div>
				<div>
					time spent {session.time_spent} - total sessions: {session.total_sessions}
				</div>
				<div>
					Tasks:
					<div className='w-full bg-gray-600/20'>
						<ul>
							{sessionDraft?.tasks.map((task, index) => {
								return (
									<React.Fragment key={task.id}>
										<TaskItemEdit task={task} key={task.id} index={index} />
										{errors.tasks &&
											errors.tasks[index]?.name?._errors.map((error, err_index) => {
												return (
													<p className='text-red-400' key={`${task.id}-${err_index}`}>
														{error}
													</p>
												);
											})}
									</React.Fragment>
								);
							})}
							<li onClick={onAddTask}>Add new task +</li>
						</ul>
					</div>
				</div>
				<button type='submit' className='block bg-gray-500'>
					save
				</button>
			</form>
		</div>
	);
};
export default EditSessionModalContent;

const PopOverContent: React.FC<{
	onDelete: () => void;
	setPopover: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ onDelete, setPopover }) => {
	return (
		<div>
			<div>Are you sure you want to delete this session?</div>
			<button onClick={onDelete}>YES</button>
			<button onClick={() => setPopover(false)}>NO</button>
		</div>
	);
};
