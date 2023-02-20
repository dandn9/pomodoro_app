import React, { forwardRef } from 'react';
import * as SwitchR from '@radix-ui/react-switch';
import { classnames } from '../../utils/classnames';
const Switch = forwardRef<
    HTMLButtonElement,
    SwitchR.SwitchProps & { thumbClassname?: string }
>(({ className, thumbClassname, ...props }, ref) => {
    return (
        <SwitchR.Root
            ref={ref}
            {...props}
            className={classnames(
                'relative h-[25px] w-[42px] cursor-default rounded-full bg-black/20 shadow-[0_2px_10px] shadow-black/50 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black',
                className
            )}>
            <SwitchR.Thumb
                className={classnames(
                    'data-[state=checked]:translate-x-[19px]lock block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white  shadow-[0_2px_2px] shadow-black/10 transition-transform  duration-100 will-change-transform data-[state=checked]:translate-x-6',
                    thumbClassname
                )}
            />
        </SwitchR.Root>
    );
});
export default Switch;
