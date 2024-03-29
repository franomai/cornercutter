#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::collections::HashMap;

mod config_io;
use config_io::{
    CornercutterConfig,
    CornercutterCache,
    CornercutterGlobalSettings,
    load_cornercutter_cache,
    serialize_mod,
    get_mod_filename,
    serialize_settings_config,
    delete_mod_file, serialize_cornercutter_config
};

mod mod_handlers;
use mod_handlers::{
    mod_util::generate_empty_room_skills,
    mod_reader::decode_configuration,
    mod_writer::encode_configuration
};

mod types;
use types::structs::{ModConfig, ModInfo, GeneralConfig, FloorSkills};
use types::enums::{
    SpawnType,
    CurseSpawnType,
    PedestalSpawnType,
    MultiSpawnerType, Options
};

use tauri::State;
use uuid::Uuid;

#[tauri::command]
fn get_settings(cache: State<CornercutterCache>) -> CornercutterGlobalSettings {
    return cache.settings.lock().unwrap().clone();
}

#[tauri::command]
fn get_cornercutter_config(cache: State<CornercutterCache>) -> CornercutterConfig {
    let config = cache.config.lock().unwrap();
    return config.clone();
}

#[tauri::command]
fn set_is_not_first_startup(cache: State<CornercutterCache>) {
    let mut config = cache.config.lock().unwrap();
    config.is_first_startup = false;
    serialize_cornercutter_config(&config);
}

#[tauri::command]
fn set_enable_user_metrics(cache: State<CornercutterCache>, enable_user_metrics: bool) {
    let mut config = cache.config.lock().unwrap();
    config.enable_user_metrics = enable_user_metrics;
    serialize_cornercutter_config(&config);
}


#[tauri::command]
fn get_mods(cache: State<CornercutterCache>) -> Vec<ModConfig> {
    let mods = cache.mods.lock()
        .unwrap()
        .values()
        .map(|mod_config| mod_config.clone())
        .collect();
    return mods;
}

#[tauri::command]
fn set_global_options(cache: State<CornercutterCache>, options: u32) -> bool {
    let mut settings = cache.settings.lock().unwrap();
    settings.global_options = options;
    serialize_settings_config(cache.going_under_dir.as_str(), &settings);
    return true;
}

#[tauri::command]
fn delete_mod(cache: State<CornercutterCache>, mod_id: String) {
    let mut mods = cache.mods.lock().unwrap();
    if mods.contains_key(&mod_id) {
        let mod_config = mods.remove(&mod_id).unwrap();
        delete_mod_file(cache.going_under_dir.as_str(), &mod_config);
    }
}

#[tauri::command]
fn save_mod(cache: State<CornercutterCache>, mod_config: ModConfig) -> Result<(), String> {
    let result = serialize_mod(cache.going_under_dir.as_str(), &mod_config);
    if result.is_ok() {
        cache.mods.lock().unwrap().insert(mod_config.id.clone(), mod_config);
    }
    return result;
}

#[tauri::command]
fn import_mod(cache: State<CornercutterCache>, config_string: String) -> Result<ModConfig, String> {
    let id = get_new_id(&cache.mods.lock().unwrap());

    let res = match decode_configuration(&config_string, &id) {
        Err(err) => Err(err),
        Ok(mod_config) => {
            let result  = serialize_mod(cache.going_under_dir.as_str(), &mod_config);
            cache.mods.lock().unwrap().insert(id, mod_config.clone());
            result.map(|_| mod_config)
        },
    };
    
    return res;
}

#[tauri::command]
fn get_new_mod_id(cache: State<CornercutterCache>) -> String {
    return get_new_id(&cache.mods.lock().unwrap());
}

#[tauri::command]
fn create_new_mod(cache: State<CornercutterCache>, mod_info: ModInfo) -> Result<ModConfig, String> {
    let id = get_new_id(&cache.mods.lock().unwrap());
    let mod_config = ModConfig{
        id,
        info: mod_info,
        general: GeneralConfig{
            spawns: SpawnType::Consecutive,
            curse_spawns: CurseSpawnType::Randomly,
            pedestal_spawns: PedestalSpawnType::Randomly,
            multi_spawners: MultiSpawnerType::Randomly,
            options: Options::SELECT_RANDOM_ITEM_ON_EMPTY.bits(),
            starting_skills: Vec::new(),
        },
        floor_skills: FloorSkills{
            all_floors: generate_empty_room_skills(),
            first_floor: generate_empty_room_skills(),
            second_floor: generate_empty_room_skills(),
            third_floor: generate_empty_room_skills(),
            boss: generate_empty_room_skills(),
        },
    };

    let result = serialize_mod(cache.going_under_dir.as_str(), &mod_config);
    return result.map(|_| {
        cache.mods.lock().unwrap().insert(mod_config.id.clone(), mod_config.clone());
        return mod_config;
    });
}

#[tauri::command]
fn set_enabled_mod(cache: State<CornercutterCache>, enabled_mod: Option<String>) {
    cache.settings.lock().unwrap().current_mod = enabled_mod.map(|id| get_mod_filename(id));
    serialize_settings_config(cache.going_under_dir.as_str(), &cache.settings.lock().unwrap())
}

#[tauri::command]
fn get_config_code(mod_config: ModConfig) -> String {
    return encode_configuration(mod_config);
}

fn get_new_id(map: &HashMap<String, ModConfig>) -> String {
    let mut uuid = Uuid::new_v4().to_string();

    while map.contains_key(&uuid) {
        uuid = Uuid::new_v4().to_string();
    }

    return uuid;
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .manage(load_cornercutter_cache())
        .invoke_handler(tauri::generate_handler![
            get_config_code, 
            get_cornercutter_config, 
            set_is_not_first_startup,
            set_enable_user_metrics,
            get_settings,
            delete_mod,
            save_mod,
            get_mods,
            import_mod,
            get_new_mod_id,
            create_new_mod,
            set_enabled_mod,
            set_global_options
        ])
        .run(context)
        .expect("error while running tauri application");
}
