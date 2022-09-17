use serde::{Deserialize, Serialize};
use std::fs::*;
use std::io::Read;
use std::io::Write;

#[derive(Serialize, Deserialize, Debug)]
pub struct Timer {
    timer: f32,
    pause: f32,
    label: String,
}
// could probably do some singleton patterns but i have no idea how to implement them in rust
// and also serialize them with the lifetimes etc.
impl Timer {
    pub fn new(timer: f32, pause: f32, label: &str) -> Self {
        Timer {
            timer,
            pause,
            label: label.to_string(),
        }
    }
    pub fn change_time(mut self, new_timer: f32) -> Self {
        self.timer = new_timer;
        self
    }
    pub fn change_pause(mut self, new_pause: f32) -> Self {
        self.pause = new_pause;
        self
    }
    pub fn change_label(mut self, new_label: &str) -> Self {
        self.label = new_label.to_string();
        self
    }
    pub fn get_time(&self) -> f32 {
        self.timer
    }
    pub fn get_pause(&self) -> f32 {
        self.pause
    }
    pub fn get_label(&self) -> &str {
        &self.label
    }
    pub fn get_timer() -> Result<Self, std::io::Error> {
        let mut file = File::open("../data/data.txt")?;
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

        let mut file = File::create("../data/data.txt").unwrap_or_else(|_e| {
            println!("Already exists");
            File::open("../data/data.txt").unwrap()
        });

        println!("created file");

        file.write_all(serialized.as_bytes())?;

        println!("wrote file");

        Ok(())
    }
}

pub fn get_timer_instance() -> Timer {
    let timer = Timer::get_timer().unwrap_or_else(|_e| {
        let timer = Timer::new(25.0, 5.0, "main");
        timer.save().expect("Something went wrong with saving");
        Timer::get_timer().expect("Something went wrong")
    });

    timer
}
