use crate::state::SETTINGS_FOLDER_PATH;
use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use std::{
    fs::copy,
    path::{self, Path},
};

use crate::state::AppStateTrait;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PreferencesState {
    pub notification: Notification,
    pub autoplay: bool,
    pub enable_sessions: bool,
    pub sessions_to_complete: u32,
    pub sessions_for_long_pause: u32,
    pub available_sounds: Vec<SoundType>,
    pub show_percentage: bool,
    pub resolution: (u32, u32),
    pub time_to_add: f32,
}

impl Default for PreferencesState {
    fn default() -> Self {
        // copy the files in assets/default_sounds to the appDir
        let fold_path = SETTINGS_FOLDER_PATH.lock().unwrap();
        let defaults_dir = Path::new("./assets/default_sounds");
        let app_path = Path::new(fold_path.as_str()).join("audio");

        let mut available_sounds: Vec<SoundType> = vec![];
        for file in defaults_dir.read_dir().unwrap().into_iter() {
            let file_path = file.unwrap().file_name();

            let copy_result = copy(defaults_dir.join(&file_path), app_path.join(&file_path));
            match copy_result {
                Ok(_) => {
                    let mut file_name: Vec<&str> = file_path.to_str().unwrap().split('.').collect();
                    file_name.pop().unwrap();
                    let file_name = file_name.join(" ");
                    let mut file_chars = file_name.chars();
                    let new = match file_chars.next() {
                        None => String::new(),
                        Some(f) => f.to_uppercase().collect::<String>() + file_chars.as_str(),
                    };
                    available_sounds
                        .push(SoundType::new(new, file_path.to_str().unwrap().to_string()));
                }
                Err(_) => println!("Didn't copy"),
            }
        }

        // copy(defaults_dir, "./").unwrap();
        // copy(path, to)

        Self {
            notification: Notification::default(),
            autoplay: false,
            enable_sessions: true,
            sessions_to_complete: 4,
            sessions_for_long_pause: 4,
            available_sounds,
            show_percentage: false,
            resolution: (800, 600),
            time_to_add: 5.0,
        }
    }
}
impl PreferencesState {
    pub fn add_sound(&mut self, name: String, path_name: String) -> Result<String, String> {
        let new_sound = SoundType::new(name, path_name);
        let exist = self.available_sounds.iter().any(|s| s.id == new_sound.id);
        if exist {
            Err("Already exist!".to_string())
        } else {
            self.available_sounds.push(new_sound);
            self.save_state();
            Ok("ok".to_string())
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Notification {
    pub message_on_timer: String,
    pub message_on_pause: String,
    pub audio_on_timer_id: u64,
    pub audio_on_pause_id: u64,
}
impl Default for Notification {
    fn default() -> Self {
        Self {
            message_on_pause: "Pause is up!".to_string(),
            message_on_timer: "Timer is up!".to_string(),
            audio_on_timer_id: 8871325601931092469,
            audio_on_pause_id: 9799632646341056273,
        }
    }
}

impl AppStateTrait for PreferencesState {
    const FILE_NAME: &'static str = "PreferencesSettings.json";
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SoundType {
    pub name: String,
    pub id: u64,
    pub file_path: String,
}

impl SoundType {
    pub fn new(name: String, file_path: String) -> Self {
        let id = crate::hash::calculate_hash(&name);
        SoundType {
            name,
            file_path,
            id,
        }
    }
}
