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

export enum ThemeOptions {
    Default = "Default",
    Dark = "Dark",
    White = "White"
}
export enum CircleStyles {
    Solid = "Solid",
    Dotted = "Dotted",
    Drawn = "Drawn"
}
export class Preferences extends PreferencesCommands {
    constructor(
        public notification: Notification,
        public autoplay: boolean,
        public sessions_for_long_pause: number,
        public available_sounds: { name: string, file_path: string, id: number }[],
        public show_percentage: boolean,
        public time_to_add: number,
        public resolution: [number, number], public theme: ThemeOptions, public circleStyle: CircleStyles) { super(); }


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
    public async onDeleteSound(id: number) {
        try {
            const result = await Preferences.deleteSound(id)
            updateState(result)
        } catch (e) {
            console.log('error!', e)
        }
    }
    public async onRenameAudio(id: number, name: string) {
        try {
            const result = await Preferences.renameSound(id, name)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onChangeTheme(theme: ThemeOptions) {
        try {
            const result = await Preferences.changeTheme(theme)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onChangeCircleStyle(style: CircleStyles) {
        try {
            const result = await Preferences.changeCircleStyle(style)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onSetAutoplay(autoplay: boolean) {
        try {

            const result = await Preferences.setAutoplay(autoplay)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onSetShowPercentage(showPercentage: boolean) {
        try {
            const result = await Preferences.setShowPercentage(showPercentage)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }

    public async onChangeAppResolution(resolution: [number, number]) {

        try {
            const result = await Preferences.changeAppResolution(resolution)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onSetSessionsForLongPause(sessionsNumber: number) {

        try {
            const result = await Preferences.setSessionsForLongPause(sessionsNumber)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onSetTimeToAdd(timeToAdd: number) {
        try {
            const result = await Preferences.setTimeToAdd(timeToAdd)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onChangeMessageOnPause(message: string) {
        try {
            const result = await Preferences.changeMessageOnPause(message)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onChangeMessageOnTimer(message: string) {
        try {
            const result = await Preferences.changeMessageOnTimer(message)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
}