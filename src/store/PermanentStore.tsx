
import React, { useState } from 'react';
import create from 'zustand';
import produce from 'immer';
import { z } from 'zod';
import { stateDataSchema } from '../utils/schemas';
// import useAppStore from './useTempStore';
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

export type PermanentData = Nullable<z.infer<typeof stateDataSchema>>;

export interface PermanentState {
    data: PermanentData;
    _isInitiated: boolean,
    _set: (newState: PermanentData) => void;
    mutate: (arg: (state: PermanentState) => PermanentState) => void;
}

const initialDataState: PermanentData = {
    timer: null,
    sessions: null,
    preferences: null,
};




export const usePermanentStore = create<PermanentState>()((set, get) => ({
    data: initialDataState,
    _isInitiated: false,
    _set: (state) => set({ _isInitiated: true, data: state }),
    mutate: set,
}))
export default usePermanentStore

export const permanentStore = usePermanentStore.getState