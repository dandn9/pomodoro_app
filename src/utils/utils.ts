import useStateStore, { AppStateData } from "../store/PermanentStore";

export function updateState(newState: AppStateData) {
    useStateStore.getState().setStateData(newState)
}

/** Returns a u32 (max u31) number */

export function hashString(value: string): number {
    return value.split('').reduce((hash: number, chr) => (((hash << 6) - hash + chr.charCodeAt(0))) | 0, 0) >>> 1 // shift right to make it always positive
}
