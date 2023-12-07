#[derive(serde::Serialize)]
pub enum DirectoryItemType {
    FILE,
    DIRECTORY,
    UNKNOWN,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DirectoryItem {
    pub name: String,
    pub item_type: DirectoryItemType,
    pub size: u64,
}
