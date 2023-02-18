import React, { useState } from 'react';
import create from 'zustand';
import produce from 'immer';
import { z } from 'zod';
import { stateDataSchema } from '../utils/schemas';
import useAppStore from './useAppTempStore';
import { Notification, Preferences, Sessions, Timer } from '../utils/classes';

export type AppStateData = z.infer<typeof stateDataSchema>;

interface AppState {
    data: AppStateData;
    setStateData: (newState: AppStateData) => void;
    getSessions: () => AppStateData['sessions']['sessions'];
}

const initialDataState: AppStateData = {
    timer: new Timer(0, 0, 0),
    sessions: new Sessions([]),
    preferences: new Preferences(
        new Notification(0, 0, '', ''),
        false,
        false,
        0,
        0,
        [],
        false,
        [0, 0]
    ),
};

export const useStateStore = create<AppState>()((set, get) => ({
    data: initialDataState,
    setStateData: (newStateData: AppStateData) => {
        set((state) =>
            produce(state, (draft) => {
                const new_state = stateDataSchema.parse(newStateData);
                draft.data = new_state;
            })
        );
        useAppStore.getState().resetState();
    },
    getSessions: () => {
        return get().data.sessions.sessions;
    },
}));

export default useStateStore;
