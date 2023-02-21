import produce from 'immer'
import { z } from 'zod'
import type { AddSoundPayload as addSoundSchema } from '../components/preferences/AddSound';
import { Task, Session, Timer, Preferences, Notification, Sessions, ThemeOptions, CircleStyles } from './classes';
import { o } from '@tauri-apps/api/dialog-15855a2f';

export const taskSchema = z.object({
    id: z.number(),
    name: z.string(),
    is_done: z.boolean(),
});

export type TaskType = z.infer<typeof taskSchema>

export const notificationSchema = z.object({
    audio_on_pause_id: z.number(),
    audio_on_timer_id: z.number(),
    message_on_pause: z.string(),
    message_on_timer: z.string(),
})

export type NotificationType = z.infer<typeof notificationSchema>

const sessionSchema = z.object({
    id: z.number(),
    name: z.string(),
    color: z.string(),
    is_selected: z.boolean(),
    time_spent: z.number(),
    total_sessions: z.number(),
    created_at: z.string().datetime({ offset: true }),
    tasks: z.array(taskSchema),
});

export type SessionType = z.infer<typeof sessionSchema>


type StateType = {
    timer: Timer,
    sessions: Sessions
    preferences: Preferences
}


export const stateDataSchema = z.object({
    timer: z.object({
        pause_duration: z.number(),
        long_pause_duration: z.number(),
        timer_duration: z.number(),

    }),
    sessions: z.object({ sessions: z.array(sessionSchema) }),
    preferences: z.object({
        notification: notificationSchema,
        autoplay: z.boolean(),
        sessions_to_complete: z.number(),
        sessions_for_long_pause: z.number(),
        available_sounds: z.array(z.object({ name: z.string(), file_path: z.string(), id: z.number() })),
        show_percentage: z.boolean(),
        resolution: z.tuple([z.number(), z.number()]),
        theme: z.enum(["Default", "Dark", "White"]),
        circle_style: z.enum(["Solid", "Dotted", "Drawn"])
    }),
}).transform<StateType>((data) => {
    const sessions = data.sessions.sessions.map((session: SessionType) => {
        const tasks = session.tasks.map((task) => new Task(task.name, task.id, task.is_done, false));
        return new Session(session.name, session.id, session.color, session.is_selected, session.time_spent, session.total_sessions, new Date(session.created_at), tasks);
    });


    const notification = new Notification(data.preferences.notification.audio_on_pause_id, data.preferences.notification.audio_on_timer_id, data.preferences.notification.message_on_pause, data.preferences.notification.message_on_timer)
    const transformedState: StateType = {
        preferences: new Preferences(notification, data.preferences.autoplay, data.preferences.sessions_to_complete, data.preferences.sessions_for_long_pause, data.preferences.available_sounds, data.preferences.show_percentage, data.preferences.resolution, data.preferences.theme as ThemeOptions, data.preferences.circle_style as CircleStyles),
        sessions: new Sessions(sessions),
        timer: new Timer(data.timer.pause_duration, data.timer.long_pause_duration, data.timer.timer_duration)
    }
    return transformedState

})




export type StateDataType = z.infer<typeof stateDataSchema>


// export the type of add Sound Payload
export type AddSoundPayload = addSoundSchema;