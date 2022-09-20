/* eslint-disable react/display-name */
import React, { forwardRef, PropsWithChildren, RefObject } from 'react';
import { motion } from 'framer-motion';

interface MenuProps {
	position?: 'top' | 'bottom' | 'right' | 'left' | 'center';
}

const Menu = forwardRef<HTMLDivElement, PropsWithChildren<MenuProps>>(
	({ position = 'top', children }, ref) => {
		let positionClasses = '';
		let translateX = '';
		let translateY = '';

		switch (position) {
			case 'top':
				positionClasses =
					'bottom-full left-1/2 -translate-x-1/2 -translate-y-2';

				break;
			case 'bottom':
				positionClasses = 'top-full left-1/2 -translate-x-1/2 translate-y-2';

				break;
			case 'left':
				positionClasses = 'right-full top-1/2 -translate-y-1/2 -translate-x-2';
				break;
			case 'right':
				positionClasses = 'left-full top-1/2 -translate-y-1/2 -translate-x-2';
				break;
			case 'center':
				positionClasses = 'left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2';
				break;
		}

		return (
			<motion.div
				initial={{ opacity: 0, marginTop: 10 }}
				animate={{ opacity: 1, marginTop: 0 }}
				exit={{ opacity: 0, marginTop: -2, transition: { duration: 0.2 } }}
				ref={ref}
				className={`bg-main_upper border border-main_outline rounded-md  overflow-hidden absolute z-50 ${positionClasses} shadow-md shadow-main_bg/40 `}
			>
				<div>{children}</div>
			</motion.div>
		);
	}
);
export default Menu;
