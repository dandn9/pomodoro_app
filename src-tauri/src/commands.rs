use tauri::command;

use crate::state::AppState;
use crate::state::STATE;
use crate::timer::TimerState;

#[tauri::command]
pub fn get_state() -> AppState {
    STATE.lock().unwrap().get_state()
}
#[tauri::command]
pub fn set_timer(timer_num: u32) -> AppState {
    let mut curr_state = STATE.lock().unwrap();

    let pause_duration = curr_state.get_state().timer.unwrap().pause_duration;
    curr_state.set_state(TimerState::new(timer_num, pause_duration));

    curr_state.get_state()
}

pub const AllFunctions: Vec<command::Handler> = vec![get_state, set_timer];
