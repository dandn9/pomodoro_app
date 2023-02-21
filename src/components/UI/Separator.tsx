import React, { forwardRef } from 'react';
import * as RSeparator from '@radix-ui/react-separator';
import { classnames } from '../../utils/classnames';

const Separator = forwardRef<HTMLDivElement, RSeparator.SeparatorProps>(
    ({ className, ...props }, ref) => {
        return (
            <RSeparator.Root
                className={classnames(
                    'mx-[15px] bg-gray-700 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px',
                    className
                )}
                {...props}
                ref={ref}
            />
        );
    }
);
export default Separator;
