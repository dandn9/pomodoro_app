import React, { forwardRef } from 'react';
import * as SwitchR from '@radix-ui/react-switch';
const Switch = forwardRef<HTMLButtonElement, SwitchR.SwitchProps>((props, ref) => {
	return (
		<SwitchR.Root
			ref={ref}
			{...props}
			className={` w-8 h-4 bg-gray-500 ${props.className}`}
		>
			<SwitchR.Thumb className='w-2 h-2 bg-gray-100 block data-[state=checked]:translate-x-6 transition-all' />
		</SwitchR.Root>
	);
});
export default Switch;
