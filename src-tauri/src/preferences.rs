use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

use crate::state::AppStateTrait;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PreferencesState {
    pub notification: Notification,
    pub autoplay: bool,
    pub enable_sessions: bool,
    pub sessions_for_run: u32,
}

impl Default for PreferencesState {
    fn default() -> Self {
        Self {
            notification: Notification::default(),
            autoplay: false,
            enable_sessions: true,
            sessions_for_run: 4,
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
