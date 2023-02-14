import React from 'react';
import { Preferences } from '../../utils/classTypes';
import PlayableSound from '../sounds/PlayableSound';
const Audio: React.FC<{ preferences: Preferences }> = ({ preferences }) => {
    const onAudioSelect = (id: number) => {
        preferences.setAudioSound(id);
    };

    return (
        <div>
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
                        onSelect={onAudioSelect}
                        key={sound.id}
                        sound={sound}
                        is_selected={
                            sound.id ===
                            preferences.notification.audio_on_pause_id
                        }
                    />
                ))}
            </ul>
        </div>
    );
};
export default Audio;
