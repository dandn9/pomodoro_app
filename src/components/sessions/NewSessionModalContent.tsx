import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { z } from 'zod';
import { TModalContent } from '../../types/ModalContent';
import { Session } from '@/utils/classes';
import { permanentStore } from '@/store/PermanentStore';

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

        console.log(errors)
        if (!result.success) {
            setErrors(result.error.format());
        } else {
            try {
                const newSession = Session.createSession(
                    result.data.sessionName,
                    '#000',
                    result.data.tasks
                );
                permanentStore().data.sessions.sessions = [...permanentStore().data.sessions.sessions, newSession]
                // console.log(store)
                setOpen(false);
            } catch (e) {
                if (e instanceof Error) {
                    /** Typescript???? */
                    setErrors((prev) => ({ ...prev, sessionName: { _errors: prev.sessionName?._errors ? [...prev.sessionName._errors, (e as Error).message] : [(e as Error).message] } }))
                }
                console.log(e)
            }
        }
    }
    return (
        <div className="fixed inset-1/4 z-20 rounded-xl bg-gray-800 dark:text-white">
            <div className="flex justify-between p-2">
                <Dialog.Title>Add new session</Dialog.Title>
                <Dialog.Close>X</Dialog.Close>
            </div>
            <form onSubmit={onSubmitHandler}>
                <label htmlFor="sessionName">Session Name</label>
                <input
                    type="text"
                    id="sessionName"
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
