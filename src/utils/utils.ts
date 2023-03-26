import useStateStore, { AppStateData } from "../hooks/useStateStore";

export function updateState(newState: AppStateData) {
    useStateStore.getState().setStateData(newState)
}