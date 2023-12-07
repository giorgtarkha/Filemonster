use crate::FILEVIEW_CONTEXT;

#[tauri::command]
pub async fn open_file(filepath: &str, session_id: u64) -> Result<String, String> {
    let mut fcontext = FILEVIEW_CONTEXT.write().unwrap();
    fcontext.open_session(session_id);
    Ok(format!("test {0} {1}", filepath, session_id))
}
