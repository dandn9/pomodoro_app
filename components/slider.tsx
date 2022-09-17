import React, { ChangeEvent } from 'react';
import { timeToMinutes } from '../utils/displayTime';
const Slider = (
	props: React.PropsWithChildren<{
		min: number;
		max: number;
		onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
		value: number;
		label?: string;
		converValue?: (val: number) => string;
	}>
) => {
	return (
		<div className='flex flex-col'>
			{props.label && <span>{props.label}</span>}
			<input
				type='range'
				className='custom-slider'
				min={props.min}
				max={props.max}
				onChange={props.onChange}
				value={props.value}
			/>
			<div className='w-full flex justify-between'>
				<span>
					{props.converValue ? props.converValue(props.min) : props.min}
				</span>
				<span>
					{props.converValue ? props.converValue(props.max) : props.max}
				</span>
			</div>
		</div>
	);
};
export default Slider;
