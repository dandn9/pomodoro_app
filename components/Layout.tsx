import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import { useRouter } from 'next/router';
import useClickOutside from '../hooks/useClickOutside';
const Layout = (props: React.PropsWithChildren) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showBar, setShowbar] = useState(true);
	const menuRef = useRef<HTMLElement | null>(null);
	useClickOutside(menuRef, () => {
		console.log('click outside');
		setIsOpen(false);
	});

	useEffect(() => {
		const halfScreenY = window.innerHeight / 2;
		// height of bar is 224px
		const handleMove = (ev: MouseEvent) => {
			if (ev.clientX > 30) {
				if (showBar) setShowbar(false);
				return;
			}

			if (ev.clientY >= halfScreenY - 130 && ev.clientY <= halfScreenY + 130) {
				setShowbar(true);
			} else if (showBar) {
				setShowbar(false);
			}
		};
		window.addEventListener('mousemove', handleMove);
		return () => {
			window.removeEventListener('mousemove', handleMove);
		};
	}, [showBar]);

	const router = useRouter();
	console.log(router);

	return (
		<main className='h-[calc(100%-28px)] w-full overflow-x-hidden '>
			<AnimatePresence key={'dd'}>
				{isOpen && (
					<motion.section
						key='MainMenu'
						ref={menuRef}
						initial={{ x: -60, y: '-50%' }}
						animate={{ x: 0, y: '-50%' }}
						exit={{ x: -90, y: '-50%', transition: { duration: 0.2 } }}
						transition={{
							type: 'spring',
							damping: 10,
							stiffness: 100,
							duration: 0.3,
						}}
						className='absolute h-56 flex flex-col items-center overflow-hidden  bg-main_upper border border-main_outline rounded-full z-50 left-2 top-1/2 -translate-y-1/2'
					>
						<Link href='/stats'>
							<a
								className={`opacity-60 hover:opacity-90 transition-opacity select-none px-2 flex justify-center items-center grow ${
									router.pathname === '/stats'
										? 'opacity-90 bg-main_white/5'
										: ''
								}`}
							>
								<Image
									src='/assets/icons/stats.svg'
									alt='stats'
									width={40}
									height={40}
								/>
							</a>
						</Link>
						<Link href='/'>
							<a
								className={`opacity-60 hover:opacity-90 transition-opacity px-2 select-none flex justify-center border-t border-b border-main_outline items-center grow ${
									router.pathname === '/' ? 'opacity-90 bg-main_white/5' : ''
								}`}
							>
								<Image
									src='/assets/icons/home.svg'
									alt='main'
									width={40}
									height={40}
								/>
							</a>
						</Link>
						<Link href='/settings'>
							<a
								className={`opacity-60 hover:opacity-90 select-none transition-opacity px-2 flex justify-center items-center grow ${
									router.pathname === '/settings'
										? 'opacity-90 bg-main_white/5'
										: ''
								}`}
							>
								<Image
									src='/assets/icons/settings.svg'
									alt='stats'
									width={40}
									height={40}
								/>
							</a>
						</Link>
					</motion.section>
				)}
				{!isOpen && showBar && (
					<motion.section
						key='SubMenu'
						initial={{ x: -30, y: '-50%' }}
						animate={{ x: 0, y: '-50%' }}
						onClick={() => {
							setIsOpen(true);
						}}
						exit={{ x: -50, y: '-50%', transition: { duration: 0.1 } }}
						transition={{
							type: 'tween',
							ease: 'easeIn',
						}}
						className='absolute h-56 hover:bg-main_white/60 border border-main_outline transition-all cursor-pointer bg-main_white/40 w-3 rounded-full z-40 left-2 top-1/2 -translate-y-1/2'
					></motion.section>
				)}
			</AnimatePresence>
			{props.children}
		</main>
	);
};
export default Layout;
