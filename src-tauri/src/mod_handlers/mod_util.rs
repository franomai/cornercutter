use std::collections::VecDeque;
use integer_encoding::VarInt;
use base64::{encode, decode};
use crate::types::structs::RoomSkills;

// Modified version of the decode from lib.rs
pub fn string_to_u32_vec(config_string: &str) -> Result<VecDeque<u32>, String> {
    let decodedResult = decode(config_string);
    if decodedResult.is_err() {
        return Err(String::from("Invalid mod code"));
    }

    let mut decoded = decodedResult.unwrap();

    let mut result: VecDeque<u32> = VecDeque::new();
    // Read u8 values as u32 varints
    while !decoded.is_empty() {
        let (read, size) = u32::decode_var(&decoded).ok_or("Invalid varint encountered")?;
        result.push_back(read);
        decoded = decoded[size..].to_vec();
    }
    Ok(result)
}

// Uses the same logic as https://github.com/arranf/deck-codes/blob/master/src/lib.rs
pub fn u32_vec_to_string(byte_array: Vec<u32>) -> String {
    let mut fixed_size_integers: Vec<u8> = Vec::new();
    // This is calculated by taking the largest dbfid and calculating ceil(log(dbfid, 128)) as 128 is the largest value a u8 can store.
    let mut encoded: [u8; 4] = [0, 0, 0, 0];
    for i in byte_array {
        let encoded_bytes = i.encode_var(&mut encoded[..]);
        for encoded_index in 0..encoded_bytes {
            fixed_size_integers.push(encoded[encoded_index]);
        }
    }
    return encode(&fixed_size_integers);
}

pub fn get_commented_string(original_string: &str) -> Result<String, String> {
    if !original_string.starts_with("#") {
        return Err("Not a valid comment string".to_string())
    }
    let result = original_string[1..original_string.len()].trim().to_string();
    Ok(result)
}

pub fn generate_empty_room_skills() -> RoomSkills{
    return RoomSkills {
        all: Vec::new(),
        free: Vec::new(),
        shop: Vec::new(),
        curse: Vec::new(),
        finale: Vec::new(),
    }
}