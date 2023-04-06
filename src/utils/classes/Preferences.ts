import { removeFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { PreferencesCommands } from "../commands";
import { AddSoundPayload } from "../schemas";
import { updateState } from "../utils";
import { appDataDir, join } from "@tauri-apps/api/path";
import { stateUpdater } from "../decorators";
import produce, { immerable } from "immer";
import usePermanentStore from "../../store/PermanentStore";



export class Notification {
    [immerable] = true

    // @stateUpdater('preferences')
    private _pause_completion_audio_id: number
    private _work_completion_audio_id: number;
    private _message_on_pause: string;
    private _message_on_timer: string;

    constructor(pause_completion_audio_id = 0, work_completion_audio_id = 0, message_on_pause = "", message_on_timer = "") {
        this._pause_completion_audio_id = pause_completion_audio_id
        this._work_completion_audio_id = work_completion_audio_id
        this._message_on_pause = message_on_pause
        this._message_on_timer = message_on_timer
    }

    public get pause_completion_audio_id() {
        return this._pause_completion_audio_id
    }

    @stateUpdater((data) => data.preferences)
    public set pause_completion_audio_id(value: number) {
        this._pause_completion_audio_id = value
    }

    public get work_completion_audio_id(): number {
        return this._work_completion_audio_id;
    }

    @stateUpdater((data) => data.preferences)
    public set work_completion_audio_id(value: number) {
        this._work_completion_audio_id = value;
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
        private _available_sounds: { name: string; file_path: string; id: number; }[],
        private _show_percentage: boolean,
        private _time_to_add: number,
        private _resolution: [number, number],
        private _theme: ThemeOptions,
        private _circleStyle: CircleStyles) { }

    public get circleStyle(): CircleStyles {
        return this._circleStyle;
    }
    @stateUpdater()
    public set circleStyle(value: CircleStyles) {
        this._circleStyle = value;
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
    public get available_sounds(): { name: string; file_path: string; id: number; }[] {
        return this._available_sounds;
    }
    @stateUpdater()
    public set available_sounds(value: { name: string; file_path: string; id: number; }[]) {
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