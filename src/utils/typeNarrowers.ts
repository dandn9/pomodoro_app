import { Session } from "./classes";

export function isSessionFromId(session: string): boolean {
    if (session.startsWith('sess')) return true;
    else return false
}