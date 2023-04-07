import React from 'react';
import { CircleStyles, Preferences, ThemeOptions } from '../../utils/classes';
import Select, { SelectGroup, SelectItem } from '../UI/Select';
import Switch from '../UI/Switch';
import Tooltip from '../UI/Tooltip';
import Separator from '../UI/Separator';
import MinusIcon from '../../assets/icons/minus-icon';
import PlusIcon from '../../assets/icons/plus-icon';
import Slider from '../UI/Slider';
import { secondsToTimeString } from '../../utils/displayTime';
import usePermanentStore from '@/store/PermanentStore';
const SettingsPreferences = (
) => {
    const preferences = usePermanentStore((state) => state.data.preferences)
    return (
        <div className="relative">
            <h3>Color theme</h3>
            <Select
                valueProps={{
                    placeholder: preferences.theme,
                }}
                rootProps={{
                    onValueChange: (v: ThemeOptions) => preferences.theme = v,
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
                    placeholder: preferences.circle_style,
                }}
                rootProps={{
                    onValueChange: (v: CircleStyles) => preferences.circle_style = v,
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
                    onCheckedChange={(v) => preferences.autoplay = v}
                />
            </div>
            <div className="flex">
                <Tooltip tooltipText="Hello there">
                    <h3 className="underline">Show percentage</h3>
                </Tooltip>
                <Switch
                    defaultChecked={preferences.show_percentage}
                    onCheckedChange={(v) => preferences.show_percentage = v}
                />
            </div>
            <Separator className="my-4 mx-0 w-full" />

            <div className="flex">
                <Tooltip tooltipText="Sessions to complete to take a long pause">
                    <h3 className="underline">Sessions For Long Pause</h3>
                </Tooltip>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => preferences.sessions_for_long_pause -= 1}>
                        <MinusIcon />
                    </button>
                    {preferences.sessions_for_long_pause}
                    <button
                        onClick={() => preferences.sessions_for_long_pause += 1}>
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
                        step={5}
                        displayFn={(val) => {
                            if (val) return secondsToTimeString(val[0]);
                            return '';
                        }}
                        onValueCommit={(val) => preferences.time_to_add = val[0]}
                        min={0}
                        max={600}
                    />
                </div>
            </div>
        </div>
    );
};
export default SettingsPreferences;
