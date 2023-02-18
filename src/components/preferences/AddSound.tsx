import React, { useState } from 'react';
import { TModalContent } from '../../types/ModalContent';
import TextInput from '../UI/TextInput';
import { z } from 'zod';
import produce from 'immer';

// ADD SOUND PAYLOAD
const formSchema = z.object({
    sound: z.instanceof(File).superRefine((val, ctx) => {
        if (val.size === 0) {
            ctx.addIssue({
                code: 'custom',
                message: 'You need to upload a file',
            });
            return;
        }
        if (!val.type.includes('audio')) {
            ctx.addIssue({
                code: 'custom',
                message: 'You need to upload a audio file',
            });
            return;
        }
    }),
    name: z.string().min(1),
});
export type AddSoundPayload = z.infer<typeof formSchema>;

const AddSound: TModalContent<{
    onAddSound: (pl: AddSoundPayload) => Promise<void>;
}> = ({ onAddSound }) => {
    const [addedSound, setAddedSound] = useState('');
    const [errors, setErrors] = React.useState<
        z.ZodFormattedError<z.infer<typeof formSchema>>
    >({ _errors: [] });

    const onFormSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        const data = new FormData(ev.currentTarget);

        const formData = formSchema.safeParse({
            sound: data.get('sound'),
            name: data.get('name'),
        });
        if (!formData.success) {
            setErrors(formData.error.format());
            return;
        }

        await onAddSound(formData.data);
    };
    const audioFile = React.useRef<HTMLInputElement | null>(null);
    console.log('errors', errors);
    return (
        <div className="z-50 h-52 w-96 bg-gray-600">
            <form onSubmit={onFormSubmit}>
                <label htmlFor="name">Name</label>
                <TextInput
                    id="name"
                    name="name"
                    onChange={() => {
                        setErrors((s) =>
                            produce(s, (d) => (d.name = undefined))
                        );
                    }}
                />
                {errors?.name?._errors?.map((err) => (
                    <p className="text-red-500" key={err}>
                        {err}
                    </p>
                ))}
                <input
                    type="file"
                    id="input"
                    name="sound"
                    accept="audio/*"
                    className="hidden"
                    ref={audioFile}
                    onChange={(ev) => {
                        const name = ev.target.files?.item(0)?.name || '';
                        setAddedSound(name);
                        setErrors((s) =>
                            produce(s, (d) => (d.sound = undefined))
                        ); // reset errors
                    }}
                />
                <button
                    type="button"
                    className="block"
                    onClick={() => {
                        audioFile.current?.click();
                    }}>
                    Upload
                </button>
                {errors?.sound?._errors?.map((err) => (
                    <p className="text-red-500" key={err}>
                        {err}
                    </p>
                ))}
                {addedSound != '' ? <p>{addedSound}</p> : undefined}
                <button type="submit" className="mt-10 block bg-gray-400 ">
                    Submit
                </button>
            </form>
        </div>
    );
};
export default AddSound;
