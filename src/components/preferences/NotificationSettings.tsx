import React, { useState } from 'react';
import { Preferences } from '../../utils/classes';
import PlayableSound from '../sounds/PlayableSound';
import Modal from '../UI/Modal';
import { AddSoundPayload } from '../../utils/schemas';
import AddSound from './AddSound';
import Input from '../UI/Input';
import { z } from 'zod';
const Notification: React.FC<{ preferences: Preferences }> = ({
    preferences,
}) => {
    const [isAddingSound, setIsAddingSound] = useState(false);

    const onAudioSelect = (id: number) => {
        preferences.setAudioSound(id);
    };
    const onPauseSelect = (id: number) => {
        preferences.setPauseSound(id);
    };
    const onAddAudio = async (pl: AddSoundPayload) => {
        await preferences.addSound(pl);
        setIsAddingSound(false);
    };
    const onDeleteAudio = async (id: number) => {
        await preferences.onDeleteSound(id);
    };
    const onAudioRename = async (id: number, name: string) => {
        await preferences.onRenameAudio(id, name);
    };
    const onChangeMessageOnPause = async (ev: React.ChangeEvent) => {
        const target = ev.target as HTMLInputElement;
        const message = z.string().min(1).parse(target.value);
        preferences.onChangeMessageOnPause(message);
    };

    const onChangeMessageOnTimer = async (ev: React.ChangeEvent) => {
        const target = ev.target as HTMLInputElement;
        const message = z.string().min(1).parse(target.value);
        preferences.onChangeMessageOnTimer(message);
    };
    return (
        <div className="relative">
            <button
                className="absolute top-0 left-full -translate-y-10"
                onClick={() => {
                    setIsAddingSound(true);
                }}>
                Add
            </button>
            <h2 className="text-lg font-bold">Timer Sounds</h2>
            <ul>
                {preferences.available_sounds.map((sound) => (
                    <PlayableSound
                        key={sound.id}
                        sound={sound}
                        onSelect={onAudioSelect}
                        onDelete={onDeleteAudio}
                        onRename={onAudioRename}
                        is_selected={
                            sound.id ===
                            preferences.notification.audio_on_timer_id
                        }
                    />
                ))}
            </ul>
            <hr />
            <h2 className="text-lg font-bold">Pause Sounds</h2>
            <ul>
                {preferences.available_sounds.map((sound) => (
                    <PlayableSound
                        onSelect={onPauseSelect}
                        key={sound.id}
                        sound={sound}
                        is_selected={
                            sound.id ===
                            preferences.notification.audio_on_pause_id
                        }
                    />
                ))}
            </ul>
            <h2 className="text-lg font-bold">Notification text</h2>
            <div className="flex">
                <h4>Timer</h4>
                <Input
                    defaultValue={preferences.notification.message_on_timer}
                    onCommit={onChangeMessageOnTimer}
                />
            </div>
            <div className="flex">
                <h4>Pause</h4>
                <Input
                    defaultValue={preferences.notification.message_on_pause}
                    onCommit={onChangeMessageOnPause}
                />
            </div>
            <Modal open={isAddingSound} setOpen={setIsAddingSound}>
                <AddSound setOpen={setIsAddingSound} onAddSound={onAddAudio} />
            </Modal>
        </div>
    );
};
export default Notification;
