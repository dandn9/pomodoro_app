import * as RCheckbox from '@radix-ui/react-checkbox';
import React from 'react';
const Checkbox: React.FC<RCheckbox.CheckboxProps> = (props) => {
	return (
		<RCheckbox.Root className='w-6 h-6 bg-white' {...props}>
			<RCheckbox.Indicator className='text-black'>X</RCheckbox.Indicator>
		</RCheckbox.Root>
	);
};
export default Checkbox;
