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
mod hash;
mod preferences;
mod session;
mod state;
mod timer;

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
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::DoubleClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_decorations(true).unwrap();
                window.unminimize().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "toggle_timer" => {
                    let window = app.get_window("main").unwrap();
                    window
                        .emit("toggle_timer_tray", Payload { message: None })
                        .unwrap()
                }

                _ => {}
            },
            _ => {}
        })
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }

            let app_state = Mutex::new(init_or_get_state(&app.config()));
            let resolution = app_state.lock().unwrap().preferences.resolution.clone();
            app.manage(app_state);
            let main_window = app.get_window("main").unwrap();

            main_window
                .set_size(tauri::Size::Physical(tauri::PhysicalSize::new(
                    resolution.0,
                    resolution.1,
                )))
                .unwrap();
            let tray_handle = app.tray_handle();
            SYSTEM_TRAY.lock().unwrap().replace(tray_handle);

            // event for system tray to switch between "start timer" and "stop timer"
            main_window.listen("toggle_timer_app", |event| {
                println!("got event! {:?}", event.payload());
                let payload = serde_json::from_str::<Payload>(event.payload().unwrap()).unwrap();
                let mut tray_handle_ref = SYSTEM_TRAY.lock().unwrap();
                let tray_handgg = tray_handle_ref.as_mut();
                let tray_handle = tray_handgg.unwrap();
                let g = tray_handle.get_item("toggle_timer");
                g.set_title(payload.message.unwrap()).unwrap();
            });

            Ok(())
        })
        .on_window_event(|event| match event.event() {
            WindowEvent::CloseRequested { api, .. } => {
                println!("CLOSE REQUESTED");

                let window = event.window();
                window.set_decorations(false).unwrap();
                window.hide().unwrap();
                api.prevent_close();
            }
            WindowEvent::Resized(size) => {
                let c = event.window().is_visible();

                println!("resized {:?}, {:?}", size, c);
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            get_state,
            set_timer_duration,
            set_pause_duration,
            set_long_pause_duration,
            set_timer_sound_id,
            set_pause_sound_id,
            set_autoplay,
            set_show_percentage,
            set_sessions_for_long_pause,
            set_time_to_add,
            create_session,
            delete_session,
            update_session,
            update_order_session,
            add_task,
            add_sound,
            delete_sound,
            rename_sound,
            delete_task,
            update_done_task,
            update_order_task,
            on_completed_session,
            on_selected_session,
            reload_state,
            change_theme,
            change_circle_style,
            change_message_on_pause,
            change_message_on_timer,
            change_app_resolution,
            save_sessions
        ])
        .run(tauri::generate_context!())
        .expect("error while building tauri application")
}
