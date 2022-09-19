/* eslint-disable react/display-name */
import React, { forwardRef, PropsWithChildren, RefObject } from 'react';

interface MenuProps {
	position?: 'top' | 'bottom' | 'right' | 'left' | 'center';
}

const Menu = forwardRef<HTMLDivElement, PropsWithChildren<MenuProps>>(
	({ position = 'top', children }, ref) => {
		let positionClasses = '';

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
			<div
				ref={ref}
				className={`bg-gray-900 border border-gray-700 rounded-md overflow-hidden absolute z-50 ${positionClasses} shadow-md shadow-black/30 `}
			>
				<div>{children}</div>
			</div>
		);
	}
);
export default Menu;
