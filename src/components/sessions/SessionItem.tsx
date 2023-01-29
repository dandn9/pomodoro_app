import { current, produceWithPatches } from 'immer';
import React, { PropsWithChildren, ReactElement, ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SessionType } from '../../utils/schemas';
import { Session, Task } from '../../utils/classTypes';
import TaskItemSession from '../tasks/TaskItemSession';
import * as Accordion from '@radix-ui/react-accordion';
import { z } from 'zod';

interface SessionItemProps {
	session: Session;
	onEdit: (session: Session) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onEdit }) => {
	function onEditClick(ev: React.MouseEvent) {
		ev.stopPropagation();
		onEdit(session);
	}
	function onTaskCheck(taskId: number, checked: boolean) {
		session.updateTaskDone(taskId, checked);
	}

	return (
		<Accordion.Item value={`${session.id}`}>
			<AccordionTrigger className='flex justify-between'>
				<h3>{session.name}</h3>
				<div onClick={onEditClick} className='bg-slate-500'>
					EDIT
				</div>
			</AccordionTrigger>
			<AccordionContent>
				{session.tasks.map((task, index) => {
					return (
						<TaskItemSession
							sessionId={session.id}
							index={index}
							task={task}
							key={task.id}
							onTaskChecked={onTaskCheck}
						/>
					);
				})}
			</AccordionContent>
		</Accordion.Item>
	);
};

const AccordionTrigger = React.forwardRef<
	HTMLButtonElement,
	Accordion.AccordionTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
	<Accordion.Trigger
		className={`bg-gray-700 w-full ${className}`}
		{...props}
		ref={forwardedRef}>
		{children}
	</Accordion.Trigger>
));

const AccordionContent = React.forwardRef<
	HTMLDivElement,
	Accordion.AccordionContentProps
>(({ children, className, ...props }, forwardedRef) => (
	<Accordion.Content
		asChild
		className={`bg-blue-400 ${className}`}
		{...props}
		ref={forwardedRef}>
		<ul className='tasks-container'>{children}</ul>
	</Accordion.Content>
));

export default SessionItem;

// const P = () => {
// 	return <X>{(f) => <div>{f}</div>}</X>;
// };
