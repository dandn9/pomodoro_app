import produce from 'immer'
import { z } from 'zod'
import type { AddSoundPayload as addSoundSchema } from '../components/preferences/AddSound';
import { Task, Session, Timer, Preferences, Notification, Sessions, ThemeOptions, CircleStyles, Sound } from './classes';
import { o } from '@tauri-apps/api/dialog-15855a2f';

export const taskSchema = z.object({
    id: z.number(),
    name: z.string(),
    is_done: z.boolean(),
});

export type TaskType = z.infer<typeof taskSchema>

export const notificationSchema = z.object({
    _audio_on_pause_id: z.number(),
    _audio_on_timer_id: z.number(),
    _message_on_pause: z.string(),
    _message_on_timer: z.string(),
})

export type NotificationType = z.infer<typeof notificationSchema>

const sessionSchema = z.object({
    _id: z.number(),
    _name: z.string(),
    _color: z.string(),
    _is_selected: z.boolean(),
    _time_spent: z.number(),
    _total_sessions: z.number(),
    _created_at: z.string().datetime({ offset: true }),
    _tasks: z.array(taskSchema),
});

export type SessionType = z.infer<typeof sessionSchema>


/** Beware of the mismatch of types */
type StateType = {
    timer: Timer,
    sessions: Sessions
    preferences: Preferences
}


export const stateDataSchema = z.object({
    timer: z.object({
        _pause_duration: z.number(),
        _long_pause_duration: z.number(),
        _timer_duration: z.number(),

    }),
    sessions: z.object({
        _sessions: z.array(sessionSchema)
    }),
    preferences: z.object({
        _notification: notificationSchema,
        _autoplay: z.boolean(),
        _sessions_for_long_pause: z.number(),
        _available_sounds: z.array(z.object({ _name: z.string(), _file_path: z.string(), _id: z.number() })),
        _show_percentage: z.boolean(),
        _time_to_add: z.number(),
        _resolution: z.tuple([z.number(), z.number()]),
        _theme: z.enum(["Default", "Dark", "White"]),
        _circle_style: z.enum(["Solid", "Dotted", "Drawn"])
    }),
}).transform<StateType>((data) => {
    /** Transform the saved state into the classes so we get the methods */
    const sessions = data.sessions._sessions.map((session: SessionType) => {
        const tasks = session._tasks.map((task) => new Task(task.name, task.id, task.is_done, false));
        return new Session(session._name, session._id, session._color, session._is_selected, session._time_spent, session._total_sessions, new Date(session._created_at), tasks);
    });


    const notification = new Notification(data.preferences._notification._audio_on_pause_id, data.preferences._notification._audio_on_timer_id, data.preferences._notification._message_on_pause, data.preferences._notification._message_on_timer)
    const sounds = data.preferences._available_sounds.map((val) => new Sound(val._id, val._name, val._file_path))
    const transformedState: StateType = {
        preferences: new Preferences(notification, data.preferences._autoplay, data.preferences._sessions_for_long_pause, sounds, data.preferences._show_percentage, data.preferences._time_to_add, data.preferences._resolution, data.preferences._theme as ThemeOptions, data.preferences._circle_style as CircleStyles),
        sessions: new Sessions(sessions),
        timer: new Timer(data.timer._pause_duration, data.timer._long_pause_duration, data.timer._timer_duration)
    }
    return transformedState

})




export type StateDataType = z.infer<typeof stateDataSchema>


// export the type of add Sound Payload
export type AddSoundPayload = addSoundSchema;