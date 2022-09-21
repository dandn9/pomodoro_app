import { stat } from 'fs';
import Image from 'next/image';
import React, { KeyboardEvent, useRef, useState } from 'react';
import Button from '../components/Button';
import useStore from '../hooks/useStore';
import { timeToMinutes, timeToSeconds } from '../utils/displayTime';
import {
	saveSession,
	deleteSession,
	setSessionSelected,
} from '../utils/session';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import useClickOutside from '../hooks/useClickOutside';

const Stats = () => {
	const sessions = useStore((state) => state.sessions);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	useClickOutside(
		menuRef,
		(_) => {
			setMenuOpen(false);
		},
		buttonRef
	);
	const newLabelRef = useRef<HTMLInputElement | null>(null);

	const onLabelKeyDown = (ev: KeyboardEvent) => {
		if (ev.key === 'Escape') {
			if (newLabelRef.current) newLabelRef.current.value = '';
			setMenuOpen(false);
			return;
		}
		if (ev.key === 'Enter' && newLabelRef.current) {
			const sessionName = newLabelRef.current.value;
			saveSession(sessionName, 0);
			newLabelRef.current.value = '';
			setMenuOpen(false);
		}
	};

	const onDeleteSession = (sessionId: number) => {
		deleteSession(sessionId);
	};

	const toggleMenu = () => {
		if (menuOpen) {
			setMenuOpen(false);
		} else {
			setMenuOpen(true);
			newLabelRef.current?.focus();
		}
	};

	return (
		<div className='flex  flex-col items-center relative pt-6 h-full'>
			<ul className='w-full flex flex-col gap-1 max-w-lg'>
				<AnimatePresence presenceAffectsLayout>
					<LayoutGroup>
						{sessions.map((session, idx) => {
							const date = new Date(session.started_at);
							return (
								<motion.li
									layout
									key={session.id}
									onClick={() => {
										setSessionSelected(session.id);
									}}
									initial={{ opacity: 0, y: 20 }}
									transition={{
										type: 'spring',
										damping: 10,
										stiffness: 100,
										duration: 0.3,
									}}
									animate={{ opacity: 1, y: 0 }}
									exit={{
										opacity: 0,
										y: -60,
										transition: { duration: 0.2 },
									}}
									className={`${
										session.selected
											? 'border-green-800 my-2'
											: 'border-main_outline'
									} rounded-lg border bg-main_upper/60 relative shadow-lg hover:-translate-y-1 hover:bg-main_upper/100 duration-100 transition-{background} px-4 py-2`}
								>
									<h2 className='italic text-xl'>{session.label}</h2>
									<div className='flex justify-between mt-4 opacity-80'>
										<div>
											Total Time: {timeToMinutes(session.total_time)}:
											{timeToSeconds(session.total_time)}
										</div>
										<div>
											Started At:{' '}
											<span className='opacity-80 italic'>
												{date.getDate()}/{date.getMonth() + 1}/
												{date.getFullYear()}
											</span>
										</div>
									</div>
									<button
										className='absolute top-1 right-1'
										onClick={onDeleteSession.bind(null, session.id)}
									>
										<Image
											src='/assets/icons/close.svg'
											width={26}
											height={26}
											alt='delete'
										/>
									</button>
								</motion.li>
							);
						})}
					</LayoutGroup>
				</AnimatePresence>
			</ul>
			<AnimatePresence>
				{menuOpen && (
					<motion.div
						initial={{ opacity: 0, y: '-60%', x: '-50%' }}
						transition={{
							type: 'spring',
							damping: 10,
							stiffness: 100,
							duration: 0.3,
						}}
						animate={{ opacity: 1, y: '-50%', x: '-50%' }}
						exit={{
							opacity: 0,
							y: '40%',
							x: '-50%',
							transition: { duration: 0.2 },
						}}
						ref={menuRef}
						onKeyDown={onLabelKeyDown}
						className='absolute left-1/2 top-1/2 -translate-x-1/2 z-40 -translate-y-1/2 flex-col flex shadow-xl border rounded-md border-main_outline bg-main_upper p-4'
					>
						<input
							className='text-main_white bg-main_upper border border-main_outline focus:brightness-125 focus:outline-none px-1 rounded-sm py-1 '
							type='text'
							placeholder='Label...'
							ref={newLabelRef}
							autoFocus={true}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<Button className='mt-4 ' ref={buttonRef} onClick={toggleMenu}>
				Add new session
			</Button>
		</div>
	);
};
export default Stats;
