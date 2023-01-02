use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tauri::{command, State};

use crate::state::AppState;
use crate::timer::TimerState;

#[tauri::command]
pub fn get_state(state: State<'_, Mutex<AppState>>) -> AppState {
    state.lock().unwrap().get_state()
}
#[tauri::command]
pub fn set_timer_duration(timer_num: u32, state: State<'_, Mutex<AppState>>) -> AppState {
    // could add validation to the NUM
    let mut curr_state = state.lock().unwrap();
    curr_state.timer.set_timer_duration(timer_num);
    curr_state.get_state()
}
#[tauri::command]
pub fn set_pause_duration(pause_num: u32, state: State<'_, Mutex<AppState>>) -> AppState {
    // could add validation to the NUM
    let mut curr_state = state.lock().unwrap();
    curr_state.timer.set_pause_duration(pause_num);
    curr_state.get_state()
}

#[tauri::command]
pub fn set_timer_sound(
    sound_data: Vec<u8>,
    file_info: HashMap<String, String>,
    state: State<'_, Mutex<AppState>>,
) -> () {
    println!("HI!");
    // println!("set_timer_sound {:?}", sound_data);
    println!("set_timer_sound {:?}", file_info);
    file_info.get("name");
}
// pub fn set_
