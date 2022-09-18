import { invoke } from "@tauri-apps/api/tauri";

export async function saveSession(label: string, duration: number) {
    try {

        const res = invoke('save_session', { label, duration })
        console.log(res)
    }
    catch (e) {

        console.log("error", e)
    }
}

export async function deleteSession(id: number) {
    try {
        const res = await invoke("remove_session", { sessionId: id })
        console.log(res)

    } catch (e) {
        console.log("error", e)
    }
}