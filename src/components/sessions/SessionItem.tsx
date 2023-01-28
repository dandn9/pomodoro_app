import { current, produceWithPatches } from 'immer';
import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { SessionType } from '../../utils/schemas';
import { Session } from '../../utils/classTypes';
import TaskItemSession from '../tasks/TaskItemSession';
import * as Accordion from '@radix-ui/react-accordion';

interface SessionItemProps {
	session: Session;
	onEdit: (session: Session) => void;
}

type ftype = (p: string, x: string) => ReactElement;
interface XProps {
	children: (x: ftype) => ReactElement;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onEdit }) => {
	function onEditClick(ev: React.MouseEvent) {
		ev.stopPropagation();
		onEdit(session);
	}
	function onTaskCheck(taskId: number, checked: boolean) {
		session.updateTask(taskId, checked);
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
				{session.tasks.map((task) => (
					<TaskItemSession task={task} key={task.id} onTaskChecked={onTaskCheck} />
				))}
			</AccordionContent>
		</Accordion.Item>
	);

	// return (
	// 	<li
	// 		onClick={() => session.selected()}
	// 		className={`w-full relative max-h-32 border
	//             ${session.is_selected ? 'border-white' : 'border-gray-400'}
	//             `}>
	// 		<p>
	// 			{session.name} - {session.id}
	// 		</p>
	// 		<ul>
	// 			{session.tasks.map((task, index) => (
	// 				<TaskItemSession task={task} key={task.id} />
	// 			))}
	// 		</ul>
	// 		{/* <X>{(func) => func('X', 'D')}</X> */}
	// 		<button className='absolute right-2 top-0' onClick={onEditClick}>
	// 			E
	// 		</button>
	// 	</li>
	// );
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
		<ul className='AccordionContentText'>{children}</ul>
	</Accordion.Content>
));

export default SessionItem;

// const P = () => {
// 	return <X>{(f) => <div>{f}</div>}</X>;
// };
