import { TimerCommands } from "../commands";
import { updateState } from "../utils";
export class Timer extends TimerCommands {
    constructor(
        public pause_duration: number = 0,
        public long_pause_duration: number = 0,
        public timer_duration: number = 0) {
        super();
    }
    public async onTimerDuration(timerDuration: number) {
        try {
            const result = await Timer.setTimerDuration(timerDuration)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onPauseDuration(pauseDuration: number) {
        try {
            const result = await Timer.setPauseDuration(pauseDuration)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onLongPauseDuration(longPauseDuration: number) {
        try {
            const result = await Timer.setLongPauseDuration(longPauseDuration)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
}