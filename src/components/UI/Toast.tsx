import React from 'react';
import * as RToast from '@radix-ui/react-toast';

export type ToastProps = {
    open: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Toast = React.forwardRef<HTMLLIElement, ToastProps>(
    ({ open, setIsOpen }, ref) => {
        return (
            <RToast.Provider>
                <RToast.Root open={open} onOpenChange={setIsOpen} ref={ref}>
                    <RToast.Title>SAVED</RToast.Title>
                </RToast.Root>
                <RToast.Viewport className="fixed bottom-0 right-0 p-4" />
            </RToast.Provider>
        );
    }
);
export default Toast;
