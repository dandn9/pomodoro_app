use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Copy, Default)]
pub struct TimerState {
    pub timer_duration: u32,
    pub pause_duration: u32,
    pub is_running: bool,
}

impl TimerState {
    pub fn new(timer_duration: u32, pause_duration: u32) -> TimerState {
        TimerState {
            timer_duration,
            pause_duration,
            is_running: false,
        }
    }
}
