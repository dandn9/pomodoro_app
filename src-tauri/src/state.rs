use std::{
    error::Error,
    fs::{self, File, OpenOptions},
    io::{self, BufReader, Write},
    path::PathBuf,
    sync::Mutex,
};

use crate::{session::SessionState, theme::ThemeState, timer::TimerState};
use serde::{de::DeserializeOwned, Deserialize, Serialize};

// Preference Folder
pub const PREF_FOLDER_NAME: &'static str = "pmdr_settings";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppState {
    pub timer: TimerState,
    pub sessions: SessionState,
    pub theme: ThemeState,
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

        #[cfg(not(debug_assertions))]
        let file_path = dirs::config_dir()
            .unwrap()
            .join(PREF_FOLDER_NAME)
            .join(Self::FILE_NAME);
        #[cfg(debug_assertions)]
        let file_path = PathBuf::new().join("../").join(Self::FILE_NAME);

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
        #[cfg(not(debug_assertions))]
        let file_path = dirs::config_dir()
            .unwrap()
            .join(PREF_FOLDER_NAME)
            .join(Self::FILE_NAME);

        #[cfg(debug_assertions)]
        let file_path = PathBuf::new().join("../").join(Self::FILE_NAME);

        let f = OpenOptions::new().read(true).open(file_path)?;

        let reader = BufReader::new(f);
        let saved_state = serde_json::from_reader::<BufReader<File>, Self>(reader)?;

        Ok(saved_state)
    }
}

// pub static STATE: Mutex<AppState> = Mutex::new(AppState { timer: None });

pub fn init_or_get_state() -> Mutex<AppState> {
    setup_state_folder();
    let state = AppState {
        timer: TimerState::get_state_settings_or_init(),
        sessions: SessionState::get_state_settings_or_init(),
        theme: ThemeState::get_state_settings_or_init(),
    };
    Mutex::new(state)
}

pub fn setup_state_folder() {
    let config_dir = dirs::config_dir().unwrap().join(PREF_FOLDER_NAME);

    match fs::create_dir(&config_dir) {
        Ok(_) => println!("Created config directory"),
        Err(e) => {
            if e.kind() == io::ErrorKind::AlreadyExists {
                println!("Config directory already exists");
            } else {
                panic!("Failed to create config directory: {}", e);
            }
        }
    }
}
