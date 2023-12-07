use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use crate::fileview_session::FileViewSession;

pub struct FileViewContext {
    sessions: HashMap<u64, Arc<RwLock<FileViewSession>>>,
}

impl FileViewContext {
    pub fn new() -> Self {
        FileViewContext {
            sessions: HashMap::new(),
        }
    }

    pub fn open_session(&mut self, id: u64) -> Arc<RwLock<FileViewSession>> {
        let session = Arc::new(RwLock::new(
            FileViewSession::new(id)
        ));
        self.sessions.insert(id, Arc::clone(&session));
        session
    }

    pub fn get_session(self, session_id: u64) -> Option<Arc<RwLock<FileViewSession>>> {
        self.sessions.get(&session_id).map(Arc::clone)
    }

    pub fn close_session(&mut self, session_id: u64) {
        self.sessions.remove(&session_id);
    }
}
