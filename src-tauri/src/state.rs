use std::{
    cell::{RefCell, RefMut},
    sync::Mutex,
};

use once_cell::sync::Lazy;
use serde::Serialize;

use crate::timer::TimerState;
use serde::Deserialize;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppState {
    pub timer: Option<TimerState>,
}
impl AppState {
    pub fn set_state(&mut self, timer: TimerState) {
        self.timer = Some(timer);
    }
    pub fn get_state(&self) -> AppState {
        self.clone()
    }
}

pub static STATE: Mutex<AppState> = Mutex::new(AppState { timer: None });
