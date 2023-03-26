
import React, { useState } from 'react';
import create from 'zustand';
import produce from 'immer';
import { z } from 'zod';
import { stateDataSchema } from '../utils/schemas';
import useAppStore from './useTempStore';
import {
    CircleStyles,
    Notification,
    Preferences,
    Sessions,
    ThemeOptions,
    Timer,
} from '../utils/classes';
import { Actions, DispatchArgs, reducer } from '../reducers/PermanentStore';
import { Initialized, Nullable } from '../utils/types';

export type PersistentData = Nullable<z.infer<typeof stateDataSchema>>;

interface PermanentState {
    data: PersistentData;
    _isInitiated: boolean,
    _set: (newState: PersistentData) => void;
    dispatch: (args: DispatchArgs) => void
}

const initialDataState: PersistentData = {
    timer: null,
    sessions: null,
    preferences: null,
};

export const usePermanentStore = create<PermanentState>()((set, get) => ({
    data: initialDataState,
    _isInitiated: false,
    _set: (state) => set({ _isInitiated: true, data: state }),
    dispatch: (args) => set(produce<PermanentState>((state => {
        state.data = reducer(state.data, args)
    })))
}))
export default usePermanentStore

export const permanentStore = usePermanentStore.getState