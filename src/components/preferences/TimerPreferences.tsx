import useStateStore, { AppStateData } from '../../hooks/useStateStore';
import produce from 'immer';
import useAppStore from '../../hooks/useAppTempStore';
import Slider from '../UI/Slider';
import { TimerCommands } from '../../utils/commands';
import { Timer } from '../../utils/classTypes';
import React from 'react';
const TimerPreferences: React.FC<{ timer: Timer }> = ({ timer }) => {
    const appStore = useStateStore((state) => ({
        ...state.data.timer,
        setStateData: state.setStateData,
    }));

    const [timerPreferences, setPreferences] = React.useState({
        timerDuration: [appStore.timer_duration],
        pauseDuration: [appStore.pause_duration],
        longPauseDuration: [appStore.long_pause_duration],
    });

    function onUpdatePreferences(
        newVal: number[],
        key: 'timerDuration' | 'pauseDuration' | 'longPauseDuration'
    ) {
        setPreferences((prev) =>
            produce(prev, (draft) => {
                draft[key] = newVal;
            })
        );
    }

    function onCommitVal(
        newVal: number,
        updater: (val: number) => Promise<AppStateData>
    ) {
        updater(newVal).then((newState) => {
            appStore.setStateData(newState);
            useAppStore.getState().resetState();
        });
    }
    return (
        <ul>
            <li>
                <p>Timer duration</p>
                <Slider
                    min={1}
                    max={500}
                    value={timerPreferences.timerDuration}
                    onValueChange={(val) =>
                        onUpdatePreferences(val, 'timerDuration')
                    }
                    onValueCommit={(val) =>
                        onCommitVal(val[0], TimerCommands.setTimerDuration)
                    }
                />
                {timerPreferences.timerDuration[0]}
            </li>
            <li>
                <p>Pause duration</p>
                <Slider
                    min={1}
                    max={500}
                    value={timerPreferences.pauseDuration}
                    onValueChange={(val) =>
                        onUpdatePreferences(val, 'pauseDuration')
                    }
                    onValueCommit={(val) =>
                        onCommitVal(val[0], TimerCommands.setPauseDuration)
                    }
                />
                {timerPreferences.pauseDuration[0]}
            </li>
            <li>
                <p>Long pause duration</p>
                <Slider
                    min={1}
                    max={500}
                    value={timerPreferences.longPauseDuration}
                    onValueChange={(val) =>
                        onUpdatePreferences(val, 'longPauseDuration')
                    }
                    onValueCommit={(val) =>
                        onCommitVal(val[0], TimerCommands.setLongPauseDuration)
                    }
                />
                {timerPreferences.longPauseDuration[0]}
            </li>
        </ul>
    );
};
export default TimerPreferences;
