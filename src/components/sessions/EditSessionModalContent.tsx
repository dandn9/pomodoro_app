import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { TModalContent } from '../../types/ModalContent';
import useStateStore from '../../hooks/useStateStore';
import Input from '../UI/TextInput';
import Switch from '../UI/Switch';
import Task from '../tasks/Task';

const EditSessionModalContent: TModalContent<{ sessionId: number }> = (props) => {
	const allSessions = useStateStore((state) => state.getSessions());
	const session = useMemo(() => {
		return allSessions.find((session) => session.id === props.sessionId);
	}, [allSessions]);

	if (!session) {
		return <div>Couldn't load the session</div>;
	}

	const [tasks, setTasks] = useState(session.tasks);

	function onFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget as HTMLFormElement);
		console.log(...formData.keys());
	}

	return (
		<div className='fixed inset-1/4 z-20 dark:text-white bg-gray-800/50 backdrop-blur-3xl rounded-xl'>
			<div className='flex justify-between p-2'>
				<Dialog.Title>Edit session</Dialog.Title>
				<Dialog.Close>X</Dialog.Close>
			</div>
			<form onSubmit={onFormSubmit}>
				<div>
					Name: <Input defaultValue={session.name} type='text' name='name' />
				</div>
				<div>
					Color: <Input defaultValue={session.color} type='text' name='color' />
				</div>
				<div>
					Id: <Input defaultValue={session.id} type='text' name='id' />
				</div>
				<div>
					Is Selected: <Switch defaultChecked={session.is_selected} name='isSelected' />
				</div>
				<div>
					Tasks:
					<div className='w-full bg-gray-600/20'>
						<ul>
							{tasks.map((task) => {
								return <Task task={task} key={task.id} />;
							})}
							<li>Add new task +</li>
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
