import React from 'react';
import * as RPopover from '@radix-ui/react-popover';
import { classnames } from '../../utils/classnames';

interface PopoverProps {
    rootProps?: RPopover.PopoverProps;
    contentProps?: RPopover.PopoverContentProps;
    portalProps?: RPopover.PortalProps;
    children?: React.ReactNode;
    content: React.ReactNode;
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
    ({ rootProps, contentProps, children, content, portalProps }, ref) => {
        console.log('is open', rootProps);
        return (
            <RPopover.Root {...rootProps} open={true}>
                <RPopover.Trigger asChild id="popover-button">
                    {children}
                </RPopover.Trigger>
                <RPopover.Portal {...portalProps}>
                    <RPopover.Content
                        {...contentProps}
                        ref={ref}
                        id="yo"
                        className={classnames(
                            'w-[260px] rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet-500)] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade',
                            contentProps?.className
                        )}>
                        <RPopover.Arrow className="bg-slate-200" />
                        <RPopover.Close />
                        {content}
                    </RPopover.Content>
                </RPopover.Portal>
            </RPopover.Root>
        );
    }
);
export default Popover;
