const BUFFER_SIZE: usize = 2 * 1024 * 1024;

pub struct FileViewSession {
    pub id: u64,
    pub top_buffer: Box<[u64]>,
    pub current_buffer: Box<[u64]>,
    pub bottom_buffer: Box<[u64]>,
}

impl FileViewSession {
    pub fn new(id: u64) -> Self {
        FileViewSession {
            id: id,
            top_buffer: vec![0; BUFFER_SIZE].into_boxed_slice(),
            current_buffer: vec![0; BUFFER_SIZE].into_boxed_slice(),
            bottom_buffer: vec![0; BUFFER_SIZE].into_boxed_slice(),
        }
    }
}
