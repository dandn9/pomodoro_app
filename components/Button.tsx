/* eslint-disable react/display-name */
import React, { PropsWithChildren, forwardRef } from 'react';
const Button = forwardRef<
	HTMLButtonElement,
	PropsWithChildren<{ className?: string; onClick?: () => void }>
>((props, ref) => {
	return (
		<button
			ref={ref}
			onClick={props.onClick}
			className={`min-w-[80px] select-none bg-main_upper border border-main_outline rounded-md hover:brightness-110 transition-all shadow-md p-2 ${
				props.className ? props.className : ''
			}`}
		>
			{props.children}
		</button>
	);
});
export default Button;
