use std::collections::HashMap;
use std::fs::{File, create_dir_all, read_dir, remove_file, copy, metadata};
use std::io::{self, ErrorKind};
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use std::env::{current_dir, self};
use serde::{Serialize, Deserialize};
use winreg::enums::*;
use winreg::RegKey;

use crate::types::enums::GlobalOptions;
use  crate::types::structs::ModConfig;

const CC_FILE: &str = "cornercutter.json";
const CC_MODS_DIR: &str = "cornercutter/mods";
const CC_GLOBAL_SETTINGS_DIR: &str = "cornercutter/settings.json";

pub struct CornercutterCache {
    pub going_under_dir: String,
    pub settings: Mutex<CornercutterGlobalSettings>,
    pub config: Mutex<CornercutterConfig>,
    pub mods: Mutex<HashMap<String, ModConfig>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all="camelCase")]
pub struct CornercutterConfig {
    pub going_under_dir: String,
    pub set_directory: bool,
    pub is_first_startup: bool,
    pub is_setup_successful: bool,
    pub enable_user_metrics: bool,
}

impl CornercutterConfig {
    pub fn new() -> Self {
        let going_under_dir = get_going_under_dir();
        let is_setup_successful = is_setup_successful(going_under_dir.as_str());

        CornercutterConfig { 
            going_under_dir,
            set_directory: false,
            is_first_startup: true,
            is_setup_successful,
            enable_user_metrics: true,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all="camelCase")]
pub struct CornercutterGlobalSettings {
    pub current_mod: Option<String>,
    pub global_options: u32
}

impl CornercutterGlobalSettings {
    pub fn new() -> Self {
        let global_defaults = GlobalOptions::DISABLE_HIGHSCORES | GlobalOptions::DISABLE_STEAM_ACHIEVEMENTS;

        CornercutterGlobalSettings { 
            current_mod: None,
            global_options: global_defaults.bits(),
        }
    }
}

pub fn get_going_under_dir() -> String {
    // The r prefix specifies that this is a raw string and ignores escape characters.
    // When you install a steam app it creates a file in the windows registry which includes some metadata about it.
    // We're leveraging this metadata to determine the installation location of Going Under automatically. We can be 
    // assured that this will always be present otherwise the Cornercutter installation would have failed.
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let going_under = hklm.open_subkey(r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 1154810").unwrap();

    return going_under.get_value("InstallLocation").unwrap();
}

pub fn is_setup_successful(going_under_dir: &str) -> bool {
    if !is_cornercutter_installed(going_under_dir) {
        install_cornercutter(going_under_dir);
        // Check if the mod was successfully installed. This might fail if we don't have permission to create files where they
        // have Going Under installed.
        return is_cornercutter_installed(going_under_dir);
    }
    return true;
}

pub fn is_cornercutter_installed(going_under_dir: &str) -> bool {
    return folder_exists(get_relative_dir(going_under_dir, "BepInEx"));
}

pub fn file_exists<P>(path: P) -> bool where P: AsRef<Path> {
    return File::open(path).is_ok();
}

pub fn folder_exists<P>(path: P) -> bool where P: AsRef<Path> {
    return metadata(path).map(|metadata| metadata.is_dir()).unwrap_or(false);
}

pub fn has_extension(path: &Path, extension: &str) -> bool {
    return path.extension().map_or(false, |e| e.eq_ignore_ascii_case(extension));
}

pub fn get_relative_dir(going_under_dir: &str, dir: &str) -> PathBuf {
    let path_buf = Path::new(going_under_dir).join(dir);
    return path_buf;
}

pub fn as_io_error(err: serde_json::Error) -> io::Error {
    return io::Error::new(ErrorKind::Other, err);
}

pub fn get_mod_filename(id: String) -> String {
    let mut str = id.clone();
    str.push_str(".json");
    return str;
}

pub fn load_cornercutter_cache() -> CornercutterCache {
    // Cache the going under directory to prevent unnecessary reading of the registry.
    let going_under_dir = get_going_under_dir(); 
    let config = load_cornercutter_config();
    let settings = load_global_settings(going_under_dir.as_str());
    let mods = load_mods(&going_under_dir.as_str());

    if config.is_first_startup {
        create_cornercutter_folders(going_under_dir.as_str());
    }

    return CornercutterCache {
        going_under_dir,
        config: Mutex::new(config),
        settings: Mutex::new(settings),
        mods: Mutex::new(mods),
    }
}

pub fn load_cornercutter_config() -> CornercutterConfig {
    return deserialize_cornercutter_config().unwrap_or_else(|_err| CornercutterConfig::new());
}

pub fn load_global_settings(going_under_dir: &str) -> CornercutterGlobalSettings {
    return deserialize_settings_config(going_under_dir).unwrap_or_else(|_err| CornercutterGlobalSettings::new());
}

pub fn load_mods(going_under_dir: &str) -> HashMap<String, ModConfig> {
    let mut mods: HashMap<String, ModConfig> = HashMap::new();
    let files = read_dir(get_relative_dir(going_under_dir, CC_MODS_DIR));
    if files.is_ok() {
        for file in files.unwrap() {
            if file.is_err() {
                continue;
            }
            let path = file.unwrap().path();
            if !has_extension(path.as_path(), "json") {
                continue;
            }

            let deserialised: Result<ModConfig, serde_json::Error> = serde_json::from_reader(File::open(path).unwrap());
            if deserialised.is_ok() {
                let mod_config = deserialised.unwrap();
                mods.insert(mod_config.id.clone(), mod_config);
            }
        }
    }
    return mods;
}

pub fn serialize_mod(going_under_dir: &str, mod_config: &ModConfig) -> Result<(), String> {
    let filename = get_mod_filename(mod_config.id.clone());
    let path = get_relative_dir(going_under_dir, CC_MODS_DIR).join(filename.as_str());
    let file_result = File::create(path);
    if file_result.is_err() {
        return Err("There was an error creating the mod file".to_string());
    }

    let res = serde_json::to_writer(file_result.unwrap(), mod_config);
    if res.is_err() {
        return Err("There seems to be something wrong with the mod JSON".to_string());
    }
    Ok(())
}

pub fn delete_mod_file(going_under_dir: &str, mod_config: &ModConfig) -> io::Result<()> {
    let filename = get_mod_filename(mod_config.id.clone());
    let path = get_relative_dir(going_under_dir, CC_MODS_DIR).join(filename.as_str());
    return remove_file(path);
}

pub fn serialize_cornercutter_config(config: &CornercutterConfig) {
    let appdata = env::var("APPDATA").unwrap();
    let appdata_path = Path::new(appdata.as_str()).join("cornercutter");
    if !file_exists(&appdata_path) {
        let res = create_dir_all(&appdata_path);
        if !res.is_ok() {
            println!("Couldn't create cornercutter.json folder in AppData");
        }
    }

    let config_file_path = appdata_path.join(CC_FILE);
    // Open a file in write-only mode
    let file_result = File::create(config_file_path);
    if file_result.is_err() {
        println!("Couldn't create {}: {}", CC_FILE, file_result.unwrap_err());
        return;
    }

    let res = serde_json::to_writer(file_result.unwrap(), config);
    if res.is_err() {
        println!("Error writing cornercutter config: {}", res.unwrap_err());
    }
}

pub fn deserialize_cornercutter_config() -> Result<CornercutterConfig, io::Error> {
    let appdata = env::var("APPDATA").unwrap();
    let appdata_path = Path::new(appdata.as_str()).join("cornercutter").join(CC_FILE);

    println!("{}", appdata_path.to_str().unwrap());

    let file = File::open(&appdata_path);

    if file.is_ok() {
        let deserialized: Result<CornercutterConfig, serde_json::Error> = serde_json::from_reader(file.unwrap());
        if deserialized.is_ok() {
            let config = deserialized.unwrap();
            return Ok(config);
        }
        else {
            return Err(as_io_error(deserialized.unwrap_err()))
        }
    } else {
        let config = CornercutterConfig::new();
        serialize_cornercutter_config(&config);
        return Ok(config);
    }
}

pub fn serialize_settings_config(going_under_dir: &str, settings: &CornercutterGlobalSettings) {
    let config_file_path = get_relative_dir(going_under_dir, CC_GLOBAL_SETTINGS_DIR);
    // Open a file in write-only mode
    let file_result = File::create(config_file_path);
    if file_result.is_err() {
        println!("couldn't create {}: {}", CC_GLOBAL_SETTINGS_DIR, file_result.unwrap_err());
        return;
    }

    let res = serde_json::to_writer(file_result.unwrap(), settings);
    if res.is_err() {
        println!("Error writing current mod config: {}", res.unwrap_err());
    }
}

pub fn deserialize_settings_config(going_under_dir: &str) -> Result<CornercutterGlobalSettings, io::Error> {
    let config_file_path = get_relative_dir(going_under_dir, CC_GLOBAL_SETTINGS_DIR);
    let file = File::open(&config_file_path);

    if file.is_ok() {
        let deserialized: Result<CornercutterGlobalSettings, serde_json::Error> = serde_json::from_reader(file.unwrap());
        if deserialized.is_ok() {
            let settings = deserialized.unwrap();
            return Ok(settings);
        }
        else {
            return Err(as_io_error(deserialized.unwrap_err()))
        }
    } else {
        let settings = CornercutterGlobalSettings::new();
        serialize_settings_config(going_under_dir, &settings);
        return Ok(settings);
    }
}

// https://stackoverflow.com/a/65192210, no out of the box solution
pub fn copy_dir_all(src: impl AsRef<Path>, dst: impl AsRef<Path>) -> io::Result<()> {
    create_dir_all(&dst)?;
    for entry in read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(entry.path(), dst.as_ref().join(entry.file_name()))?;
        } else {
            copy(entry.path(), dst.as_ref().join(entry.file_name()))?;
        }
    }
    Ok(())
}

pub fn create_cornercutter_folders(going_under_dir: &str) {
    match create_dir_all(get_relative_dir(going_under_dir, CC_MODS_DIR)) {
        Err(why) => {
            println!("Error creating mods directory {}: {}", CC_MODS_DIR, why);
            return;
        },
        Ok(_) => {},
    }

    let mod_dir = current_dir().unwrap().join("built-mod");
    println!("Installing mod from {}", mod_dir.display());
    let res = copy_dir_all(mod_dir, Path::new(going_under_dir));
    if res.is_err() {
        println!("Error installing mod: {}", res.unwrap_err());
    }

    let current_mod = CornercutterGlobalSettings {
        current_mod: None,
        global_options: 0
    };
    serialize_settings_config(going_under_dir, &current_mod);
}

pub fn install_cornercutter(going_under_dir: &str) -> bool {
    let mod_dir = current_dir().unwrap().join("built-mod");
    println!("Installing mod from {}", mod_dir.display());
    let res = copy_dir_all(mod_dir, Path::new(going_under_dir));
    return res.is_ok();
}