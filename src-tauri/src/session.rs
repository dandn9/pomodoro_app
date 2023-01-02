use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

use crate::state::AppStateTrait;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SessionState {
    pub sessions: Vec<Session>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Session {
    pub id: u32,
    pub name: String,
    pub color: String,
    pub is_selected: bool,
    pub time_spent: u32,
    pub total_sessions: u32,
    pub created_at: DateTime<Local>,
}

impl Session {
    pub fn new(name: String, color: Option<String>, id: Option<u32>) -> Session {
        let color = match color {
            Some(color) => color,
            None => "#000000".to_string(),
        };
        let id = match id {
            Some(id) => id,
            None => 0,
        };
        Session {
            id,
            name,
            color,
            is_selected: true,
            total_sessions: 0,
            time_spent: 0,
            created_at: Local::now(),
        }
    }
    pub fn set_time_spent(&mut self, time_spent: u32) {
        self.time_spent = time_spent;
    }
}

impl SessionState {
    pub fn add_session(&mut self, session: Session) {
        self.sessions.push(session);
        self.save_state();
    }
    pub fn remove_session(&mut self, id: u32) {
        self.sessions = self.sessions.drain(..).filter(|x| x.id != id).collect();
        self.save_state();
    }
    pub fn get_session_mut(&mut self, id: u32) -> Option<&mut Session> {
        self.sessions.iter_mut().find(|x| x.id == id)
    }
    pub fn select_session(&mut self, id: u32) {
        for session in self.sessions.iter_mut() {
            session.is_selected = session.id == id;
        }
        self.save_state();
    }
}
impl AppStateTrait for SessionState {
    const FILE_NAME: &'static str = "SessionSettings.json";
}
