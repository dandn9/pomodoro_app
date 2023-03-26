import useStateStore, { AppStateData } from "../store/PermanentStore";

export function updateState(newState: AppStateData) {
    useStateStore.getState().setStateData(newState)
}