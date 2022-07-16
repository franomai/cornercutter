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
    remove_healing_items: bool,
    disable_mentor_abilities: bool,
    disable_gift_of_intern: bool,
    disable_pinned: bool,
    award_skills_per_level: bool,
    starting_skill_ids: Vec<i32>,
}

#[derive(Debug)]
#[derive(Deserialize)]
enum SpawnType {
    Looped, Weighted, Consecutive
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
         Remove healing items: {}, \
         Disable mentor abilties: {}, \
         Disable gift of the intern: {}, \
         Disabled pinned: {}, \
         Award skills per level: {}, \
         starting skill ids: {:?}
        ", config.spawns, config.curse_spawns, config.config_per_floor,
         config.config_per_room, config.remove_healing_items, config.disable_mentor_abilities,
         config.disable_gift_of_intern, config.disable_pinned, config.award_skills_per_level,
         config.starting_skill_ids
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
