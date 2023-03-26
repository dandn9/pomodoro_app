import { editFormType } from "../../components/sessions/EditSessionModalContent"
import useAppStore from "../../hooks/useAppTempStore"
import { SessionCommands, SessionsCommands } from "../commands"
import { ChangeSessionOrderArgs, ChangeTaskOrderArgs } from "../types"
import { updateState } from "../utils"




export class Sessions extends SessionsCommands {
    public sessions: Session[]
    constructor(sessions: Session[]) {
        super()
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
export class Task {
    constructor(
        public name: string,
        public readonly id: number,
        public is_done: boolean,
        public is_draft: boolean) { }

}