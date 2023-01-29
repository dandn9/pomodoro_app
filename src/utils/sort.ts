import { Session } from "./classTypes";

export function sortSessionsTasks(sessions: Session[]) {
    const result = sessions.map((session) => {
        session.tasks.sort((a, b) => a.order > b.order ? 1 : -1)
        return session
    })
    return result
}