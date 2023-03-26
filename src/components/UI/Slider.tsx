import * as RxSlider from '@radix-ui/react-slider';
import React, { forwardRef, useImperativeHandle } from 'react';

import type { SliderProps as RSliderProps } from '@radix-ui/react-slider';
import { classnames } from '../../utils/classnames';
import Popover from './Popover';

interface SliderProps extends RSliderProps {
    withIndicator?: boolean;
    displayFn?: (val: number[] | undefined) => string;
    indicatorProps?: React.HTMLProps<HTMLDivElement>;
}

const Slider = forwardRef<HTMLSpanElement, SliderProps>(
    (
        { className, withIndicator, displayFn, indicatorProps, ...props },
        ref
    ) => {
        const [indicator, setIndicator] = React.useState({
            show: false,
            value: props.defaultValue,
        });
        const timeoutRef = React.useRef<NodeJS.Timeout>();

        const showIndicator = () => {
            setIndicator((prev) => ({ show: true, value: prev.value }));
        };
        const hideIndicator = () => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setIndicator((prev) => ({ show: false, value: prev.value }));
            }, 400);
        };
        return (
            <RxSlider.Root
                ref={ref}
                className={classnames(
                    `relative flex h-5 w-52 touch-none select-none items-center`,
                    className
                )}
                onPointerOver={(e) => {
                    if (withIndicator) {
                        showIndicator();
                    }
                    props.onPointerOver?.(e);
                }}
                onPointerLeave={(e) => {
                    if (withIndicator) {
                        hideIndicator();
                    }
                    props.onPointerLeave?.(e);
                }}
                onValueChange={(val) => {
                    if (withIndicator) {
                        setIndicator({ value: val, show: true });
                    }
                    props.onValueChange?.(val);
                }}
                {...props}>
                <RxSlider.Track className="relative h-1 grow rounded-full dark:bg-black">
                    <RxSlider.Range className="absolute h-full rounded-full dark:bg-white" />
                </RxSlider.Track>
                <RxSlider.Thumb className="animate relative block h-5  w-5 animate-slideUpAndFade cursor-grabbing rounded-full shadow-2xl outline-none dark:bg-white ">
                    {withIndicator && indicator.show && (
                        <div
                            {...indicatorProps}
                            className={classnames(
                                ' animate absolute bottom-full left-1/2 flex h-8 w-8 -translate-y-2 -translate-x-1/2 rotate-45 animate-slideUpAndFade  items-center justify-center rounded-l-full rounded-tr-full bg-white text-xs font-extrabold text-black'
                            )}>
                            <span className="-rotate-45">
                                {displayFn?.(indicator.value) ||
                                    indicator.value}
                            </span>
                        </div>
                    )}
                </RxSlider.Thumb>
            </RxSlider.Root>
        );
    }
);
export default Slider;
