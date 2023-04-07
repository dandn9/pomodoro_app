use std::error::Error;

use crate::preferences::{CircleStyles, SoundType, ThemeOptions};
use crate::state::{init_or_get_state, save_state as internal_save_state, AppState};

// UTILITIES
#[tauri::command]
pub fn get_state(app_handle: tauri::AppHandle) -> AppState {
    init_or_get_state(&app_handle)
}

#[tauri::command]
pub fn save_state(state: AppState, app_handle: tauri::AppHandle) -> Result<bool, String> {
    println!("save state {:?}", state);
    match internal_save_state(state, &app_handle) {
        Ok(b) => Ok(b),
        Err(e) => Err(e.to_string()), // have to do this conversion because we cant send a dyn Err via commands
    }
}
