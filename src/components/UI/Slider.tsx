import * as RxSlider from '@radix-ui/react-slider';

import type { SliderProps } from '@radix-ui/react-slider';

const Slider: React.FC<SliderProps> = (props) => {
	return (
		<RxSlider.Root className={`relative flex items-center select-none touch-none w-52 h-5 ${props.className}`} {...props}>
			<RxSlider.Track className='dark:bg-black relative grow rounded-full h-1'>
				<RxSlider.Range className='absolute dark:bg-white rounded-full h-full' />
			</RxSlider.Track>
			<RxSlider.Thumb className='block h-5 w-5 dark:bg-white rounded-full shadow-2xl ' />
		</RxSlider.Root>
	);
};
export default Slider;
