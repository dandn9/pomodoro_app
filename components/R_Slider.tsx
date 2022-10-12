import * as Slider from '@radix-ui/react-slider';
const R_Slider: React.FC<Slider.SliderProps> = (props) => {
	return (
		<Slider.Root
			{...props}
			className='relative flex items-center w-48 h-6'
			// defaultValue={[50]}
		>
			<Slider.Track className='relative bg-slate-400 grow rounded-full w-3 h-3'>
				<Slider.Range className='absolute bg-red-300 rounded-full h-full' />
			</Slider.Track>
			<Slider.Thumb className='bg-slate-500 w-4 h-4 block rounded-full ' />
		</Slider.Root>
	);
};
export default R_Slider;
