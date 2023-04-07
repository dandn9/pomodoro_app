import { immerable } from "immer";
import { stateUpdater } from "../decorators";
import { updateState } from "../utils";
export class Timer {
    [immerable] = true

    constructor(
        private _pause_duration: number = 0,
        private _long_pause_duration: number = 0,
        private _timer_duration: number = 0) {
    }
    public get timer_duration(): number {
        return this._timer_duration;
    }
    @stateUpdater()
    public set timer_duration(value: number) {
        this._timer_duration = value;
    }
    public get long_pause_duration(): number {
        return this._long_pause_duration;
    }
    @stateUpdater()
    public set long_pause_duration(value: number) {
        this._long_pause_duration = value;
    }
    public get pause_duration(): number {
        return this._pause_duration;
    }
    @stateUpdater()
    public set pause_duration(value: number) {
        this._pause_duration = value;
    }
}