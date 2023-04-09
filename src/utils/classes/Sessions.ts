import { permanentStore } from "@/store/PermanentStore"
import { editFormType } from "../../components/sessions/EditSessionModalContent"
import useAppStore from "../../hooks/useTempStore"
import { ChangeSessionOrderArgs, ChangeTaskOrderArgs } from "../types"
import { hashString, updateState } from "../utils"
import { immerable } from "immer"
import { stateUpdater } from "../decorators"
import { ZodError } from "zod"




export class Sessions {
    [immerable] = true
    private _sessions: Session[]

    constructor(sessions: Session[] = []) {
        this._sessions = sessions
    }

    public get sessions(): Session[] {
        return this._sessions
    }

    @stateUpdater()
    public set sessions(value: Session[]) {
        this._sessions = value
    }






}

export class Session {
    constructor(
        private _name: string,
        private _id: number,
        private _color: string,
        private _is_selected: boolean,
        private _time_spent: number,
        private _total_sessions: number,
        private _created_at: Date,
        private _tasks: Task[]) {
    }

    public get tasks(): Task[] {
        return this._tasks
    }
    @stateUpdater((data) => data.sessions.sessions)
    public set tasks(value: Task[]) {
        this._tasks = value
    }
    public get created_at(): Date {
        return this._created_at
    }
    @stateUpdater((data) => data.sessions.sessions)
    public set created_at(value: Date) {
        this._created_at = value
    }
    public get total_sessions(): number {
        return this._total_sessions
    }
    @stateUpdater((data) => data.sessions.sessions)
    public set total_sessions(value: number) {
        this._total_sessions = value
    }
    public get time_spent(): number {
        return this._time_spent
    }
    @stateUpdater((data) => data.sessions.sessions)
    public set time_spent(value: number) {
        this.time_spent = value
    }
    public get is_selected(): boolean {
        return this._is_selected
    }
    @stateUpdater((data) => data.sessions.sessions)
    public set is_selected(value: boolean) {
        this._is_selected = value
    }
    public get color(): string {
        return this._color
    }

    @stateUpdater((data) => data.sessions.sessions)
    public set color(value: string) {
        this._color = value
    }
    public get id(): number {
        return this._id
    }

    @stateUpdater((data) => data.sessions.sessions)
    public set id(value: number) {
        this._id = value
    }
    public get name(): string {
        return this._name
    }
    @stateUpdater((data) => data.sessions.sessions)
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
        // to check if there are still references to the session, preventing it to get gc'd - it shouldnt tho tbf 
        permanentStore().data.sessions.sessions = permanentStore().data.sessions.sessions.filter((s) => s.id !== this.id)
    }
    public async update(formData: editFormType) {

        const tasks = formData.tasks.map((task) => Task.createTask(task.name, task.is_done))
        this.name = formData.name;
        this.color = formData.color;
        this.is_selected = formData.is_selected === 'on' ? true : false;
        this.tasks = tasks;
        this.id = hashString(this.name) // recompute id 
    }
    public async updateTaskDone(taskId: number, checked: boolean) {
        try {

            const result = await Session.updateDoneTask(taskId, this.id, checked);
            updateState(result)
        } catch (e) {
            console.log('error', e)
        }
    }


    public static createSession(name: string, color: string, tasks?: string[]): Session {
        const id = hashString(name)
        if (permanentStore().data.sessions.sessions.some((s) => s.id === id)) throw new Error("Cannot have the same session name")
        const sessionTasks = tasks?.map((name) => Task.createTask(name, false)) ?? []

        return new Session(name, id, color, true, 0, 0, new Date(), sessionTasks)



    }
}
export class Task {
    constructor(
        public name: string,
        public readonly id: number,
        public is_done: boolean,
    ) { }

    public static createTask(name: string, is_done: boolean): Task {
        const id = hashString(name)

        return new Task(name, id, is_done)

    }

}