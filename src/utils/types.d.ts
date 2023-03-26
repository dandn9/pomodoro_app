export type ChangeTaskOrderArgs = { targetOrder: number, fromOrder: number, sessionIdTarget: number, sessionIdFrom: number }
export type ChangeSessionOrderArgs = { targetOrder: number, fromOrder: number }

export type Nullable<T> = T extends object ? { [P in keyof T]: T[P] | null } : T | null
export type Initialized<T extends PersistentData> = {
    [P in keyof T]: NonNullable<T[P]>
}