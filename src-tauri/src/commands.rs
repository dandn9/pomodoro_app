use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;
use std::fs::OpenOptions;
use std::io::Write;
use std::rc::Rc;
use std::sync::{Arc, Mutex, MutexGuard, PoisonError};
use tauri::api::path::app_data_dir;
use tauri::{Manager, State};

use crate::preferences::SoundType;
use crate::session::{self, Session, SessionState};
use crate::state::{init_or_get_state, AppState, AppStateTrait};

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

// SESSION API
#[tauri::command]
pub fn create_session(
    name: String,
    color: Option<String>,
    tasks: Vec<String>,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    let mut curr_state = state.lock().unwrap();
    let latest_id = curr_state.sessions.get_latest_id();
    let mut session = Session::new(name, color, latest_id + 1);
    for task_name in tasks {
        session.add_task_string(task_name)?;
    }
    let session_id = session.id;
    curr_state.sessions.add_session(session);
    curr_state.sessions.select_session(session_id);
    Ok(curr_state.get_state())
}

#[tauri::command]
pub fn delete_session(id: u32, state: State<'_, Mutex<AppState>>) -> AppState {
    let mut curr_state = state.lock().unwrap();
    curr_state.sessions.delete_session(id);
    println!("NEW STATE REMOVED {:?}", curr_state);
    curr_state.get_state()
}

#[tauri::command]
pub fn update_session(
    session: Session,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    let mut curr_state = state.lock().unwrap();
    println!("updating session");
    curr_state.sessions.update_session(session);
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
pub fn on_selected_session(id: u32, state: State<'_, Mutex<AppState>>) -> AppState {
    let mut curr_state = state.lock().unwrap();
    curr_state.sessions.select_session(id);
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
        session.add_task_string(name)?;
        curr_state.sessions.save_state();
    } else {
        return Err("No session found".to_string());
    }
    Ok(curr_state.get_state())
}
#[tauri::command]
pub fn delete_task(
    task_id: u32,
    session_id: u32,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    let mut curr_state = state.lock().unwrap();
    if let Some(session) = curr_state.sessions.get_session_mut(session_id) {
        session.delete_task(task_id);
        curr_state.sessions.save_state();
    } else {
        return Err("No session found".to_string());
    }
    Ok(curr_state.get_state())
}

#[tauri::command]
pub fn update_done_task(
    is_done: bool,
    session_id: u32,
    task_id: u32,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    let mut curr_state = state.lock().unwrap();
    if let Some(session) = curr_state.sessions.get_session_mut(session_id) {
        if let Some(task) = session.get_task_mut(task_id) {
            task.update_task_done(is_done);
        } else {
            return Err("No task found".to_string());
        }
    } else {
        return Err("No session found".to_string());
    }
    curr_state.sessions.save_state();
    Ok(curr_state.get_state())
}

#[tauri::command]
pub fn update_order_session(
    from_order: u32,
    target_order: u32,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    println!("updating order on {} to {} ", from_order, target_order);
    let mut curr_state = state.lock().unwrap();
    curr_state
        .sessions
        .update_session_order(from_order, target_order)?;

    curr_state.sessions.save_state();
    Ok(curr_state.get_state())
}
#[tauri::command]
pub fn update_order_task(
    from_order: u32,
    target_order: u32,
    session_id_from: u32,
    session_id_target: u32,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    println!(
        "updating order on {} to {} and sess id from {} to {}",
        from_order, target_order, session_id_from, session_id_target
    );
    let mut curr_state = state.lock().unwrap();

    // check if a task with same name already exists
    if session_id_target != session_id_from {
        let session_to = curr_state.sessions.get_session(session_id_target).unwrap();
        let session_from = curr_state.sessions.get_session(session_id_from).unwrap();

        if session_to.check_if_task_exists(
            session_from
                .tasks
                .get(from_order as usize)
                .unwrap()
                .name
                .as_str(),
        ) {
            return Err("String already exists!".to_string());
        }
    };

    let task = if session_id_target != session_id_from {
        println!("not same");
        let session_from = curr_state
            .sessions
            .get_session_mut(session_id_from)
            .unwrap();
        let task = session_from.remove_task_on_index(from_order).unwrap();
        println!(
            "removed task : {:?} from session {:?}",
            task, session_from.name
        );
        Some(task)
    } else {
        None
    };

    match task {
        Some(task) => {
            let session = curr_state
                .sessions
                .get_session_mut(session_id_target)
                .unwrap();
            println!("session length before adding task {}", session.tasks.len());
            session.add_task(task);
            println!("session length after adding task {}", session.tasks.len());
            session.update_task_index((session.tasks.len() - 1) as u32, target_order)?
        }
        None => {
            let session = curr_state
                .sessions
                .get_session_mut(session_id_target)
                .unwrap();

            println!("changing {:?} to {:?}", from_order, target_order);
            session.update_task_index(from_order, target_order)?
        }
    };
    println!("CHANGED ORDER");

    curr_state.sessions.save_state();
    Ok(curr_state.get_state())
}

// PREFERENCES API

#[tauri::command]
pub fn set_timer_sound_id(id: u64, state: State<'_, Mutex<AppState>>) -> AppState {
    let mut curr_state = state.lock().unwrap();

    curr_state.preferences.notification.audio_on_timer_id = id;
    curr_state.preferences.save_state();
    // let file_name = file_info.get("name").unwrap();
    // let app_config = app.config();
    // let path = app_data_dir(&app_config);
    // let path = path.unwrap().join("audio").join(file_name);

    // sound_data: Vec<u8>,
    // file_info: HashMap<String, String>,
    // let mut file = OpenOptions::new()
    //     .write(true)
    //     .truncate(true)
    //     .create(true)
    //     .open(path)
    //     .unwrap();
    // file.write_all(&sound_data).unwrap();

    // let mut curr_state = state.lock().unwrap();
    // // curr_state.preferences.notification.audio_on_timer = file_name.to_string();
    // curr_state.preferences.save_state();
    // println!("new state! {:?}", curr_state);

    curr_state.get_state()
}

#[tauri::command]
pub fn set_pause_sound_id(id: u64, state: State<'_, Mutex<AppState>>) -> AppState {
    let mut curr_state = state.lock().unwrap();

    curr_state.preferences.notification.audio_on_pause_id = id;
    curr_state.preferences.save_state();
    curr_state.get_state()
}
#[tauri::command]
pub fn add_sound(
    name: String,
    path_name: String,
    state: State<'_, Mutex<AppState>>,
) -> Result<AppState, String> {
    let mut curr_state = state.lock().unwrap();

    curr_state.preferences.add_sound(name, path_name)?;
    Ok(curr_state.get_state())
}

// UTILITIES
#[tauri::command]
pub fn reload_state(state: State<Mutex<AppState>>, app_handle: tauri::AppHandle) -> AppState {
    let mut x = state.lock().unwrap();
    let new_state = init_or_get_state(&app_handle.config());
    *x = new_state;

    x.get_state()
}
