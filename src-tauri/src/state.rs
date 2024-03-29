use std::{
    cell::RefCell,
    error::Error,
    fs::{self, File, OpenOptions},
    io::{self, BufReader, Write},
    path::PathBuf,
    sync::{Arc, Mutex},
};

use crate::{preferences::PreferencesState, session::SessionState, timer::TimerState};
use once_cell::sync::Lazy;
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use tauri::api::path::app_data_dir;

// Appdata settings folder
pub static SETTINGS_FOLDER_PATH: Lazy<Mutex<String>> = Lazy::new(|| Mutex::new("".to_string()));
// Clone of config
pub static CONFIG: Lazy<Mutex<tauri::Config>> = Lazy::new(|| Mutex::new(tauri::Config::default()));

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppState {
    pub timer: TimerState,
    pub sessions: SessionState,
    pub preferences: PreferencesState,
}
impl AppState {
    pub fn get_state(&self) -> AppState {
        self.clone()
    }
}

pub trait AppStateTrait
where
    Self: Sized + Default + Serialize + DeserializeOwned,
{
    const FILE_NAME: &'static str;

    fn get_state_settings_or_init() -> Self {
        match Self::get_saved_state() {
            Ok(state) => {
                println!("State loaded from file");
                state
            }
            Err(_) => {
                println!("State not loaded from file");

                let state = Self::default();
                Self::save_state(&state);
                state
            }
        }
    }
    fn save_state(&self) -> () {
        let serialized = serde_json::to_string_pretty(self).unwrap();

        let file_path =
            PathBuf::from(SETTINGS_FOLDER_PATH.lock().unwrap().to_string()).join(Self::FILE_NAME);

        println!("SAVED STATE");
        OpenOptions::new()
            .write(true)
            .truncate(true)
            .create(true)
            .open(file_path)
            .unwrap()
            .write_all(serialized.as_bytes())
            .unwrap();
    }
    fn get_saved_state() -> Result<Self, Box<dyn Error>> {
        let file_path =
            PathBuf::from(SETTINGS_FOLDER_PATH.lock().unwrap().to_string()).join(Self::FILE_NAME);

        let f = OpenOptions::new().read(true).open(file_path)?;

        let reader = BufReader::new(f);
        let saved_state = serde_json::from_reader::<BufReader<File>, Self>(reader)?;

        Ok(saved_state)
    }
}

// pub static STATE: Mutex<AppState> = Mutex::new(AppState { timer: None });

pub fn init_or_get_state(app_config: &tauri::Config) -> AppState {
    *SETTINGS_FOLDER_PATH.lock().unwrap() = app_data_dir(app_config)
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    CONFIG.lock().unwrap().clone_from(app_config);

    setup_state_folder();
    println!("BASE PATH: {}", SETTINGS_FOLDER_PATH.lock().unwrap());

    let state = AppState {
        timer: TimerState::get_state_settings_or_init(),
        sessions: SessionState::get_state_settings_or_init(),
        preferences: PreferencesState::get_state_settings_or_init(),
    };
    state
}

pub fn setup_state_folder() {
    println!("Settings folder path!");
    // let config_dir = dirs::config_dir().unwrap().join(PREF_FOLDER_NAME);
    let base_path = PathBuf::from(SETTINGS_FOLDER_PATH.lock().unwrap().to_string());

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
