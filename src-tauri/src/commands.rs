use std::cell::RefCell;
use std::collections::HashMap;
use std::fs::OpenOptions;
use std::io::Write;
use std::rc::Rc;
use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tauri::api::path::app_data_dir;
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
    app: tauri::AppHandle,
    window: tauri::Window,
) -> () {
    let file_name = file_info.get("name").unwrap();
    let app_config = app.config();
    let path = app_data_dir(&app_config);
    let path = path.unwrap().join("audio").join(file_name);

    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .open(path)
        .unwrap();
    file.write_all(&sound_data).unwrap()
}

pub fn get_timer_sound_name(state: State<'_, Mutex<AppState>>) -> String {
    let curr_state = state.lock().unwrap();
    // curr_state.theme.notification.clone()
    String::from("")
}
// pub fn set_
