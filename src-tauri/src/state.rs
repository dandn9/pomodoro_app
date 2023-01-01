use serde::Serialize;
use std::{
    cell::{RefCell, RefMut},
    error::Error,
    fs::{File, OpenOptions},
    io::{BufReader, ErrorKind, Read, Write},
    path::Path,
    sync::Mutex,
};

use crate::timer::TimerState;
use serde::Deserialize;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppState {
    pub timer: TimerState,
}
impl AppState {
    pub fn set_state(&mut self, timer: TimerState) {
        self.timer = timer;
    }
    pub fn get_state(&self) -> AppState {
        self.clone()
    }
}

// pub static STATE: Mutex<AppState> = Mutex::new(AppState { timer: None });

pub fn init_or_get_state() -> Mutex<AppState> {
    match get_state() {
        Ok(state) => {
            println!("State loaded from file");
            Mutex::new(state)
        }
        Err(_) => {
            println!("State not loaded from file");

            let app_state = AppState {
                timer: TimerState::default(),
            };
            match save_state(&app_state) {
                Ok(_) => (),
                Err(_) => {
                    panic!("Couldn't save file")
                }
            };
            Mutex::new(app_state)
        }
    };
    Mutex::new(AppState {
        timer: TimerState::default(),
    })
}
fn save_state(state: &AppState) -> Result<(), serde_json::Error> {
    let serialized = serde_json::to_string(state)?;
    OpenOptions::new()
        .write(true)
        .truncate(true)
        .create(true)
        .open("../TimerSettings.json")
        .unwrap()
        .write_all(serialized.as_bytes())
        .unwrap();

    Ok(())
}
fn get_state() -> Result<AppState, Box<dyn Error>> {
    let f = OpenOptions::new()
        .read(true)
        .open("../TimerSettings.json")?;

    let reader = BufReader::new(f);
    let saved_state = serde_json::from_reader::<BufReader<File>, AppState>(reader)?;

    Ok(saved_state)
}
