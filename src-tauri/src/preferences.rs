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
    pub available_sounds: Vec<String>,
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
            available_sounds: vec!["/assets/bonk.mp3".to_string()],
            show_percentage: false,
            resolution: (800, 600),
            time_to_add: 5.0,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Notification {
    pub message_on_timer: String,
    pub message_on_pause: String,
    pub audio_on_timer: String,
    pub audio_on_pause: String,
}
impl Default for Notification {
    fn default() -> Self {
        Self {
            message_on_timer: "Timer is up!".to_string(),
            message_on_pause: "Pause is up!".to_string(),
            audio_on_timer: "".to_string(),
            audio_on_pause: "".to_string(),
        }
    }
}

impl AppStateTrait for PreferencesState {
    const FILE_NAME: &'static str = "PreferencesSettings.json";
}
