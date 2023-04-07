import React, { useState } from 'react';
import { Preferences, Sound } from '../../utils/classes';
import PlayableSound from '../sounds/PlayableSound';
import Modal from '../UI/Modal';
import { AddSoundPayload } from '../../utils/schemas';
import AddSound from './AddSound';
import Input from '../UI/Input';
import { z } from 'zod';
import usePermanentStore from '@/store/PermanentStore';
import { hashString } from '@/utils/utils';
const Notification = () => {
    const preferences = usePermanentStore((state) => state.data.preferences)
    const [isAddingSound, setIsAddingSound] = useState(false);

    const onAddAudio = async (pl: AddSoundPayload) => {
        try {
            const newSound = await Sound.createSound(pl.name, pl.sound)
            preferences.available_sounds = [...preferences.available_sounds, newSound]
            setIsAddingSound(false);
        } catch (e) {
            console.log(e) // TODO: show error message
        }
    };
    const onAudioRename = async (id: number, name: string) => {
        const sound = preferences.available_sounds.find((sound) => sound.id === id);
        if (sound) {
            /** Recompute id because its based on name */
            sound.name = name
            /** Setting id is always last, since the decorator uses it in this case since its array */
            const newId = hashString(name)
            sound.id = newId
        }
    };
    const onChangeMessageOnPause = async (ev: React.ChangeEvent) => {
        const target = ev.target as HTMLInputElement;
        const message = z.string().min(1).parse(target.value);
        preferences.notification.message_on_pause = message
    };

    const onChangeMessageOnTimer = async (ev: React.ChangeEvent) => {
        const target = ev.target as HTMLInputElement;
        const message = z.string().min(1).parse(target.value);
        preferences.notification.message_on_timer = message
    };
    console.log(preferences)
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
                        onSelect={(id) => preferences.notification.audio_on_timer_id = id}
                        onDelete={
                            (id) => preferences.available_sounds = preferences.available_sounds.filter((s) => s.id !== id)}

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
                        onSelect={(id) => preferences.notification.audio_on_pause_id = id}
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
