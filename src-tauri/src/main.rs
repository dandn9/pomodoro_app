#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub mod commands;
pub mod settings;

use commands::*;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
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
            get_timer,
            get_pause,
            get_label,
            set_timer,
            set_pause,
            set_label,
            get_timer_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
