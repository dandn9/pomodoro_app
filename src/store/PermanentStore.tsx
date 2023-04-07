
import create from 'zustand';
import { z } from 'zod';
import { stateDataSchema } from '../utils/schemas';
import { Nullable } from '../utils/types';
import { Timer, Preferences } from '../utils/classes';

export type PermanentData = z.infer<typeof stateDataSchema>;

export interface PermanentState {
    data: PermanentData;
    _isInitiated: boolean,
    _set: (newState: PermanentData) => void;
    mutate: (arg: (state: PermanentState) => PermanentState) => void;
}


export const usePermanentStore = create<PermanentState>()((set, get) => ({
    // @ts-ignore - this will get updated when the app starts.. so it will be undefined, but nothing will fetch from it - so it's better to just ignore it at init and pretend its always filled
    data: undefined,
    _isInitiated: false,
    _set: (state) => set({ _isInitiated: true, data: state }),
    mutate: set,
}))
export default usePermanentStore

export const permanentStore = usePermanentStore.getState