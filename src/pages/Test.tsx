import React from 'react'
import usePermanentStore from '../store/PermanentStore'
import { PreferencesActions } from '../reducers/PermanentStore'
const Test = () => {
    const notification = usePermanentStore((state) => state.data.preferences?.notification)
    console.log('re render', notification)

    return <div className='absolute top-1/2'>YO - {notification?.pause_completion_audio_id} -
        <button onClick={() => {
            // notification.workCompletionAudioId += 1;
            // const c = notification.getpauseCompletionAudioId()
            // console.log('cc', c)
            // notification?.setPauseCompletionAudioId(notification?.pauseCompletionAudioId + 1);
            if (notification?.pause_completion_audio_id) {
                notification.pause_completion_audio_id += 1
            }

        }}>CLICK</button>
        `</div>
}
export default Test