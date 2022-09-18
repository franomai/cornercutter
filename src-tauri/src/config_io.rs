use std::fs::{File};
use std::io::{self, ErrorKind};
use std::path::Path;
use serde::{Serialize, Deserialize};

const CORNER_CUTTER_FILE: &str = "cornercutter.json";

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all="camelCase")]
pub struct CornerCutterConfig {
    pub going_under_dir: Option<String>,
    pub first_time: bool,
}

impl CornerCutterConfig {
    pub fn new() -> Self {
        CornerCutterConfig {
            going_under_dir: try_find_going_under_dir(),
            first_time: true,
        }
    }
}

pub fn deserialize_cornercutter_config() -> Result<CornerCutterConfig, io::Error> {
    let config_file_path = Path::new(CORNER_CUTTER_FILE);
    let file = File::open(&config_file_path);

    if file.is_ok() {
        let deserialized: Result<CornerCutterConfig, serde_json::Error> = serde_json::from_reader(file.unwrap());
        if deserialized.is_ok() {
            let mut config = deserialized.unwrap();
            if config.first_time == true {
                config.first_time = false;
                serialize_cornercutter_config(&config)
            }

            return Ok(config);
        }
        else {
            return Err(io::Error::new(ErrorKind::Other, deserialized.unwrap_err().to_string()))
        }
    } else {
        let config = CornerCutterConfig::new();
        serialize_cornercutter_config(&config);
        return Ok(config);
    }
}

pub fn file_exists(dir: &str) -> bool {
    let path = Path::new(dir);
    return File::open(path).is_ok();
}

pub fn try_find_going_under_dir() -> Option<String> {
    for dir in ["C:\\Program Files (x86)\\Steam\\steamapps\\common\\Going Under", "D:\\Steam\\steamapps\\common\\Going Under"] {
        if is_valid_going_under_dir(dir) {
            return Some(String::from(dir));
        }
    }
    return None;
}

pub fn is_valid_going_under_dir(dir: &str) -> bool {
    return file_exists(&[dir, "\\Going Under.exe"].join(""));
}


pub fn serialize_cornercutter_config(config: &CornerCutterConfig) {
    let config_file_path = Path::new(CORNER_CUTTER_FILE);
    // Open a file in write-only mode
    let file = match File::create(&config_file_path) {
        Err(why) => panic!("couldn't create {}: {}", CORNER_CUTTER_FILE, why),
        Ok(file) => file,
    };

    serde_json::to_writer(file, config)
        .expect("Error writing  cornercutter config");
}