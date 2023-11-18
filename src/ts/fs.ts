type DirectoryItemType = string;

export const DIRECTORY_ITEM_TYPE_FILE: DirectoryItemType = "FILE";
export const DIRECTORY_ITEM_TYPE_DIRECTORY_GOBACK: DirectoryItemType = "DIRECTORY_GOBACK";
export const DIRECTORY_ITEM_TYPE_DIRECTORY: DirectoryItemType = "DIRECTORY";
export const DIRECTORY_ITEM_TYPE_UNKNOWN: DirectoryItemType = "UNKNOWN";

interface DirectoryItem {
    name: string;
    itemType: DirectoryItemType;
    size: number;
}

export type {
    DirectoryItemType,
    DirectoryItem,
}
