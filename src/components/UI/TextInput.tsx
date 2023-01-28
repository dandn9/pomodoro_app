import React, { forwardRef } from 'react';
const Input = forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>(
	(props, ref) => {
		return (
			<input
				ref={ref}
				{...props}
				className={`bg-gray-600 text-white ${props.className}`}
			/>
		);
	}
);
export default Input;
