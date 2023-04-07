import { editFormType } from "../../components/sessions/EditSessionModalContent"
import useAppStore from "../../hooks/useTempStore"
import { ChangeSessionOrderArgs, ChangeTaskOrderArgs } from "../types"
import { updateState } from "../utils"




export class Sessions {
    private _sessions: Session[]

    constructor(sessions: Session[] = []) {
        this._sessions = sessions

    }

    public get sessions(): Session[] {
        return this._sessions
    }
    public set sessions(value: Session[]) {
        this._sessions = value
    }

    [Symbol.iterator]() {
        let i = 0;
        return {
            next: () => {
                if (i < this.sessions.length) {
                    return { value: this.sessions[i++], done: false }
                } else {
                    return { done: true }
                }
            }
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

    public static createSession(name: string, color: string, tasks?: Task[]) { }
}
export class Task {
    constructor(
        public name: string,
        public readonly id: number,
        public is_done: boolean,
        public is_draft: boolean) { }

}