import React from 'react';
import * as RPopover from '@radix-ui/react-popover';
const Popover: React.FC<
    React.PropsWithChildren<{
        content: JSX.Element;
        side?: 'top' | 'right' | 'bottom' | 'left';
        open: boolean;
        openSetter: React.Dispatch<React.SetStateAction<boolean>>;
    }>
> = ({ children, content, open, openSetter, side = 'top' }) => {
    return (
        <RPopover.Root open={open}>
            <RPopover.Trigger asChild id="popover-button">
                {children}
            </RPopover.Trigger>
            <RPopover.Portal>
                <RPopover.Content
                    side={side}
                    onPointerDownOutside={(ev) => {
                        let target = ev.target as HTMLElement;
                        if (target.id === 'popover-button') {
                            return;
                        }
                        openSetter(false);
                    }}
                    className="z-20 block bg-slate-200">
                    <RPopover.Arrow className="bg-slate-200" />
                    {content}
                </RPopover.Content>
            </RPopover.Portal>
        </RPopover.Root>
    );
};
export default Popover;
