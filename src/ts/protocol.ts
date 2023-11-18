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

export function ChangeDirectory(req: ChangeDirectoryRequest): Promise<ChangeDirectoryResult> {
    return invoke('change_directory', {
        directory: req.directory,
    });
} 

export type {
    ChangeDirectoryResult
};
