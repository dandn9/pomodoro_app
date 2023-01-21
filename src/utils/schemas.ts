
import { z } from 'zod'

export const taskSchema = z.object({
    id: z.number(),
    name: z.string(),
    is_done: z.boolean(),
});

export type TaskType = z.infer<typeof taskSchema>

export const notificationSchema = z.object({
    audio_on_pause: z.string(),
    audio_on_timer: z.string(),
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
        enable_sessions: z.boolean(),
        sessions_to_complete: z.number(),
        sessions_for_long_pause: z.number(),
        available_sounds: z.array(z.string()),
        show_percentage: z.boolean(),
        resolution: z.tuple([z.number(), z.number()]),
    }),
});

export type StateDataType = z.infer<typeof stateDataSchema> 