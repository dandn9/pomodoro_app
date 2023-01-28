import useAppStore from "../hooks/useAppTempStore";
import { SessionCommands, TimerCommands } from "./commands";
import useStateStore from "../hooks/useStateStore";
import type { editFormType } from "../components/sessions/EditSessionModalContent";

export class Task {
    constructor(
        public name: string,
        public readonly id: number,
        public is_done: boolean,
        public order: number,
        public is_draft: boolean) { }

    public setIsDone(is_done: boolean) {
        this.is_done = is_done
        return this
    }
    public setName(name: string) {
        this.name = name;
        return this
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
        useStateStore.getState().setStateData(newState);



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
        useStateStore.getState().setStateData(newState);
    }
    public async update(formData: editFormType) {
        const tasks = formData.tasks.map((task) => new Task(task.name, task.id, task.is_done, task.order, false))
        this.name = formData.name;
        this.color = formData.color;
        this.is_selected = formData.is_selected === 'on' ? true : false;
        this.tasks = tasks;
        const newState = await Session.updateSession(this);
        useStateStore.getState().setStateData(newState);
    }
}
export class Timer extends TimerCommands {
    constructor(
        public pause_duration: number,
        public long_pause_duration: number,
        public timer_duration: number) {
        super();
    }
}
export class Notification {
    constructor(
        public audio_on_pause: string,
        public audio_on_timer: string,
        public message_on_pause: string,
        public message_on_timer: string) { }
}
export class Preferences {
    constructor(
        public notification: Notification,
        public autoplay: boolean,
        public enable_sessions: boolean,
        public sessions_to_complete: number,
        public sessions_for_long_pause: number,
        public available_sounds: string[],
        public show_percentage: boolean,
        public resolution: [number, number]) { }
}