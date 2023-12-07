// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod fs;
mod dirview;
mod fileview;
mod fileview_session;
mod fileview_context;

use std::sync::RwLock;
use lazy_static::lazy_static;

lazy_static! {
    static ref FILEVIEW_CONTEXT: RwLock<fileview_context::FileViewContext> = 
        RwLock::new(fileview_context::FileViewContext::new());
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            dirview::change_directory,
            fileview::open_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
