use serde::{Deserialize, Serialize};
use std::collections::hash_map::DefaultHasher;
use std::fs::*;
use std::hash::{Hash, Hasher};
use std::io::Read;
use std::io::Write;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Serialize, Deserialize, Debug)]
pub struct Timer {
    timer: u32,
    pause: u32,
    label: String,
}
// could probably do some singleton patterns but i have no idea how to implement them in rust
// and also serialize them with the lifetimes etc.
impl Timer {
    pub fn new(timer: u32, pause: u32, label: &str) -> Self {
        Timer {
            timer,
            pause,
            label: label.to_string(),
        }
    }
    pub fn change_time(mut self, new_timer: u32) -> Self {
        self.timer = new_timer;
        self
    }
    pub fn change_pause(mut self, new_pause: u32) -> Self {
        self.pause = new_pause;
        self
    }
    pub fn change_label(mut self, new_label: &str) -> Self {
        self.label = new_label.to_string();
        self
    }
    pub fn get_time(&self) -> u32 {
        self.timer
    }
    pub fn get_pause(&self) -> u32 {
        self.pause
    }
    pub fn get_label(&self) -> &str {
        &self.label
    }
    pub fn get_timer() -> Result<Self, std::io::Error> {
        let mut file = File::open("../data/timer.json")?;
        let mut serialized_json = String::new();
        file.read_to_string(&mut serialized_json)?;

        let timer: Timer = serde_json::from_str(&serialized_json)?;

        println!("Loaded timer: {:?}", timer);

        Ok(timer)
    }
    pub fn save(self) -> Result<(), std::io::Error> {
        let serialized = serde_json::to_string(&self)?;

        println!("{:?}", self);

        match create_dir("../data") {
            Ok(_) => println!("Created"),
            Err(_) => println!("Already Exists"),
        }

        println!("created dir");

        let mut file = File::create("../data/timer.json").unwrap_or_else(|_e| {
            println!("Already exists");
            File::open("../data/timer.json").unwrap()
        });

        println!("created file");

        file.write_all(serialized.as_bytes())?;

        println!("wrote file");

        Ok(())
    }
}

pub fn get_timer_instance() -> Timer {
    let timer = Timer::get_timer().unwrap_or_else(|_e| {
        // give a default timer else
        let timer = Timer::new(minute_to_secs(25), minute_to_secs(5), "main");
        timer.save().expect("Something went wrong with saving");
        Timer::get_timer().expect("Something went wrong")
    });

    timer
}

fn minute_to_secs(minutes: u32) -> u32 {
    minutes * 60
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Session {
    id: u32,
    label: String,
    total_time: u32,
    started_at: u64,
    selected: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Sessions {
    sessions: Vec<Session>,
}

impl Session {
    pub fn new(label: &str, duration: u32) -> Self {
        let mut s = DefaultHasher::new();
        label.hash(&mut s);
        let id = s.finish();
        Self {
            id: id as u32,
            label: label.to_string(),
            started_at: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64,
            total_time: duration,
            selected: false,
        }
    }
}
impl Sessions {
    // pub fn get_session(&self, id: u32) -> Session {}
    pub fn add_session(mut self, session: Session) -> Self {
        for existing_session in &mut self.sessions {
            if existing_session.id == session.id {
                (*existing_session).total_time += session.total_time;
                return self;
            }
        }
        self.sessions.push(session);
        self
    }
    pub fn remove_session(mut self, session_id: u32) -> Result<Self, String> {
        match self.sessions.iter().position(|x| x.id == session_id) {
            Some(id) => {
                self.sessions.remove(id);
                Ok(self)
            }
            None => Err(String::from("None found")),
        }
    }
    pub fn set_session_selected(mut self, session_id: u32) -> Self {
        for existing_session in &mut self.sessions {
            if existing_session.id == session_id {
                (*existing_session).selected = true;
            } else {
                (*existing_session).selected = false;
            }
        }
        self
    }

    pub fn save(self) -> Result<(), std::io::Error> {
        let serialized = serde_json::to_string(&self)?;

        println!("{:?}", self);

        match create_dir("../data") {
            Ok(_) => println!("Created"),
            Err(_) => println!("Already Exists"),
        }

        println!("created dir");

        let mut file = File::create("../data/sessions.json").unwrap_or_else(|_e| {
            println!("Already exists");
            File::open("../data/sessions.json").unwrap()
        });

        println!("created file");

        file.write_all(serialized.as_bytes())?;

        println!("wrote file");

        Ok(())
    }
    pub fn load() -> Result<Self, std::io::Error> {
        let mut file = match File::open("../data/sessions.json") {
            Ok(file) => file,
            Err(_) => File::create("../data/sessions.json")?,
        };
        println!("opened sessions file {:#?}", file);
        let mut serialized_json = String::new();

        match file.read_to_string(&mut serialized_json) {
            Ok(_) => println!("There was content"),
            Err(_) => println!("No content"),
        };

        let sessions: Sessions = serde_json::from_str(&serialized_json)
            .unwrap_or_else(|_err| Sessions { sessions: vec![] });

        println!("Loaded sessions: {:?}", sessions);

        Ok(sessions)
    }
}

pub fn get_sessions() -> Sessions {
    Sessions::load().unwrap()
}
