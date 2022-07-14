#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::Deserialize;

#[derive(Deserialize)]
struct Configuration  {
    disable_hp: bool,
    disable_other_drops: bool,
    spawns: SpawnType,
    curse_spawns: CurseSpawnType,

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
    return format!("You submitted: spawns: {:?}, curse spawns: {:?}", config.spawns, config.curse_spawns);
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .invoke_handler(tauri::generate_handler![accept_config])
        .run(context)
        .expect("error while running tauri application");
}
