import { invoke } from "@tauri-apps/api/tauri";

export async function saveSession(label: string, duration: number) {
    invoke('save_session', { label, duration }).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log("error", err)
    })
}