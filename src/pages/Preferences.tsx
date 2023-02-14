import React, { useState } from 'react';
import Slider from '../components/UI/Slider';
import { TimerCommands } from '../utils/commands';
import useStateStore from '../hooks/useStateStore';
import type { AppStateData } from '../hooks/useStateStore';
import * as Tabs from '@radix-ui/react-tabs';
import useAppStore from '../hooks/useAppTempStore';
import produce from 'immer';
import TimerPreferences from '../components/preferences/TimerPreferences';
import AudioPreferences from '../components/preferences/AudioPreferences';

const Preferences = () => {
    const preferences = useStateStore((state) => state.data.preferences);
    const timer = useStateStore((state) => state.data.timer);

    return (
        <div className="flex h-full w-full items-center justify-center">
            <Tabs.Root defaultValue="audio">
                <Tabs.List className="fixed top-5 left-1/2 flex -translate-x-1/2 gap-2 border border-gray-200">
                    <Tabs.Trigger value="timer">Timer</Tabs.Trigger>
                    <Tabs.Trigger value="audio">Audio</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="timer">
                    <TimerPreferences timer={timer} />
                </Tabs.Content>
                <Tabs.Content value="audio">
                    <AudioPreferences preferences={preferences} />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};
export default Preferences;
