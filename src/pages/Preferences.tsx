import React, { useState } from 'react';
import Slider from '../components/UI/Slider';
import { permanentStore, usePermanentStore } from '../store/PermanentStore';
import * as Tabs from '@radix-ui/react-tabs';
import useAppStore from '../hooks/useTempStore';
import produce from 'immer';
import TimerPreferences from '../components/preferences/TimerPreferences';
import NotificationPreferences from '../components/preferences/NotificationSettings';
import SettingsPreferences from '../components/preferences/SettingsPreferences';

const Preferences = () => {

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
                    <TimerPreferences />
                </Tabs.Content>
                <Tabs.Content value="notification">
                    <NotificationPreferences />
                </Tabs.Content>
                <Tabs.Content value="settings">
                    <SettingsPreferences />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};
export default Preferences;
