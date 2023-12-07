import { invoke } from '@tauri-apps/api/tauri';
import { DirectoryItem } from './fs';

interface ChangeDirectoryRequest {
    directory: string;
}

interface ChangeDirectoryResult {
    newDirectory: string;
    isRootDirectory: boolean;
    directoryItems: Array<DirectoryItem>;
}

// TODO error handling in callers
export function ChangeDirectory(req: ChangeDirectoryRequest): Promise<ChangeDirectoryResult> {
    return invoke('change_directory', {
        directory: req.directory,
    });
}

interface OpenFileRequest {
    filepath: string;
    sessionId: number;
}

// TODO error handling in callers
export function OpenFile(req: OpenFileRequest): Promise<void> {
    return invoke('open_file', {
        filepath: req.filepath,
        sessionId: req.sessionId,
    });
}

export type {
    ChangeDirectoryResult
};
