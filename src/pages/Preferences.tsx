import React, { useState } from 'react';
import Slider from '../components/UI/Slider';
import { TimerCommands } from '../utils/commands';
import useStateStore from '../hooks/useStateStore';
import type { AppStateData } from '../hooks/useStateStore';
import * as Tabs from '@radix-ui/react-tabs';
import useAppStore from '../hooks/useAppTempStore';
import produce from 'immer';
import TimerPreferences from '../components/preferences/TimerPreferences';
import NotificationPreferences from '../components/preferences/NotificationSettings';
import SettingsPreferences from '../components/preferences/SettingsPreferences';

const Preferences = () => {
    const preferences = useStateStore((state) => state.data.preferences);
    const timer = useStateStore((state) => state.data.timer);

    return (
        <div className="flex h-full w-full items-center justify-center">
            <Tabs.Root defaultValue="settings">
                <Tabs.List className="fixed top-5 left-1/2 flex -translate-x-1/2 gap-2 border border-gray-200">
                    <Tabs.Trigger value="timer">Timer</Tabs.Trigger>
                    <Tabs.Trigger value="notification">
                        Notification
                    </Tabs.Trigger>
                    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="timer">
                    <TimerPreferences timer={timer} />
                </Tabs.Content>
                <Tabs.Content value="notification">
                    <NotificationPreferences preferences={preferences} />
                </Tabs.Content>
                <Tabs.Content value="settings">
                    <SettingsPreferences preferences={preferences} />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};
export default Preferences;
