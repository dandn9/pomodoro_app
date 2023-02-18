import React, { forwardRef } from 'react';
const Input = forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>(
    (props, ref) => {
        return (
            <input
                ref={ref}
                {...props}
                className={`bg-gray-600 text-white ${props.className} border border-gray-700`}
            />
        );
    }
);
export default Input;
