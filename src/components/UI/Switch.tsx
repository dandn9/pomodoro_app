import React, { forwardRef } from 'react';
import * as SwitchR from '@radix-ui/react-switch';
import { classnames } from '../../utils/classnames';
const Switch = forwardRef<HTMLButtonElement, SwitchR.SwitchProps>(
    ({ className, ...props }, ref) => {
        return (
            <SwitchR.Root
                ref={ref}
                {...props}
                className={classnames('h-4 w-8 bg-gray-500', className)}>
                <SwitchR.Thumb className="block h-2 w-2 bg-gray-100 transition-all data-[state=checked]:translate-x-6" />
            </SwitchR.Root>
        );
    }
);
export default Switch;
