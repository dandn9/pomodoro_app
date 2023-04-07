import { stateUpdater } from "../decorators";
import { immerable } from "immer";
import { hashString } from "../utils";
import { appDataDir, join } from "@tauri-apps/api/path";
import { writeBinaryFile } from "@tauri-apps/api/fs";
import { permanentStore } from "../../store/PermanentStore";



export class Notification {
    [immerable] = true

    // @stateUpdater('preferences')
    private _audio_on_pause_id: number
    private _audio_on_timer_id: number;
    private _message_on_pause: string;
    private _message_on_timer: string;

    constructor(audio_on_pause_id = 0, audio_on_timer_id = 0, message_on_pause = "", message_on_timer = "") {
        this._audio_on_pause_id = audio_on_pause_id
        this._audio_on_timer_id = audio_on_timer_id
        this._message_on_pause = message_on_pause
        this._message_on_timer = message_on_timer
    }

    public get audio_on_pause_id() {
        return this._audio_on_pause_id
    }

    @stateUpdater((data) => data.preferences)
    public set audio_on_pause_id(value: number) {
        this._audio_on_pause_id = value
    }

    public get audio_on_timer_id(): number {
        return this._audio_on_timer_id;
    }

    @stateUpdater((data) => data.preferences)
    public set audio_on_timer_id(value: number) {
        this._audio_on_timer_id = value;
    }

    public get message_on_timer(): string {
        return this._message_on_timer;
    }
    @stateUpdater((data) => data.preferences)
    public set message_on_timer(value: string) {
        this._message_on_timer = value;
    }

    public get message_on_pause(): string {
        return this._message_on_pause;
    }

    @stateUpdater((data) => data.preferences)
    public set message_on_pause(value: string) {
        this._message_on_pause = value;
    }
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
export class Preferences {
    [immerable] = true

    constructor(
        private _notification: Notification,
        private _autoplay: boolean,
        private _sessions_for_long_pause: number,
        private _available_sounds: Sound[],
        private _show_percentage: boolean,
        private _time_to_add: number,
        private _resolution: [number, number],
        private _theme: ThemeOptions,
        private _circle_style: CircleStyles) { }

    public get circle_style(): CircleStyles {
        return this._circle_style;
    }
    @stateUpdater()
    public set circle_style(value: CircleStyles) {
        this._circle_style = value;
    }
    public get theme(): ThemeOptions {
        return this._theme;
    }
    @stateUpdater()
    public set theme(value: ThemeOptions) {
        this._theme = value;
    }
    public get resolution(): [number, number] {
        return this._resolution;
    }
    @stateUpdater()
    public set resolution(value: [number, number]) {
        this._resolution = value;
    }
    public get time_to_add(): number {
        return this._time_to_add;
    }
    @stateUpdater()
    public set time_to_add(value: number) {
        this._time_to_add = value;
    }
    public get show_percentage(): boolean {
        return this._show_percentage;
    }
    @stateUpdater()
    public set show_percentage(value: boolean) {
        this._show_percentage = value;
    }
    public get available_sounds(): Sound[] {
        return this._available_sounds;
    }
    @stateUpdater()
    public set available_sounds(value: Sound[]) {
        this._available_sounds = value;
    }
    public get sessions_for_long_pause(): number {
        return this._sessions_for_long_pause;
    }
    @stateUpdater()
    public set sessions_for_long_pause(value: number) {
        this._sessions_for_long_pause = value;
    }
    public get autoplay(): boolean {
        return this._autoplay;
    }
    @stateUpdater()
    public set autoplay(value: boolean) {
        this._autoplay = value;
    }
    public get notification(): Notification {
        return this._notification;
    }
    @stateUpdater()
    public set notification(value: Notification) {
        this._notification = value;
    }

}


export class Sound {
    [immerable] = true
    private _id: number;
    private _name: string;
    private _file_path: string;

    constructor(id: number, name: string, file_path: string) {
        this._id = id;
        this._name = name;
        this._file_path = file_path
    }

    public get id(): number {
        return this._id;
    }
    @stateUpdater((state) => state.preferences.available_sounds)
    public set id(value: number) {
        this._id = value;
    }
    public get name(): string {
        return this._name;
    }

    @stateUpdater((state) => state.preferences.available_sounds)
    public set name(value: string) {
        this._name = value;
    }
    public get file_path(): string {
        return this._file_path;
    }

    @stateUpdater((state) => state.preferences.available_sounds)
    public set file_path(value: string) {
        this._file_path = value;
    }

    /** Creates the file in the audio folder and returns the object to add to state */
    public static async createSound(name: string, file: File): Promise<Sound> {
        const id = hashString(name)

        const hasSameId = permanentStore().data.preferences.available_sounds.some((val) => val.id === id)
        if (hasSameId) {
            throw new Error("Try another name")
        }

        console.log(name, file)
        const soundBin = await file.arrayBuffer()
        const fileExtension = file.name.split('.').pop()
        const appData = await appDataDir()
        console.log(appData)
        const fullPath = await join(appData, 'audio', `${name}.${fileExtension}`)

        await writeBinaryFile(fullPath, soundBin)
        return new this(id, name, `${name}.${fileExtension}`)


    }
    public static async deleteSound(id: number) {
        const sound = permanentStore().data.preferences.available_sounds.find((s) => s.id === id)
        if (!sound) throw new Error('Something went wrong')


    }
}