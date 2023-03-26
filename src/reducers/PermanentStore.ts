import { PersistentData } from "../hooks/usePermanentStore";

export enum Actions {
}
export enum PreferencesActions {


}
export type DispatchArgs = { type: Actions, payload: any }


export function reducer(state: PersistentData, { type, payload }: DispatchArgs): PersistentData {
    return state

}