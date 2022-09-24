use std::fs::{File, create_dir_all};
use std::io::{self, ErrorKind};
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use serde::{Serialize, Deserialize};

const CORNER_CUTTER_FILE: &str = "cornercutter.json";

pub struct CornerCutterCache {
    pub config: Mutex<CornerCutterConfig>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all="camelCase")]
pub struct CornerCutterConfig {
    pub going_under_dir: Option<String>,
    pub set_directory: bool,
}

impl CornerCutterConfig {
    pub fn new() -> Self {
        CornerCutterConfig { 
            going_under_dir: try_find_going_under_dir(),
            set_directory: false,
        }
    }
}

pub fn file_exists(path: &Path) -> bool {
    return File::open(path).is_ok();
}

pub fn get_relative_dir(config: &CornerCutterConfig, dir: &str) -> PathBuf {
    let path_buf = Path::new(config.going_under_dir.as_ref().unwrap()).join(dir);
    return path_buf;
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
    return file_exists(Path::new(dir).join("Going Under.exe").as_path());
}

pub fn load_cornercutter_config() -> CornerCutterConfig {
    return deserialize_cornercutter_config().unwrap_or_else(|_err| CornerCutterConfig::new());
}

pub fn serialize_cornercutter_config(config: &CornerCutterConfig) {
    let config_file_path = Path::new(CORNER_CUTTER_FILE);
    // Open a file in write-only mode
    let file_result = File::create(&config_file_path);
    if file_result.is_err() {
        println!("couldn't create {}: {}", CORNER_CUTTER_FILE, file_result.unwrap_err());
        return;
    }

    let res = serde_json::to_writer(file_result.unwrap(), config);
    if res.is_err() {
        println!("Error writing  cornercutter config: {}", res.unwrap_err());
    }
}

pub fn deserialize_cornercutter_config() -> Result<CornerCutterConfig, io::Error> {
    let config_file_path = Path::new(CORNER_CUTTER_FILE);
    let file = File::open(&config_file_path);

    if file.is_ok() {
        let deserialized: Result<CornerCutterConfig, serde_json::Error> = serde_json::from_reader(file.unwrap());
        if deserialized.is_ok() {
            let config = deserialized.unwrap();
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

pub fn create_cornercutter_folders(config: &CornerCutterConfig) {
    if config.going_under_dir.is_none() {
        return;
    }
    match create_dir_all(get_relative_dir(config, "/cornercutter/mods")) {
        Err(why) => {
            println!("Error creating mods directory: {}", why);
            return;
        },
        Ok(_) => {},
    }

}