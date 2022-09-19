import React, { PropsWithChildren } from 'react';
const Button: React.FC<PropsWithChildren<{ className?: string }>> = (props) => {
	return (
		<button
			className={`min-w-[80px] bg-gray-900 border border-gray-700 rounded-md hover:bg-gray-700 transition-all shadow-md p-2 ${
				props.className ? props.className : ''
			}`}
		>
			{props.children}
		</button>
	);
};
export default Button;
