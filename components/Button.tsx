import React, { PropsWithChildren } from 'react';
const Button: React.FC<PropsWithChildren<{ className?: string }>> = (props) => {
	return (
		<button
			className={`min-w-[80px] bg-main_upper border border-main_outline rounded-md hover:brightness-110 transition-all shadow-md p-2 ${
				props.className ? props.className : ''
			}`}
		>
			{props.children}
		</button>
	);
};
export default Button;
