import { editFormType } from "../../components/sessions/EditSessionModalContent"
import useAppStore from "../../hooks/useTempStore"
import { ChangeSessionOrderArgs, ChangeTaskOrderArgs } from "../types"
import { updateState } from "../utils"




export class Sessions {
    public sessions: Session[]

    constructor(sessions: Session[] = []) {
        this.sessions = sessions

    }

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
    public async saveSessions(sessions: Session[]) {
        try {
            const result = await Sessions.saveSessions(sessions)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }
    public static async onCreateSession(name: string, color: string, tasks: string[]) {
        try {
            const result = await Sessions.createSession(name, color, tasks)
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }

}

export class Session {
    constructor(
        private _name: string,
        private readonly _id: number,
        private _color: string,
        private _is_selected: boolean,
        private readonly _time_spent: number,
        private readonly _total_sessions: number,
        private readonly _created_at: Date,
        private _tasks: Task[]) {
    }

    public get tasks(): Task[] {
        return this._tasks
    }
    public set tasks(value: Task[]) {
        this._tasks = value
    }
    public get created_at(): Date {
        return this._created_at
    }
    public get total_sessions(): number {
        return this._total_sessions
    }
    public get time_spent(): number {
        return this._time_spent
    }
    public get is_selected(): boolean {
        return this._is_selected
    }
    public set is_selected(value: boolean) {
        this._is_selected = value
    }
    public get color(): string {
        return this._color
    }
    public set color(value: string) {
        this._color = value
    }
    public get id(): number {
        return this._id
    }
    public get name(): string {
        return this._name
    }
    public set name(value: string) {
        this._name = value
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
export class Task {
    constructor(
        public name: string,
        public readonly id: number,
        public is_done: boolean,
        public is_draft: boolean) { }

}