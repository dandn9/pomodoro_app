import React from 'react';
import { CircleStyles, Preferences, ThemeOptions } from '../../utils/classes';
import Select, { SelectGroup, SelectItem } from '../UI/Select';
import Switch from '../UI/Switch';
import Tooltip from '../UI/Tooltip';
import Separator from '../UI/Separator';
import Input from '../UI/Input';
import MinusIcon from '../../assets/icons/minus-icon';
import PlusIcon from '../../assets/icons/plus-icon';
import Popover from '../UI/Popover';
import Slider from '../UI/Slider';
import { secondsToTimeString } from '../../utils/displayTime';
const SettingsPreferences: React.FC<{ preferences: Preferences }> = ({
    preferences,
}) => {
    const [sessionError, setSessionError] = React.useState(false);
    const onThemeSelect = (val: ThemeOptions) => {
        preferences.onChangeTheme(val);
    };
    const onCircleStyleSelect = (val: CircleStyles) => {
        preferences.onChangeCircleStyle(val);
    };
    const onAutoplay = (val: boolean) => {
        preferences.onSetAutoplay(val);
    };

    const onShowPercentage = (val: boolean) => {
        preferences.onSetShowPercentage(val);
    };
    const onSetSessionsLongPause = (val: number) => {
        if (val < 1 || val > 8) {
            setSessionError(true);
            return;
        }
        preferences.onSetSessionsForLongPause(val);
    };
    const onSetTimeToAdd = (val: number) => {
        preferences.onSetTimeToAdd(val);
    };
    return (
        <div className="relative">
            <h3>Color theme</h3>
            <Select
                valueProps={{
                    placeholder: preferences.theme,
                }}
                rootProps={{
                    onValueChange: onThemeSelect,
                }}>
                <SelectGroup>
                    {Object.keys(ThemeOptions).map((option) => {
                        return (
                            <SelectItem value={option} key={option}>
                                {option}
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </Select>
            <Separator className="my-4 mx-0 w-full" />
            <h3>Circle styles</h3>
            <Select
                valueProps={{
                    placeholder: preferences.circleStyle,
                }}
                rootProps={{
                    onValueChange: onCircleStyleSelect,
                }}>
                <SelectGroup>
                    {Object.keys(CircleStyles).map((option) => {
                        return (
                            <SelectItem value={option} key={option}>
                                {option}
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </Select>
            <Separator className="my-4 mx-0 w-full" />
            <div className="flex">
                <Tooltip tooltipText="Hello there">
                    <h3 className="underline">Autoplay</h3>
                </Tooltip>
                <Switch
                    defaultChecked={preferences.autoplay}
                    onCheckedChange={onAutoplay}
                />
            </div>
            <div className="flex">
                <Tooltip tooltipText="Hello there">
                    <h3 className="underline">Show percentage</h3>
                </Tooltip>
                <Switch
                    defaultChecked={preferences.show_percentage}
                    onCheckedChange={onShowPercentage}
                />
            </div>
            <Separator className="my-4 mx-0 w-full" />

            <div className="flex">
                <Tooltip tooltipText="Sessions to complete to take a long pause">
                    <h3 className="underline">Sessions For Long Pause</h3>
                </Tooltip>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onSetSessionsLongPause.bind(
                            null,
                            preferences.sessions_for_long_pause - 1
                        )}>
                        <MinusIcon />
                    </button>
                    {preferences.sessions_for_long_pause}
                    <button
                        onClick={onSetSessionsLongPause.bind(
                            null,
                            preferences.sessions_for_long_pause + 1
                        )}>
                        <PlusIcon />
                    </button>
                </div>
                {/* </Popover> */}
            </div>

            <div className="flex justify-between">
                <Tooltip tooltipText="Sessions to complete to take a long pause">
                    <h3 className="underline">Time to add</h3>
                </Tooltip>
                <div className=" flex items-center gap-2">
                    <Slider
                        withIndicator
                        defaultValue={[preferences.time_to_add]}
                        step={30}
                        displayFn={(val) => {
                            if (val) return secondsToTimeString(val[0]);
                            return '';
                        }}
                        onValueCommit={(val) => onSetTimeToAdd(val[0])}
                        min={0}
                        max={600}
                    />
                </div>
            </div>
        </div>
    );
};
export default SettingsPreferences;
