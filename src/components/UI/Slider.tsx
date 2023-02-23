import * as RxSlider from '@radix-ui/react-slider';
import React, { forwardRef, useImperativeHandle } from 'react';

import type { SliderProps as RSliderProps } from '@radix-ui/react-slider';
import { classnames } from '../../utils/classnames';
import Popover from './Popover';

interface SliderProps extends RSliderProps {
    withPopover?: boolean;
}

const Slider = forwardRef<HTMLSpanElement, SliderProps>(
    ({ className, withPopover, ...props }, ref) => {
        const [showPopover, setShowPopover] = React.useState(true);
        const [popoverValue, setPopoverValue] = React.useState(
            props.defaultValue
        );
        const sliderRef = React.useRef<HTMLSpanElement>(null);
        const thumbRef = React.useRef<HTMLSpanElement>(null);

        console.log('is p', showPopover, popoverValue);
        useImperativeHandle(ref, () => sliderRef.current as HTMLSpanElement);
        return (
            <RxSlider.Root
                ref={sliderRef}
                className={classnames(
                    `relative flex h-5 w-52 touch-none select-none items-center`,
                    className
                )}
                onValueChange={(val) => {
                    if (withPopover) {
                        setShowPopover(true);
                        setPopoverValue(val);
                    }
                    props.onValueChange?.(val);
                }}
                {...props}>
                <RxSlider.Track className="relative h-1 grow rounded-full dark:bg-black">
                    <RxSlider.Range className="absolute h-full rounded-full dark:bg-white" />
                </RxSlider.Track>
                <Popover
                    content={<div className="text-black">{popoverValue}</div>}
                    rootProps={{ open: showPopover }}
                    portalProps={{ container: thumbRef.current }}
                    contentProps={{
                        side: 'top',
                        align: 'center',
                    }}>
                    <RxSlider.Thumb
                        ref={thumbRef}
                        className="relative block h-5 w-5 rounded-full shadow-2xl dark:bg-white "></RxSlider.Thumb>
                </Popover>
            </RxSlider.Root>
        );
    }
);
export default Slider;
