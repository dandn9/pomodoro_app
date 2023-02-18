use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

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
        Self {
            notification: Notification::default(),
            autoplay: false,
            enable_sessions: true,
            sessions_to_complete: 4,
            sessions_for_long_pause: 4,
            available_sounds: vec![
                SoundType::new("Bonk".to_string(), "bonk.mp3".to_string()),
                SoundType::new("Mario".to_string(), "mario.mp3".to_string()),
                SoundType::new("Sonic".to_string(), "sonic.mp3".to_string()),
            ],
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
