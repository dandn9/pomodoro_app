import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { z } from 'zod';
import { SessionCommands, SessionsCommands } from '../../utils/commands';
import useStateStore from '../../hooks/useStateStore';
import { TModalContentProps, TModalContent } from '../../types/ModalContent';
import { Sessions } from '../../utils/classes';

const formSchema = z.object({
    sessionName: z.string().max(20).min(1),
    tasks: z
        .string()
        .max(20)
        .array()
        .transform((arr) => arr.filter((str) => str !== '')),
});

const SessionModalContent: TModalContent = ({ open, setOpen }) => {
    const [errors, setErrors] = React.useState<
        z.ZodFormattedError<z.infer<typeof formSchema>>
    >({ _errors: [] });

    function resetErrors() {
        setErrors({ _errors: [] });
    }
    async function onSubmitHandler(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        const formData = new FormData(ev.currentTarget);

        const result = formSchema.safeParse({
            sessionName: formData.get('sessionName'),
            tasks: formData.getAll('task'),
        });

        if (!result.success) {
            setErrors(result.error.format());
        } else {
            await Sessions.onCreateSession(
                result.data.sessionName,
                '#000',
                result.data.tasks
            );
            setOpen(false);
        }
    }
    return (
        <div className="fixed inset-1/4 z-20 rounded-xl bg-gray-800 dark:text-white">
            <div className="flex justify-between p-2">
                <Dialog.Title>Add new session</Dialog.Title>
                <Dialog.Close>X</Dialog.Close>
            </div>
            <form onSubmit={onSubmitHandler}>
                <input
                    type="text"
                    name="sessionName"
                    className="bg-black"
                    onChange={resetErrors}
                />
                {errors.sessionName?._errors.map((error) => (
                    <p className="error" key={error}>
                        {error}
                    </p>
                ))}
                <input
                    type="text"
                    name="task"
                    className="mt-2 block bg-black"
                />
                <input
                    type="text"
                    name="task"
                    className="mt-2 block bg-black"
                />
                <input
                    type="text"
                    name="task"
                    className="mt-2 block bg-black"
                />
                <button type="submit" className="block">
                    create
                </button>
            </form>
        </div>
    );
};
export default SessionModalContent;
