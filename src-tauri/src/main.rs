// #![cfg_attr(
//     all(not(debug_assertions), target_os = "windows"),
//     windows_subsystem = "windows"
// )]

mod commands;
mod state;
mod timer;

use commands::get_state;
use state::STATE;
use tauri::Manager;
use timer::TimerState;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    STATE.lock().unwrap().set_state(TimerState::new(10, 0));
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, get_state])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
