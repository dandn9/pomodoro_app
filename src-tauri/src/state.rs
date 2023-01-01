use std::{
    error::Error,
    fs::{File, OpenOptions},
    io::{BufReader, Write},
    sync::Mutex,
};

use crate::timer::TimerState;
use serde::{de::DeserializeOwned, Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppState {
    pub timer: TimerState,
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
    const FILE_PATH: &'static str;

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
        let serialized = serde_json::to_string(self).unwrap();
        OpenOptions::new()
            .write(true)
            .truncate(true)
            .create(true)
            .open(Self::FILE_PATH)
            .unwrap()
            .write_all(serialized.as_bytes())
            .unwrap();
    }
    fn get_saved_state() -> Result<Self, Box<dyn Error>> {
        let f = OpenOptions::new().read(true).open(Self::FILE_PATH)?;

        let reader = BufReader::new(f);
        let saved_state = serde_json::from_reader::<BufReader<File>, Self>(reader)?;

        Ok(saved_state)
    }
}

// pub static STATE: Mutex<AppState> = Mutex::new(AppState { timer: None });

pub fn init_or_get_state() -> Mutex<AppState> {
    let state = AppState {
        timer: TimerState::get_state_settings_or_init(),
    };
    Mutex::new(state)
}
