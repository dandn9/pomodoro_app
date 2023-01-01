use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

use crate::state::AppStateTrait;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SessionState {
    pub sessions: Vec<Session>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Session {
    color: String,
    is_selected: bool,
    time_spent: u32,
    created_at: DateTime<Local>,
}

impl SessionState {
    pub fn new() -> SessionState {
        SessionState { sessions: vec![] }
    }
}

impl AppStateTrait for SessionState {
    const FILE_PATH: &'static str = "../SessionSettings.json";
}
