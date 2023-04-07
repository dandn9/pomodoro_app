import useStateStore, { usePermanentStore } from '../../store/PermanentStore';
import produce from 'immer';
import useAppStore from '../../hooks/useTempStore';
import Slider from '../UI/Slider';
import { Timer } from '../../utils/classes';
import React from 'react';
const TimerPreferences: React.FC = () => {

    const timer = usePermanentStore((state) => state.data.timer)


    return (
        <ul>
            <li>
                <p>Timer duration</p>
                <Slider
                    min={1}
                    max={5000}
                    defaultValue={[timer.timer_duration]}
                    onValueCommit={(val) => { timer.timer_duration = val[0] }
                    }
                />
                {timer.timer_duration}
            </li>
            <li>
                <p>Pause duration</p>
                <Slider
                    min={1}
                    max={5000}
                    defaultValue={[timer.pause_duration]}
                    onValueCommit={(val) => { timer.pause_duration = val[0] }
                    }
                />
                {timer.pause_duration}
            </li>
            <li>
                <p>Long pause duration</p>
                <Slider
                    min={1}
                    max={5000}
                    defaultValue={[timer.long_pause_duration]}
                    onValueCommit={(val) => { timer.long_pause_duration = val[0] }
                    }
                />
                {timer.long_pause_duration}
            </li>
        </ul>
    );
};
export default TimerPreferences;
