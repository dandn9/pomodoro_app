import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';
const R_Slider: React.FC<Slider.SliderProps & { hasToolTip?: boolean }> = (
	props
) => {
	return (
		<Slider.Root
			{...props}
			className='relative flex items-center w-48 h-6'
			// defaultValue={[50]}
		>
			<Slider.Track className='relative bg-slate-400 grow rounded-full w-3 h-3'>
				<Slider.Range className='absolute bg-red-300 rounded-full h-full' />
			</Slider.Track>
			<Slider.Thumb className='bg-slate-500 w-4 h-4 block rounded-full relative'>
				{props.hasToolTip && (
					<Tooltip.Provider>
						<Tooltip.Root open>
							<Tooltip.Trigger />
							<Tooltip.Content className='text-black p-2 bg-white'>
								<div>1</div>
								<Tooltip.Arrow className='fill-white' />
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				)}
			</Slider.Thumb>
		</Slider.Root>
	);
};
export default R_Slider;
