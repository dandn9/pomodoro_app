import React from 'react';
import { Preferences, ThemeOptions } from '../../utils/classes';
import Select, { SelectGroup, SelectItem } from '../UI/Select';
const SettingsPreferences: React.FC<{ preferences: Preferences }> = ({
    preferences,
}) => {
    const onThemeSelect = (val: ThemeOptions) => {
        preferences.onChangeTheme(val);
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
        </div>
    );
};
export default SettingsPreferences;
