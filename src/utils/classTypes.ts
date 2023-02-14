import useAppStore from "../hooks/useAppTempStore";
import { PreferencesCommands, SessionCommands, SessionsCommands, TimerCommands } from "./commands";
import useStateStore from "../hooks/useStateStore";
import type { editFormType } from "../components/sessions/EditSessionModalContent";
import { ChangeSessionOrderArgs, ChangeTaskOrderArgs, } from "./types";
import { updateState } from "./utils";

export class Task {
    constructor(
        public name: string,
        public readonly id: number,
        public is_done: boolean,
        public is_draft: boolean) { }

}



export class Sessions extends SessionsCommands {
    constructor(
        public sessions: Session[]
    ) { super() }

    public async onUpdateTaskOrder(data: ChangeTaskOrderArgs) {
        try {
            const result = await Sessions.updateTaskOrder(data)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public async onUpdateSessionOrder(data: ChangeSessionOrderArgs) {
        try {
            const result = await Sessions.updateSessionOrder(data)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }

    }

}

export class Session extends SessionCommands {
    constructor(
        public name: string,
        public readonly id: number,
        public color: string,
        public is_selected: boolean,
        public readonly time_spent: number,
        public readonly total_sessions: number,
        public readonly created_at: Date,
        public tasks: Task[]) {
        super();
    }
    public async selected() {
        const newState = await Session.onSelectedSession(this.id)
        updateState(newState)
        const selectedSession = newState.sessions.sessions.find((session) => session.is_selected);
        if (selectedSession) {
            useAppStore.getState().setSession(selectedSession);
        } else {
            throw new Error('No session selected')
        }
    }
    public async delete() {
        const newState = await Session.deleteSession(this.id)
        console.log('new state received!', newState)
        updateState(newState)
    }
    public async update(formData: editFormType) {
        const tasks = formData.tasks.map((task) => new Task(task.name, task.id, task.is_done, false))
        this.name = formData.name;
        this.color = formData.color;
        this.is_selected = formData.is_selected === 'on' ? true : false;
        this.tasks = tasks;
        const newState = await Session.updateSession(this);
        updateState(newState)
    }
    public async updateTaskDone(taskId: number, checked: boolean) {
        try {

            const result = await Session.updateDoneTask(taskId, this.id, checked);
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
}
export class Timer extends TimerCommands {
    constructor(
        public pause_duration: number,
        public long_pause_duration: number,
        public timer_duration: number) {
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

}