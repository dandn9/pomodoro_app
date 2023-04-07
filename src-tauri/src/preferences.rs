use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use std::{
    error::Error,
    fs::copy,
    fs::remove_file,
    path::{self, Path},
};

use crate::state::get_data_path;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ThemeOptions {
    Default,
    Dark,
    White,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CircleStyles {
    Solid,
    Dotted,
    Drawn,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PreferencesState {
    pub _notification: Notification,
    pub _autoplay: bool,
    pub _sessions_for_long_pause: u32,
    pub _available_sounds: Vec<SoundType>,
    pub _circle_style: CircleStyles,
    pub _show_percentage: bool,
    pub _resolution: (u32, u32),
    pub _time_to_add: u32,
    pub _theme: ThemeOptions,
}

impl PreferencesState {
    pub fn default(app: &tauri::AppHandle) -> Self {
        // copy the files in assets/default_sounds to the appDir
        let app_path = get_data_path(app).join("audio");
        let defaults_dir = Path::new("./assets/default_sounds");

        let mut _available_sounds: Vec<SoundType> = vec![];
        for file in defaults_dir.read_dir().unwrap().into_iter() {
            let file_path = file.unwrap().file_name();

            let copy_result = copy(defaults_dir.join(&file_path), app_path.join(&file_path));
            match copy_result {
                Ok(_) => {
                    let file_name: Vec<&str> = file_path.to_str().unwrap().split('.').collect();

                    _available_sounds.push(SoundType {
                        _name: file_name[0].to_string(),
                        _id: (_available_sounds.len() as u32 + 1),
                        _file_path: file_name.join("."),
                    })
                }
                Err(_) => println!("Didn't copy"),
            }
        }

        Self {
            _notification: Notification::default(),
            _autoplay: false,
            _sessions_for_long_pause: 4,
            _circle_style: CircleStyles::Solid,
            _available_sounds,
            _show_percentage: false,
            _resolution: (800, 600),
            _time_to_add: 300, // 5 minutes
            _theme: ThemeOptions::Default,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Notification {
    pub _message_on_timer: String,
    pub _message_on_pause: String,
    pub _audio_on_timer_id: u32,
    pub _audio_on_pause_id: u32,
}
impl Default for Notification {
    fn default() -> Self {
        Self {
            _message_on_pause: "Pause is up!".to_string(),
            _message_on_timer: "Timer is up!".to_string(),
            _audio_on_timer_id: 1,
            _audio_on_pause_id: 2,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SoundType {
    pub _name: String,
    pub _id: u32,
    pub _file_path: String,
}
