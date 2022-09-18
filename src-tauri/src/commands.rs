use crate::settings::{get_timer_instance, Session, Sessions, Timer};

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

// SESSIONS

#[tauri::command]
pub fn save_session(label: &str, duration: u32) -> String {
    println!("saving session");
    match Sessions::load() {
        Ok(sessions) => match sessions.add_session(Session::new(label, duration)).save() {
            Ok(_) => "saved".to_string(),
            Err(_) => "not saved".to_string(),
        },
        Err(_err) => "Something went wrong".to_string(),
    }
}

#[tauri::command]
pub fn remove_session(session_id: u32) -> Result<String, String> {
    // this is a mess XD

    match Sessions::load() {
        Ok(session) => match session.remove_session(session_id) {
            Ok(session) => match session.save() {
                Ok(_) => Ok(String::from("Success")),
                Err(_) => Err(String::from("Couldnt remove it")),
            },
            Err(_) => Err(String::from("Couldnt remove it")),
        },
        Err(err) => Err(format!(
            "Something went wrong loading sessions, Error: {:?}",
            err
        )),
    }
}

#[tauri::command]
pub fn get_sessions() -> Result<Sessions, String> {
    match Sessions::load() {
        Ok(session) => Ok(session),
        Err(err) => Err(format!(
            "Something went wrong loading sessions, Error: {:?}",
            err
        )),
    }
}

#[tauri::command]
pub fn set_session_selected(session_id: u32) -> Result<String, String> {
    match Sessions::load() {
        Ok(sessions) => {
            sessions.set_session_selected(session_id).save().unwrap();
            Ok(String::from("Success"))
        }
        Err(_) => Err(String::from("Soomething went wrong!")),
    }
}
