use std::fs::{File, create_dir_all};
use std::io::{self, ErrorKind};
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use serde::{Serialize, Deserialize};

const CC_FILE: &str = "cornercutter.json";
const CC_MODS_DIR: &str = "cornercutter/mods";
const CC_CURRENT_MOD_DIR: &str = "cornercutter/current_mod.json";

pub struct CornercutterCache {
    pub config: Mutex<CornercutterConfig>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all="camelCase")]
pub struct CornercutterConfig {
    pub going_under_dir: Option<String>,
    pub set_directory: bool,
}

impl CornercutterConfig {
    pub fn new() -> Self {
        CornercutterConfig { 
            going_under_dir: try_find_going_under_dir(),
            set_directory: false,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all="camelCase")]
pub struct CornercutterCurrentMod {
    pub current_mod: Option<String>
}

pub fn file_exists(path: &Path) -> bool {
    return File::open(path).is_ok();
}

pub fn get_relative_dir(config: &CornercutterConfig, dir: &str) -> PathBuf {
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

pub fn load_cornercutter_config() -> CornercutterConfig {
    return deserialize_cornercutter_config().unwrap_or_else(|_err| CornercutterConfig::new());
}

pub fn serialize_cornercutter_config(config: &CornercutterConfig) {
    let config_file_path = Path::new(CC_FILE);
    // Open a file in write-only mode
    let file_result = File::create(&config_file_path);
    if file_result.is_err() {
        println!("couldn't create {}: {}", CC_FILE, file_result.unwrap_err());
        return;
    }

    let res = serde_json::to_writer(file_result.unwrap(), config);
    if res.is_err() {
        println!("Error writing cornercutter config: {}", res.unwrap_err());
    }
}

pub fn deserialize_cornercutter_config() -> Result<CornercutterConfig, io::Error> {
    let config_file_path = Path::new(CC_FILE);
    let file = File::open(&config_file_path);

    if file.is_ok() {
        let deserialized: Result<CornercutterConfig, serde_json::Error> = serde_json::from_reader(file.unwrap());
        if deserialized.is_ok() {
            let config = deserialized.unwrap();
            return Ok(config);
        }
        else {
            return Err(io::Error::new(ErrorKind::Other, deserialized.unwrap_err().to_string()))
        }
    } else {
        let config = CornercutterConfig::new();
        serialize_cornercutter_config(&config);
        return Ok(config);
    }
}

pub fn serialize_current_mod_config(config: &CornercutterConfig, current_mod: &CornercutterCurrentMod) {
    let config_file_path = get_relative_dir(config, CC_CURRENT_MOD_DIR);
    // Open a file in write-only mode
    let file_result = File::create(config_file_path);
    if file_result.is_err() {
        println!("couldn't create {}: {}", CC_CURRENT_MOD_DIR, file_result.unwrap_err());
        return;
    }

    let res = serde_json::to_writer(file_result.unwrap(), current_mod);
    if res.is_err() {
        println!("Error writing current mod config: {}", res.unwrap_err());
    }
} 

pub fn create_cornercutter_folders(config: &CornercutterConfig) {
    if config.going_under_dir.is_none() {
        return;
    }

    match create_dir_all(get_relative_dir(config, CC_MODS_DIR)) {
        Err(why) => {
            println!("Error creating mods directory {}: {}", CC_MODS_DIR, why);
            return;
        },
        Ok(_) => {},
    }

    let current_mod = CornercutterCurrentMod {
        current_mod: None,
    };
    serialize_current_mod_config(config, &current_mod)
}