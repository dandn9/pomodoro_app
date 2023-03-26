import React from 'react'
import usePermanentStore from '../store/PermanentStore'
import { PreferencesActions } from '../reducers/PermanentStore'
const Test = () => {
    const workSound = usePermanentStore((state) => state.data.preferences?.notification.workCompletionAudioId)
    const dispatch = usePermanentStore((state) => state.dispatch)

    return <div className='absolute top-1/2'>YO - {workSound} -
        <button onClick={() => { dispatch({ type: PreferencesActions.updateWorkSoundId, payload: { audioOnTimer: workSound! + 1 || 123 } }) }}>CLICK</button>
        `</div>
}
export default Test