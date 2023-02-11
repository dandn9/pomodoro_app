use chrono::{DateTime, Local};
use serde::{ser::SerializeStruct, Deserialize, Serialize, Serializer};
use std::{mem::drop, rc::Weak, sync::Arc};

use crate::state::AppStateTrait;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SessionState {
    pub sessions: Vec<Session>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: u32,
    pub name: String,
    pub color: String,
    pub is_selected: bool,
    pub time_spent: u32,
    pub total_sessions: u32,
    pub created_at: DateTime<Local>,
    pub tasks: Vec<Task>,
}
// impl Serialize for Session<'_> {
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::Serializer,
//     {
//         let mut state = serializer.serialize_struct("Session", 8)?;
//         state.serialize_field("id", &self.id)?;
//         state.serialize_field("name", &self.name)?;
//         state.serialize_field("color", &self.color)?;
//         state.serialize_field("is_selected", &self.is_selected)?;
//         state.serialize_field("time_spent", &self.time_spent)?;
//         state.serialize_field("total_sessions", &self.total_sessions)?;
//         state.serialize_field("created_at", &self.created_at)?;
//         state.serialize_field("tasks", &self.tasks)?;
//         state.end()
//     }
// }
// impl<'de> Deserialize<'de> for Session<'_> {
//     fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
//         where
//             D: serde::Deserializer<'de> {

//     }

//     fn deserialize_in_place<D>(deserializer: D, place: &mut Self) -> Result<(), D::Error>
//     where
//         D: serde::Deserializer<'de>,
//     {
//         // Default implementation just delegates to `deserialize` impl.
//         *place = try!(Deserialize::deserialize(deserializer));
//         Ok(())
//     }
// }

impl Session {
    pub fn new(name: String, color: Option<String>, id: u32) -> Session {
        let color = match color {
            Some(color) => color,
            None => "#000000".to_string(),
        };
        Session {
            id,
            name,
            color,
            is_selected: false,
            total_sessions: 0,
            time_spent: 0,
            created_at: Local::now(),
            tasks: vec![],
        }
    }
    pub fn on_done(&mut self, time: u32) {
        self.total_sessions += 1;
        self.time_spent += time;
    }
    pub fn set_time_spent(&mut self, time_spent: u32) {
        self.time_spent = time_spent;
    }
    pub fn add_task_string(&mut self, task_name: String) -> Result<String, String> {
        let task_id = self.get_latest_id() + 1;
        let task = Task::new(task_name, task_id);
        if self.check_if_task_exists(&task.name) {
            // it already exists
            Err("Task with same name already exists".to_string())
        } else {
            self.tasks.push(task);
            Ok("ok!".to_string())
        }
    }
    pub fn add_task(&mut self, mut task: Task) -> &mut Session {
        let task_id = self.get_latest_id();
        println!("latest id: {:?}", task_id);
        task.id = task_id + 1;
        self.tasks.push(task);
        self
    }
    pub fn delete_task(&mut self, task_id: u32) {
        self.tasks = self.tasks.drain(..).filter(|x| x.id != task_id).collect();
    }
    pub fn update_task_index(&mut self, curr_index: u32, to_index: u32) -> Result<String, String> {
        println!(
            "curr: {} , to: {}, tasks len: {}",
            curr_index,
            to_index,
            self.tasks.len()
        );

        if to_index > self.tasks.len() as u32 {
            return Err("Cannot insert a larger index than the last one".to_string());
        }

        let task = self.tasks.remove(curr_index as usize);
        self.tasks.insert(to_index as usize, task);

        Ok("Success".to_string())
    }
    pub fn remove_task_on_index(&mut self, task_index: u32) -> Option<Task> {
        Some(self.tasks.remove(task_index as usize))
    }

    pub fn get_task_mut(&mut self, id: u32) -> Option<&mut Task> {
        self.tasks.iter_mut().find(|x| x.id == id)
    }
    pub fn get_task(&self, id: u32) -> Option<&Task> {
        self.tasks.iter().find(|x| x.id == id)
    }
    pub fn check_if_task_exists(&self, name: &str) -> bool {
        self.tasks.iter().any(|task| task.name == name)
    }
    pub fn get_latest_id(&self) -> u32 {
        let mut highest_id = 0;
        for task in self.tasks.iter() {
            if task.id > highest_id {
                highest_id = task.id;
            }
        }
        highest_id
    }
}
impl SessionState {
    pub fn add_session(&mut self, session: Session) {
        self.sessions.push(session);
        self.save_state();
    }
    pub fn delete_session(&mut self, id: u32) {
        self.sessions = self.sessions.drain(..).filter(|x| x.id != id).collect();
        self.save_state();
    }
    pub fn get_session_mut(&mut self, id: u32) -> Option<&mut Session> {
        self.sessions.iter_mut().find(|x| x.id == id)
    }
    pub fn get_session(&self, id: u32) -> Option<&Session> {
        self.sessions.iter().find(|x| x.id == id)
    }
    pub fn select_session(&mut self, id: u32) {
        for session in self.sessions.iter_mut() {
            session.is_selected = session.id == id;
        }
        self.save_state();
    }
    pub fn update_session(&mut self, session: Session) {
        let index = self
            .sessions
            .iter()
            .position(|x| x.id == session.id)
            .unwrap();
        self.sessions[index] = session;
        let session_read = &self.sessions[index];

        if session_read.is_selected {
            self.select_session(session_read.id);
            return;
        };
        self.save_state();
    }
    // gets the session with the highest sequential id
    pub fn get_latest_id(&self) -> u32 {
        let mut highest_id = 0;
        for session in self.sessions.iter() {
            if session.id > highest_id {
                highest_id = session.id;
            }
        }
        highest_id
    }
}
impl AppStateTrait for SessionState {
    const FILE_NAME: &'static str = "SessionSettings.json";
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
