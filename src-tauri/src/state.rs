use std::{
    cell::RefCell,
    error::Error,
    fs::{self, File, OpenOptions},
    io::{self, BufReader, Write},
    path::PathBuf,
    sync::{Arc, Mutex},
};

use crate::preferences::PreferencesState;
use chrono::{DateTime, Local};
use once_cell::sync::Lazy;
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use tauri::{api::path::app_data_dir, App};

#[derive(Debug, Clone, Serialize, Deserialize, Copy)]
pub struct TimerState {
    pub _timer_duration: u32,
    pub _pause_duration: u32,
    pub _long_pause_duration: u32,
}

impl Default for TimerState {
    fn default() -> Self {
        TimerState {
            _timer_duration: 1500,      // 25 minutes
            _pause_duration: 300,       // 5 minutes
            _long_pause_duration: 1200, // 20 minutes
        }
    }
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub _id: u32,
    pub _name: String,
    pub _color: String,
    pub _is_selected: bool,
    pub _time_spent: u32,
    pub _total_sessions: u32,
    pub _created_at: DateTime<Local>,
    pub _tasks: Vec<Task>,
}

// TASK --
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Task {
    pub id: u32,
    pub name: String,
    pub is_done: bool,
}
impl Task {
    pub fn new(name: String, id: u32) -> Task {
        Task {
            id,
            name,
            is_done: false,
        }
    }
    pub fn update_task_done(&mut self, is_done: bool) {
        self.is_done = is_done
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppState {
    pub timer: TimerState,
    pub sessions: SessionsState,
    pub preferences: PreferencesState,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SessionsState {
    pub _sessions: Vec<Session>,
}
impl Default for SessionsState {
    fn default() -> Self {
        Self { _sessions: vec![] }
    }
}

impl AppState {
    pub fn default(app: &tauri::AppHandle) -> Self {
        Self {
            preferences: PreferencesState::default(app),
            sessions: SessionsState::default(),
            timer: TimerState::default(),
        }
    }
}

// pub static STATE: Mutex<AppState> = Mutex::new(AppState { timer: None });

const APP_STATE_FILE: &str = "app_state.json";

pub fn get_data_path(app: &tauri::AppHandle) -> PathBuf {
    app.path_resolver().app_data_dir().unwrap()
}

pub fn save_state(state: AppState, app: &tauri::AppHandle) -> Result<bool, Box<dyn Error>> {
    let serialized = serde_json::to_string_pretty(&state)?;

    let file_path = get_data_path(app).join(APP_STATE_FILE);

    OpenOptions::new()
        .write(true)
        .truncate(true)
        .create(true)
        .open(file_path)?
        .write_all(serialized.as_bytes())?;

    Ok(true)
}

fn get_saved_state(app: &tauri::AppHandle) -> Result<AppState, Box<dyn Error>> {
    let file_path = get_data_path(app).join(APP_STATE_FILE);

    let f = OpenOptions::new().read(true).open(file_path)?;

    let reader = BufReader::new(f);
    let saved_state = serde_json::from_reader::<BufReader<File>, AppState>(reader)?;

    Ok(saved_state)
}

pub fn init_or_get_state(app: &tauri::AppHandle) -> AppState {
    setup_state_folder(app);

    match get_saved_state(app) {
        Ok(state) => state,
        Err(_) => AppState::default(app),
    }

    // let state = AppState {
    //     timer: TimerState::get_state_settings_or_init(),
    //     sessions: SessionState::get_state_settings_or_init(),
    //     preferences: PreferencesState::get_state_settings_or_init(),
    // };
    // state
}

pub fn setup_state_folder(app: &tauri::AppHandle) {
    println!("Settings folder path!");
    let base_path = get_data_path(app);

    println!("Got folder path {:?}", base_path);
    match fs::create_dir(&base_path) {
        Ok(_) => println!("Created config directory"),
        Err(e) => {
            if e.kind() == io::ErrorKind::AlreadyExists {
                println!("Config directory already exists");
            } else {
                panic!("Failed to create config directory: {}", e);
            }
        }
    }
    match fs::create_dir(&base_path.join("audio")) {
        Ok(_) => println!("Created audio directory"),
        Err(e) => {
            if e.kind() == io::ErrorKind::AlreadyExists {
                println!("Audio directory already exists");
            } else {
                panic!("Failed to create audio directory: {}", e);
            }
        }
    }
}
