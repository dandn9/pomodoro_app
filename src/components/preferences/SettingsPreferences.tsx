import React from 'react';
import { CircleStyles, Preferences, ThemeOptions } from '../../utils/classes';
import Select, { SelectGroup, SelectItem } from '../UI/Select';
import Switch from '../UI/Switch';
import Tooltip from '../UI/Tooltip';
import Separator from '../UI/Separator';
const SettingsPreferences: React.FC<{ preferences: Preferences }> = ({
    preferences,
}) => {
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
                    defaultChecked={preferences.autoplay}
                    onCheckedChange={onShowPercentage}
                />
            </div>
        </div>
    );
};
export default SettingsPreferences;
