import { removeFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { PreferencesCommands } from "../commands";
import { AddSoundPayload } from "../schemas";
import { updateState } from "../utils";
import { appDataDir, join } from "@tauri-apps/api/path";

export class Notification {
    constructor(
        public audio_on_pause_id: number,
        public audio_on_timer_id: number,
        public message_on_pause: string,
        public message_on_timer: string) { }
}
export class Preferences extends PreferencesCommands {
    constructor(
        public notification: Notification,
        public autoplay: boolean,
        public enable_sessions: boolean,
        public sessions_to_complete: number,
        public sessions_for_long_pause: number,
        public available_sounds: { name: string, file_path: string, id: number }[],
        public show_percentage: boolean,
        public resolution: [number, number]) { super(); }


    public async setAudioSound(id: number) {
        try {
            const result = await Preferences.setAudioSoundById(id)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }

    public async setPauseSound(id: number) {
        try {
            const result = await Preferences.setPauseSoundById(id)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async addSound(pl: AddSoundPayload) {
        const soundBin = await pl.sound.arrayBuffer()
        const fileExtension = pl.sound.name.split('.').pop()
        const appData = await appDataDir()
        const fullPath = await join(appData, 'audio', `${pl.name}.${fileExtension}`)

        try {
            await writeBinaryFile(fullPath, soundBin)
            const result = await Preferences.addSound(pl.name, `${pl.name}.${fileExtension}`)
            updateState(result)

        } catch (e) {
            console.log('error! removing file', e) // just simply overrides it?
        }

    }
}