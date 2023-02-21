import React from 'react';
import { Preferences, ThemeOptions } from '../../utils/classes';
import Select, { SelectGroup, SelectItem } from '../UI/Select';
import Switch from '../UI/Switch';
import Tooltip from '../UI/Tooltip';
const SettingsPreferences: React.FC<{ preferences: Preferences }> = ({
    preferences,
}) => {
    const onThemeSelect = (val: ThemeOptions) => {
        preferences.onChangeTheme(val);
    };
    const onAutoplay = (val: boolean) => {
        preferences.onSetAutoplay(val);
    };

    return (
        <div className="relative">
            <Select
                valueProps={{
                    defaultValue: preferences.theme,
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
            <div className="flex">
                <Tooltip tooltipText="Hello there">
                    <h3 className="underline">Autoplay</h3>
                </Tooltip>
                <Switch
                    defaultChecked={preferences.autoplay}
                    onCheckedChange={onAutoplay}
                />
            </div>
        </div>
    );
};
export default SettingsPreferences;
