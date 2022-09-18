import { invoke } from "@tauri-apps/api/tauri";
import useStore from '../hooks/useStore'


function updateSessionState() {
    useStore.getState().loadSessions()
}

export async function saveSession(label: string, duration: number) {
    try {

        const res = invoke('save_session', { label, duration }).then(() => {
            updateSessionState()
        })
        console.log(res)
    }
    catch (e) {

        console.log("error", e)
    }
}

export async function deleteSession(id: number) {
    try {
        const res = await invoke("remove_session", { sessionId: id }).then((res) => {
            updateSessionState()
        })
        console.log(res)

    } catch (e) {
        console.log("error", e)
    }
}

export async function setSessionSelected(id: number) {
    try {
        const currSession = useStore.getState().currSession;
        if (currSession && currSession.id !== id && useStore.getState().mode === "timer") {
            let timePassed = 0;
            if (useStore.getState().interruptedTime > 0) {
                timePassed = useStore.getState().interruptedTime - useStore.getState().currTimer
            } else {
                timePassed = useStore.getState().timer - useStore.getState().currTimer;
            }


            saveSession(currSession.label, timePassed)
            useStore.setState((state) => { state.interruptedTime = useStore.getState().currTimer })
        }

        const res = await invoke("set_session_selected", { sessionId: id }).then((res) => {
            updateSessionState()
            useStore.setState((state) => { state.isRunning = false })
        })
        console.log(res)
    } catch (e) {
        console.log("error", e)
    }
}