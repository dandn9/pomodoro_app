use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

use crate::state::AppStateTrait;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThemeState {
    pub preferred_theme: String,
    pub notification: Notification,
}

impl Default for ThemeState {
    fn default() -> Self {
        Self {
            preferred_theme: "dark".to_string(),
            notification: Notification::default(),
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

impl AppStateTrait for ThemeState {
    const FILE_NAME: &'static str = "ThemeSettings.json";
}
