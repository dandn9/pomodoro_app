import React, { ForwardRefExoticComponent, forwardRef } from 'react';
import * as RTooltip from '@radix-ui/react-tooltip';
import { classnames } from '../../utils/classnames';

interface TooltipProps {
    RootProps?: RTooltip.TooltipProps;
    ProviderProps?: RTooltip.TooltipProviderProps;
    ContentProps?: RTooltip.TooltipContentProps;
    tooltipText: string;
    children: React.ReactNode;
}

const Tooltip: ForwardRefExoticComponent<
    TooltipProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, TooltipProps>(
    (
        { children, tooltipText, RootProps, ProviderProps, ContentProps },
        ref
    ) => {
        return (
            <RTooltip.Provider delayDuration={200} {...ProviderProps}>
                <RTooltip.Root {...RootProps}>
                    <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
                    <RTooltip.Content
                        {...ContentProps}
                        ref={ref}
                        className={classnames(
                            'data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none text-violet-700 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]'
                        )}>
                        {tooltipText}
                        <RTooltip.Arrow className="fill-white" />
                    </RTooltip.Content>
                </RTooltip.Root>
            </RTooltip.Provider>
        );
    }
);
export default Tooltip;
