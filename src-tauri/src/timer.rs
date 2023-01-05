use std::{
    error::Error,
    fs::{File, OpenOptions},
    io::{BufReader, Write},
};

use serde::{Deserialize, Serialize};

use crate::state::AppStateTrait;

#[derive(Debug, Clone, Serialize, Deserialize, Copy, Default)]
pub struct TimerState {
    pub timer_duration: u32,
    pub pause_duration: u32,
    pub long_pause_duration: u32,
    pub is_running: bool,
}

impl TimerState {
    pub fn set_timer_duration(&mut self, timer_duration: u32) {
        self.timer_duration = timer_duration;
        TimerState::save_state(self);
    }
    pub fn set_pause_duration(&mut self, timer_duration: u32) {
        self.pause_duration = timer_duration;
        TimerState::save_state(self);
    }
    pub fn set_is_running(&mut self, is_running: bool) {
        self.is_running = is_running;
        TimerState::save_state(self);
    }
    pub fn set_long_pause_duration(&mut self, timer_duration: u32) {
        self.long_pause_duration = timer_duration;
        TimerState::save_state(self);
    }
}

impl AppStateTrait for TimerState {
    const FILE_NAME: &'static str = "TimerSettings.json";
}
