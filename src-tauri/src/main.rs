// #![cfg_attr(
//     all(not(debug_assertions), target_os = "windows"),
//     windows_subsystem = "windows"
// )]

mod commands;
mod session;
mod state;
mod timer;

use commands::*;
use state::init_or_get_state;
use tauri::Manager;
use timer::TimerState;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// TODO -> Use Tauri defasult state managment
fn main() {
    tauri::Builder::default()
        .manage(init_or_get_state())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_state,
            set_timer_duration,
            set_pause_duration
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
