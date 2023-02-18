import React from 'react';
import { appConfigDir, appDataDir, join } from '@tauri-apps/api/path';
import { readDir, BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs';

const PlayableSound: React.FC<{
    sound: { name: string; file_path: string; id: number };
    is_selected: boolean;
    onSelect: (id: number) => void;
    index?: number;
}> = ({ sound, is_selected, onSelect }) => {
    async function onAudioPlay(ev: React.MouseEvent) {
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
    }
    return (
        <li
            className={`${is_selected ? 'bg-gray-600' : ''}`}
            onClick={onSelect.bind(null, sound.id)}>
            {sound.name} -
            <button className="bg-gray-500" onClick={onAudioPlay}>
                PLAY
            </button>
        </li>
    );
};
export default PlayableSound;
