import React, { useState } from 'react';
import { Preferences } from '../../utils/classes';
import PlayableSound from '../sounds/PlayableSound';
import Modal from '../UI/Modal';
import { AddSoundPayload } from '../../utils/schemas';
import AddSound from './AddSound';
const Audio: React.FC<{ preferences: Preferences }> = ({ preferences }) => {
    const [isAddingSound, setIsAddingSound] = useState(false);

    const onAudioSelect = (id: number) => {
        preferences.setAudioSound(id);
    };
    const onPauseSelect = (id: number) => {
        preferences.setPauseSound(id);
    };
    const onAddAudio = async (pl: AddSoundPayload) => {
        await preferences.addSound(pl);
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
            <Modal open={isAddingSound} setOpen={setIsAddingSound}>
                <AddSound setOpen={setIsAddingSound} />
            </Modal>
        </div>
    );
};
export default Audio;
