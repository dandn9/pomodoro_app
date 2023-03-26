import React, { forwardRef } from 'react';
import { classnames } from '../../utils/classnames';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
    onCommit?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    onCommitTimeout?: number;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { className, onCommit, onCommitTimeout = 500, onChange, ...props },
        ref
    ) => {
        const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

        const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
            if (onCommit) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    onCommit(ev);
                }, onCommitTimeout);
            }
            onChange?.(ev);
        };

        return (
            <input
                ref={ref}
                {...props}
                onChange={handleChange}
                className={classnames(
                    `border border-gray-700 bg-gray-600 text-white`,
                    className
                )}
            />
        );
    }
);
export default Input;
