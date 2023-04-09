import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { TModalContent } from '../../types/ModalContent';
import Input from '../UI/Input';
import Switch from '../UI/Switch';
import TaskItemEdit from '../tasks/TaskItemEdit';
import Popover from '../UI/Popover';
import produce from 'immer';
import { Session, Task } from '../../utils/classes';
import { Writable } from '../../utils/utilityTypes';
import { ZodError, z } from 'zod';
import Sessions from '@/pages/Sessions';
import { permanentStore } from '@/store/PermanentStore';

export const formSchema = z
    .object({
        name: z.string(),
        color: z.string(),
        is_selected: z.literal('on').optional(),
        tasks: z
            .object({
                name: z.string().min(1).max(30),
                is_done: z.boolean(),
            })
            .array(),
    })
    .superRefine((val, ctx) => {
        const tasks_name = val.tasks.map((task) => task.name);

        if (val.tasks.length !== new Set(tasks_name).size) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'No duplicate names allowed',
            });
        }
        if (permanentStore().data.sessions.sessions.some((s) => s.name === val.name)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Cannot have sessions with the same name"
            })
        }
    });

export type editFormType = z.infer<typeof formSchema>;

const EditSessionModalContent: TModalContent<{
    session?: Session;
    onEditClose: () => void;
}> = ({ onEditClose, session, setOpen, open }) => {
    if (!session) {
        return <div>{`Couldn't load the session`}</div>;
    }
    const [errors, setErrors] = React.useState<
        z.ZodFormattedError<z.infer<typeof formSchema>>
    >({ _errors: [] });

    console.log('errors', errors);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>(session.tasks)

    function onFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({ _errors: [] });
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        // const tasks: { taskName: string; isDone: boolean } = [];
        console.log('formData', ...formData)
        const formPayload = {} as editFormType;

        /** TODO: clean up this */

        formPayload.tasks = []
        const allNames = formData.getAll('task-name')
        const allDones = formData.getAll('task-done')
        for (let i = 0; i < allNames.length; i++) {
            formPayload.tasks.push({ name: allNames[i].toString(), is_done: allDones[i] === 'true' })
        }
        formPayload.color = formData.get('color') as string
        formPayload.name = formData.get('name') as string
        formPayload.is_selected = formData.get('is_selected') as 'on' | undefined


        try {
            const result = formSchema.parse(formPayload);
            session?.update(result);
            onEditClose();

        } catch (e) {
            console.log('error', e)
            if (e instanceof ZodError) {
                setErrors((e as ZodError).format());
            }

        }
    }
    async function onDeleteSession() {
        // this is hoisted up so it needs optional chaining
        await session?.delete();
        onEditClose();
    }
    async function onAddTask() {
        const lowestId = tasks.reduce((a, b) => b.id < a ? b.id : a, 0)
        const newTask = new Task('', lowestId - 1, false); // Every task with id < 0 will be a draft and its id will be created after
        setTasks((prev) => [...prev, newTask]);
        // const newTask = new Task('');
    }
    function onDeleteTask(id: number) {
        console.log('deleting', id)
        setTasks((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <div className=" fixed inset-1/4 z-20 rounded-xl bg-gray-800/50 backdrop-blur-3xl dark:text-white">
            <div className="flex justify-between p-2">
                <Dialog.Title>Edit session</Dialog.Title>
                <Dialog.Close onClick={() => setOpen(false)}>X</Dialog.Close>
            </div>
            <Popover
                padding="sm"
                rootProps={{ open: isPopoverOpen }}
                contentProps={{
                    onPointerDownOutside: () => setIsPopoverOpen(false),
                }}
                popoverSize="md"
                content={
                    <PopOverContent
                        onDelete={onDeleteSession}
                        setPopover={setIsPopoverOpen}
                    />
                }>
                <div
                    className="inline-block text-red-500"
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                    DELETE
                </div>
            </Popover>
            <form onSubmit={onFormSubmit}>
                {errors._errors?.map((error) => (
                    <p className="text-red-500" key={error}>
                        {error}
                    </p>
                ))}
                <div>
                    <label htmlFor="name">Name:</label>
                    <Input
                        defaultValue={session.name}
                        type="text"
                        id="name"
                        name="name"
                    />
                </div>
                <div>
                    <label htmlFor="color">Color:</label>
                    <Input
                        defaultValue={session.color}
                        type="text"
                        id="color"
                        name="color"
                    />
                </div>
                <div>
                    <label htmlFor="id">Id:</label>
                    <Input
                        defaultValue={session.id}
                        type="text"
                        id="id"
                        name="id"
                        disabled
                    />
                </div>
                <div>
                    <label htmlFor="is_selected">Is Selected:</label>
                    <Switch
                        defaultChecked={session.is_selected}
                        name="is_selected"
                    />
                </div>
                <div>
                    time spent {session.time_spent} - total sessions:{' '}
                    {session.total_sessions}
                </div>
                <div>
                    Tasks:
                    <div className="w-full bg-gray-600/20">
                        <ul>
                            {tasks.map((task, index) => {
                                return (
                                    <React.Fragment key={task.id}>
                                        <TaskItemEdit
                                            task={task}
                                            onDelete={onDeleteTask}
                                        />
                                        {errors.tasks &&
                                            errors.tasks[
                                                index
                                            ]?.name?._errors.map(
                                                (error, err_index) => {
                                                    return (
                                                        <p
                                                            className="text-red-400"
                                                            key={`${task.id}-${err_index}`}>
                                                            {error}
                                                        </p>
                                                    );
                                                }
                                            )}
                                    </React.Fragment>
                                );
                            })}
                            <li onClick={onAddTask}>Add new task +</li>
                        </ul>
                    </div>
                </div>
                <button type="submit" className="block bg-gray-500">
                    save
                </button>
            </form>
        </div>
    );
};
export default EditSessionModalContent;

const PopOverContent: React.FC<{
    onDelete: () => void;
    setPopover: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ onDelete, setPopover }) => {
    return (
        <div className="z-50 h-full">
            <div>Are you sure you want to delete this session?</div>
            <button onClick={onDelete}>YES</button>
            <button onClick={() => setPopover(false)}>NO</button>
        </div>
    );
};
