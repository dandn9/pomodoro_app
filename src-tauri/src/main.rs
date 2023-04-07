// #![cfg_attr(
// /     all(not(debug_assertions), target_os = "windows"),
//     windows_subsystem = "windows"
// )]
// TODO: look more into the many unwraps() in the application which could lead to a runtime crash

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod preferences;
mod state;

use std::sync::{Arc, Mutex};

use commands::*;
use once_cell::sync::Lazy;
use state::init_or_get_state;
use tauri::{
    generate_context, CustomMenuItem, GlobalWindowEvent, SystemTray, SystemTrayHandle,
    SystemTrayMenu, SystemTrayMenuItem, WindowBuilder, WindowEvent, WindowUrl,
};
use tauri::{Manager, SystemTrayEvent};

fn create_system_tray() -> SystemTray {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let toggle_timer = CustomMenuItem::new("toggle_timer".to_string(), "Start Timer");
    let tray_menu = SystemTrayMenu::new()
        .add_item(toggle_timer)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    SystemTray::new().with_menu(tray_menu)
}
// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize, serde::Deserialize)]
struct Payload {
    message: Option<String>,
}
pub static SYSTEM_TRAY: Lazy<Mutex<Option<SystemTrayHandle>>> = Lazy::new(|| Mutex::new(None));

fn main() {
    tauri::Builder::default()
        .system_tray(create_system_tray())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }

            let app_state = init_or_get_state(&app.handle());
            // let resolution = app_state.lock().unwrap().preferences._resolution.clone();
            app.manage(app_state);
            let main_window = app.get_window("main").unwrap();

            // main_window
            //     .set_size(tauri::Size::Physical(tauri::PhysicalSize::new(
            //         resolution.0,
            //         resolution.1,
            //     )))
            //     .unwrap();
            // let tray_handle = app.tray_handle();
            // SYSTEM_TRAY.lock().unwrap().replace(tray_handle);

            // event for system tray to switch between "start timer" and "stop timer"

            Ok(())
        })
        .on_window_event(|event| match event.event() {
            WindowEvent::Resized(size) => {
                let c = event.window().is_visible();

                println!("resized {:?}, {:?}", size, c);
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![get_state, save_state])
        .run(tauri::generate_context!())
        .expect("error while building tauri application")
}
