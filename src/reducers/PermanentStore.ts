import { WritableDraft } from "immer/dist/internal";
import { PersistentData } from "../store/PermanentStore";
import { Initialized } from "../utils/types";

/**
 * Actions will be identified by a *_ identifier
 * P = Preference
 * T = Timer
 * S = Sessions
 * 
 * For easier splitting of code and structures
 *  ~~could make it an enum but too much work 
 */

export enum PreferencesActions {
    setAutoplay = `P_setAutoplay`,
    setShowPercentage = 'P_setShowPercentage',
    addSound = 'P_addSound',
    deleteSound = 'P_deleteSound',
    updateSoundName = 'P_updateSoundName',
    updateTheme = 'P_updateTheme',
    updateCircleStyle = 'P_updateCircleStyle',
    updateWorkSoundId = 'P_updateWorkSound',
    updatePauseSoundId = 'P_updatePauseSound',
    updateAppResolution = 'P_updateAppResolution',
    updateSessionsForLongPause = 'P_updateSessionsForLongPause',
    updateTimeToAdd = 'P_updateTimeToAdd',
    updateMessageOnPauseFinished = 'P_updateMessageOnPauseFinished',
    updateMessageOnWorkFinished = 'P_updateMessageOnWorkFinished'
}
export enum TimerActions {
    X = ''
}
export type Actions = PreferencesActions | TimerActions
export type DispatchArgs = { type: Actions, payload: any }



export function reducer(state: WritableDraft<PersistentData>, { type, payload }: DispatchArgs): PersistentData {
    const identifier = (type as string).split('_')[0]


    /**
     * This function gets called only after the state has been initialized
     */
    if (identifier === 'P') {
        return preferenceReducer(state as Initialized<typeof state>, { payload, type: type as PreferencesActions })
    } else if (identifier === 'T') { } else if (identifier === 'S') {

    }



    return state
}




/**
 * PREFERENCE REDUCER
 */
function preferenceReducer(state: Initialized<PersistentData>, { type, payload }: { type: PreferencesActions, payload: any }): PersistentData {

    switch (type) {
        case PreferencesActions.updateWorkSoundId:
            state.preferences.notification.workCompletionAudioId = payload.workCompletionAudioId
            break
        case PreferencesActions.updatePauseSoundId:
            state.preferences.notification.pauseCompletionAudioId = payload.pauseCompletionAudioId
            break
        case PreferencesActions.addSound:
            break
        case PreferencesActions.deleteSound:
            break
        case PreferencesActions.updateSoundName:
            break
        case PreferencesActions.updateTheme:
            break
        case PreferencesActions.updateCircleStyle:
            break
        case PreferencesActions.setShowPercentage:
            break
        case PreferencesActions.updateAppResolution:
            break
        case PreferencesActions.updateMessageOnPauseFinished:
            break
        case PreferencesActions.updateMessageOnWorkFinished:
            break
        case PreferencesActions.updateSessionsForLongPause:
            break
        case PreferencesActions.setAutoplay:
            break
        case PreferencesActions.updateTimeToAdd:
            break

    }

    return state

}