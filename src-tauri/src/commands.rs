use crate::settings::{get_timer_instance, Timer};

#[tauri::command]
pub fn get_timer() -> u32 {
    get_timer_instance().get_time()
}

#[tauri::command]
pub fn get_pause() -> u32 {
    get_timer_instance().get_pause()
}

#[tauri::command]
pub fn get_label() -> String {
    get_timer_instance().get_label().to_string()
}

#[tauri::command]
pub fn set_timer(new_timer: u32) -> String {
    match get_timer_instance().change_time(new_timer).save() {
        Ok(_) => "saved".to_string(),
        Err(_) => "not saved".to_string(),
    }
}

#[tauri::command]
pub fn set_pause(new_pause: u32) -> String {
    match get_timer_instance().change_pause(new_pause).save() {
        Ok(_) => "saved".to_string(),
        Err(_) => "not saved".to_string(),
    }
}

#[tauri::command]
pub fn set_label(new_label: &str) -> String {
    match get_timer_instance().change_label(new_label).save() {
        Ok(_) => "saved".to_string(),
        Err(_) => "not saved".to_string(),
    }
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}", name)
}

#[tauri::command]
pub fn get_timer_state() -> Timer {
    get_timer_instance()
}
