pub mod dirview {
    use crate::fs::fs::DirectoryItemType;
    use crate::fs::fs::DirectoryItem;

    #[derive(serde::Serialize)]
    #[serde(rename_all = "camelCase")]
    pub struct ChangeDirectoryResult {
        new_directory: String,
        is_root_directory: bool,
        directory_items: Vec<DirectoryItem>,
    }

    #[tauri::command]
    pub async fn change_directory(directory: &str) -> Result<ChangeDirectoryResult, String> {
        let dir_path = if directory.is_empty() {
            std::env::current_dir().map_err(|e| e.to_string())?
        } else {
            std::path::Path::new(directory).to_path_buf()
        };

        let entries: Result<Vec<DirectoryItem>, String> = std::fs::read_dir(dir_path.clone())
        .map_err(|e| e.to_string())?
        .filter_map(|entry| {
            entry.ok().map(|e| {
                let metadata = e.metadata().map_err(|e| e.to_string())?;
                let directory_type = if metadata.is_dir() {
                    DirectoryItemType::DIRECTORY
                } else if metadata.is_file() {
                    DirectoryItemType::FILE
                } else {
                    DirectoryItemType::UNKNOWN
                };
                let size = metadata.len();
                Ok(crate::fs::fs::DirectoryItem {
                    name: e.file_name().to_string_lossy().into_owned(),
                    item_type: directory_type,
                    size: size,
                })
            })
        })
        .collect();
        
        Ok(ChangeDirectoryResult { 
            new_directory: dir_path.to_string_lossy().to_string(),
            is_root_directory: false,
            directory_items: entries?
        })
    }
}
