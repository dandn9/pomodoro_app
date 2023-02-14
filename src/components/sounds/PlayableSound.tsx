import React from 'react';
import { appConfigDir } from '@tauri-apps/api/path';
import { readDir, BaseDirectory } from '@tauri-apps/api/fs';

const PlayableSound: React.FC<{
    sound: { name: string; file_path: string; id: number };
    is_selected: boolean;
    onSelect: (id: number) => void;
}> = ({ sound, is_selected, onSelect }) => {
    async function onAudioPlay() {
        const audio = new Audio(`/assets/audio/${sound.file_path}`);
        audio.play();
    }
    console.log('render!');
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
