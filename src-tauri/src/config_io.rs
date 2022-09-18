use std::fs::{File};
use std::io;
use std::path::Path;
use serde::{Serialize, Deserialize};

const CORNER_CUTTER_FILE: &str = "cornercutter.json";

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all="camelCase")]
pub struct CornerCutterConfig {
    pub going_under_dir: Option<String>,
}

pub fn retrieve_cornercutter_config() -> Result<CornerCutterConfig, io::Error> {
    let config_file_path = Path::new(CORNER_CUTTER_FILE);
    let file = File::open(config_file_path)?;
    let config: CornerCutterConfig = serde_json::from_reader(file)
        .expect("Error reading corner cutter config");

    return Ok(config);
}