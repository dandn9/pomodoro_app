use std::cell::RefCell;
use std::rc::Rc;
use std::sync::Mutex;

use tauri::{command, State};

use crate::state::AppState;
use crate::timer::TimerState;

#[tauri::command]
pub fn get_state(state: State<'_, Mutex<AppState>>) -> AppState {
    state.lock().unwrap().get_state()
}
#[tauri::command]
pub fn set_timer(timer_num: u32, state: State<'_, Mutex<AppState>>) -> AppState {
    let mut curr_state = state.lock().unwrap();
    let pause_duration = curr_state.get_state().timer.pause_duration;
    curr_state.set_state(TimerState::new(timer_num, pause_duration));

    curr_state.get_state()
}
// const ALL_FUNCS: Vec<dyn Fn> = vec![set_timer, get_state];
