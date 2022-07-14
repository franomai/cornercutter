#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::Deserialize;

#[derive(Deserialize)]
struct Configuration  {
    spawns: SpawnType,
    curse_spawns: CurseSpawnType,
    config_per_floor: bool,
    config_per_room: bool,
    disable_hp: bool,
    disable_other_drops: bool,
    blank_on_empty: bool,
    disable_pinned: bool,
    award_per_level: bool,

}

#[derive(Debug)]
#[derive(Deserialize)]
enum SpawnType {
    Looped, Weighted
}

#[derive(Debug)]
#[derive(Deserialize)]
enum CurseSpawnType {
    Randomly, Always, Never
}

#[tauri::command]
fn accept_config(config: Configuration) -> String {
    return format!(
        "Spawns: {:?}, \
         Curse spawns: {:?}, \
         Config per floor: {}, \
         Config per room: {}, \
         Disable HP: {}, \
         Disable other drops: {}, \
         Blank on empty: {}, \
         Disabled pinned: {}, \
         Award per level: {}
        ", config.spawns, config.curse_spawns, config.config_per_floor,
         config.config_per_room, config.disable_hp, config.disable_other_drops,
         config.blank_on_empty, config.disable_pinned, config.award_per_level
    );
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .invoke_handler(tauri::generate_handler![accept_config])
        .run(context)
        .expect("error while running tauri application");
}
