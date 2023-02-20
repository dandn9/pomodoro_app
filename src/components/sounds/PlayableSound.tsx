import React, { useRef, useState } from 'react';
import { appConfigDir, appDataDir, join } from '@tauri-apps/api/path';
import { readDir, BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs';
import Popover from '../UI/Popover';
import Input from '../UI/TextInput';
import { z } from 'zod';

const PlayableSound: React.FC<{
    sound: { name: string; file_path: string; id: number };
    is_selected: boolean;
    onSelect: (id: number) => void;
    onDelete?: (id: number) => void;
    onRename?: (id: number, name: string) => void;
    index?: number;
}> = ({ sound, is_selected, onSelect, onDelete, onRename }) => {
    const [isPopover, setPopover] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const onAudioPlay = async (ev: React.MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        const settings = await appDataDir();
        const audioFile = await join(settings, 'audio', sound.file_path);
        const audioBuf = (await readBinaryFile(audioFile)).buffer;

        const audioCtx = new AudioContext();

        const audio = await audioCtx.decodeAudioData(audioBuf);
        const source = audioCtx.createBufferSource();
        source.buffer = audio;
        source.connect(audioCtx.destination);
        source.start();
    };

    const onRenameToggle = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        if (!isRenaming) inputRef.current?.focus(); // if it was falsy
        setIsRenaming(!isRenaming);
    };
    const onRenameHandle = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key == 'Enter' && inputRef.current && onRename) {
            const rename = z.string().min(1).parse(inputRef.current.value);
            onRename(sound.id, rename);
        }
    };

    return (
        <li
            className={`${is_selected ? 'bg-gray-700' : ''}`}
            onClick={onSelect.bind(null, sound.id)}>
            <input
                defaultValue={sound.name}
                className={`bg-gray-800 disabled:bg-transparent ${
                    isRenaming ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
                onKeyDown={onRenameHandle}
                ref={inputRef}
            />
            <button className="bg-gray-500" onClick={onAudioPlay}>
                PLAY
            </button>
            {onDelete && (
                <Popover
                    open={isPopover}
                    side="top"
                    openSetter={setPopover}
                    content={
                        <PopoverContent
                            onConfirm={() => {
                                onDelete(sound.id);
                            }}
                            onDecline={() => {
                                setPopover(false);
                            }}
                        />
                    }>
                    <button
                        className="ml-4 bg-gray-500 text-red-600"
                        onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            setPopover(true);
                        }}>
                        DELETE
                    </button>
                </Popover>
            )}

            <button
                className="ml-4 bg-gray-500 text-blue-200"
                onClick={onRenameToggle}>
                RENAME
            </button>
        </li>
    );
};
export default PlayableSound;

const PopoverContent: React.FC<{
    onConfirm: () => void;
    onDecline: () => void;
}> = ({ onConfirm, onDecline }) => {
    return (
        <div>
            <h3>Are you sure?</h3>
            <button onClick={onConfirm}>yes</button>
            <button onClick={onDecline}>no</button>
        </div>
    );
};
