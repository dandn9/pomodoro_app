import * as RSelect from '@radix-ui/react-select';
import React, { forwardRef } from 'react';
import ChevronDown from '../../assets/icons/chevron-down';
import { classnames } from '../../utils/classnames';

interface SelectProps {
    contentProps?: RSelect.SelectContentProps;
    valueProps?: RSelect.SelectValueProps;
    rootProps?: RSelect.SelectProps;
    children?: React.ReactNode;
}

const Select: React.ForwardRefExoticComponent<
    SelectProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, SelectProps>(
    ({ valueProps, contentProps, children, rootProps }, ref) => {
        return (
            <RSelect.Root {...rootProps}>
                <RSelect.Trigger className=" inline-flex h-[35px] min-w-[100px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none text-violet-600 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-gray-400 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet-800">
                    <RSelect.Value {...valueProps} />
                    <RSelect.Icon>
                        <ChevronDown />
                    </RSelect.Icon>
                </RSelect.Trigger>

                <RSelect.Portal>
                    <RSelect.Content
                        align="center"
                        {...contentProps}
                        ref={ref}
                        className={classnames(
                            'overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]',
                            contentProps?.className
                        )}>
                        <RSelect.ScrollUpButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white"></RSelect.ScrollUpButton>
                        <RSelect.Viewport className="p-[5px]">
                            {children}
                        </RSelect.Viewport>
                    </RSelect.Content>
                </RSelect.Portal>
            </RSelect.Root>
        );
    }
);
export default Select;

export const SelectItem: typeof RSelect.Item = React.forwardRef<
    HTMLDivElement,
    RSelect.SelectItemProps
>(({ children, className, ...props }, forwardRef) => {
    return (
        <RSelect.Item
            ref={forwardRef}
            {...props}
            className={classnames(
                ' data-[disabled]:text-mauve8 relative flex h-[25px] select-none items-center rounded-[3px] pr-[35px] pl-[25px] text-[13px] leading-none text-violet-500 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet-900 data-[highlighted]:text-violet-200 data-[highlighted]:outline-none',
                className
            )}>
            <RSelect.ItemText>{children}</RSelect.ItemText>
            <RSelect.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                {/* <CheckIcon /> */}
            </RSelect.ItemIndicator>
        </RSelect.Item>
    );
});
export const SelectGroup = RSelect.Group;
export const SelectDivider = RSelect.Separator;
