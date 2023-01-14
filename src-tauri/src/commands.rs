use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;
use std::fs::OpenOptions;
use std::io::Write;
use std::rc::Rc;
use std::sync::{Mutex, Weak};
use tauri::api::path::app_data_dir;
use tauri::{command, State};

use crate::session::{self, Session, SessionState};
use crate::state::{AppState, AppStateTrait};
use crate::timer::TimerState;

#[tauri::command]
pub fn get_state(state: State<'_, Mutex<AppState>>) -> AppState {
    state.lock().unwrap().get_state()
}
// TIMER API
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
pub fn set_long_pause_duration(pause_num: u32, state: State<'_, Mutex<AppState>>) -> AppState {
    // could add validation to the NUM
    let mut curr_state = state.lock().unwrap();
    curr_state.timer.set_long_pause_duration(pause_num);
    curr_state.get_state()
}

#[tauri::command]
pub fn set_timer_sound(
    sound_data: Vec<u8>,
    file_info: HashMap<String, String>,
    state: State<'_, Mutex<AppState>>,
    app: tauri::AppHandle,
) -> AppState {
    let file_name = file_info.get("name").unwrap();
    let app_config = app.config();
    let path = app_data_dir(&app_config);
    let path = path.unwrap().join("audio").join(file_name);

    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .create(true)
        .open(path)
        .unwrap();
    file.write_all(&sound_data).unwrap();

    let mut curr_state = state.lock().unwrap();
    curr_state.preferences.notification.audio_on_timer = file_name.to_string();
    curr_state.preferences.save_state();
    println!("new state! {:?}", curr_state);

    curr_state.get_state()
}

// SESSION API
#[tauri::command]
pub fn create_session(
    name: String,
    color: Option<String>,
    state: State<'_, Mutex<AppState>>,
) -> AppState {
    let mut curr_state = state.lock().unwrap();
    let latest_id = curr_state.sessions.get_latest_id();
    let session = Session::new(name, color, latest_id + 1);
    curr_state.sessions.add_session(session);

    curr_state.get_state()
}

#[tauri::command]
pub fn remove_session(id: u32, state: State<'_, Mutex<AppState>>) -> AppState {
    let mut curr_state = state.lock().unwrap();
    curr_state.sessions.remove_session(id);
    println!("NEW STATE REMOVED {:?}", curr_state);
    curr_state.get_state()
}

#[tauri::command]
pub fn update_session(
    name: Option<String>,
    color: Option<String>,
    id: u32,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    let mut curr_state = state.lock().unwrap();
    let session = curr_state.sessions.get_session_mut(id);
    match session {
        Some(session_ref) => {
            match name {
                Some(new_name) => session_ref.name = new_name,
                None => {}
            };
            match color {
                Some(new_color) => session_ref.color = new_color,
                None => {}
            }
        }
        None => return Err("No session".to_string()),
    }
    curr_state.sessions.save_state();
    println!("NEW STATE {:?}", curr_state);
    Ok(curr_state.get_state())
}

#[tauri::command]
pub fn on_completed_session(id: u32, time: u32, state: State<'_, Mutex<AppState>>) -> AppState {
    let mut curr_state = state.lock().unwrap();
    let session = curr_state.sessions.get_session_mut(id);
    match session {
        Some(session_ref) => {
            session_ref.on_done(time);
        }
        None => {}
    }
    curr_state.sessions.save_state();
    println!("NEW STATE {:?}", curr_state);
    curr_state.get_state()
}

#[tauri::command]
pub fn add_task(
    name: String,
    session_id: u32,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    let mut curr_state = state.lock().unwrap();
    if let Some(session) = curr_state.sessions.get_session_mut(session_id) {
        session.add_task(name);
        curr_state.sessions.save_state();
    } else {
        return Err("No session found".to_string());
    }
    Ok(curr_state.get_state())
}
#[tauri::command]
pub fn remove_task(
    task_id: u32,
    session_id: u32,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    let mut curr_state = state.lock().unwrap();
    if let Some(session) = curr_state.sessions.get_session_mut(session_id) {
        session.remove_task(task_id);
        curr_state.sessions.save_state();
    } else {
        return Err("No session found".to_string());
    }
    Ok(curr_state.get_state())
}

#[tauri::command]
pub fn update_task(
    name: Option<String>,
    is_done: Option<bool>,
    session_id: u32,
    task_id: u32,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    let mut curr_state = state.lock().unwrap();
    if let Some(session) = curr_state.sessions.get_session_mut(session_id) {
        if let Some(task) = session.get_task_mut(task_id) {
            task.update_task(name, is_done)
        } else {
            return Err("No task found".to_string());
        }
    } else {
        return Err("No session found".to_string());
    }
    Ok(curr_state.get_state())
}
