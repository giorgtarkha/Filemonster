import { CreateDiv } from "./dom";
import { DIRECTORY_ITEM_TYPE_DIRECTORY, DIRECTORY_ITEM_TYPE_DIRECTORY_GOBACK, DirectoryItem } from "./fs";
import { ChangeDirectory, ChangeDirectoryResult } from "./protocol";
import { ApplyStyleConfiguration, StyleConfiguration } from "./style";

const VIEW_ID_PREFIX: string = "view-";
const DIRECTORY_ITEM_ID_PREFIX: string = "directory-item-";

enum ViewState {
    CREATED,
    INITIALIZED,
}

interface View {
    id: number;
    state: ViewState;

    /**
     * Lifecycle methods.
     */
    init(): Promise<void>; 
    render(parentElement: HTMLElement): void;
    discard(): void;

    /**
     * Styling methods.
     */
    applyStyleConfiguration(styleConfiguration: StyleConfiguration): void;

    /**
     * Keyboard methods.
     */
    handleKeyDown(key: String, code: String): void;
}

const DIRECTORY_VIEW_CLASS: string = "directory-view";
const DIRECTORY_VIEW_ITEM_CLASS: string = "directory-view-item";
const SELECTED_ITEM_CLASS: string = "selected-item";
const BACK_DIRECTORY_ITEM: DirectoryItem = { 
    name: "..", 
    itemType: DIRECTORY_ITEM_TYPE_DIRECTORY_GOBACK, 
    size: 0 ,
};

class DirectoryView implements View {
    /**
     * View members
     */
    id: number;
    state: ViewState;

    /**
     * Current directory open in the view.
     */
    currentDirectory: string;

    directoryItems: Array<DirectoryItem>;

    /**
     * Directory item we are pointing at.
     * Index is used when after sync directory item with current name disappears.
     * Directory item is used when after sync directory changes (files/directories get added/removed, index shifts).
     */
    pointingAtIndex: number = 0;
    pointingAtDirectoryItem: string = "";

    /**
     * Pointers to html elements.
     */
    container: HTMLElement;

    constructor(id: number, currentDirectory: string) {
        this.id = id;
        this.currentDirectory = currentDirectory;
        this.directoryItems = [];
        this.state = ViewState.CREATED;
        this.container = CreateDiv({
            id: VIEW_ID_PREFIX + this.id,
            classList: [
                DIRECTORY_VIEW_CLASS
            ],
        });
    }

    async init(): Promise<void> {
        const changeDirectoryResult: ChangeDirectoryResult = await ChangeDirectory({ directory: this.currentDirectory });
        this.currentDirectory = changeDirectoryResult.newDirectory;
        this.directoryItems = [BACK_DIRECTORY_ITEM, ...changeDirectoryResult.directoryItems];
        this.state = ViewState.INITIALIZED;
    }

    render(parentElement: Node | null = null): void {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.directoryItems.forEach((directoryItem: DirectoryItem, index: number) => {
            const directoryItemElement = CreateDiv({
                id: this.getDirectoryItemId(index),
                classList: [
                    DIRECTORY_VIEW_ITEM_CLASS,
                    ...(index === this.pointingAtIndex ? [SELECTED_ITEM_CLASS] : []),
                ],
                onClickListener: _ => this.onItemClick(index),
                onDoubleClickListener: _ => this.onItemDoubleClick(index),
            });
            directoryItemElement.innerText = directoryItem.name;
            this.container.appendChild(directoryItemElement);
        });
        if (parentElement) {
            parentElement.appendChild(this.container);
        }
    }

    discard(): void {
        this.container.remove();
    }

    applyStyleConfiguration(styleConfiguration: StyleConfiguration): void {
        ApplyStyleConfiguration(this.container, styleConfiguration);
    }
    
    onItemClick(index: number): void {
        this.selectDirectoryItem(index);
    }

    onItemDoubleClick(index: number): void {
        this.onItemChoice(index);
    }

    handleKeyDown(key: String, code: String): void {
        if (key === "ArrowDown") {
            if (this.pointingAtIndex < this.directoryItems.length) {
                this.selectDirectoryItem(this.pointingAtIndex + 1);
            }
        } else if (key === "ArrowUp") {
            if (this.pointingAtIndex > 0) {
                this.selectDirectoryItem(this.pointingAtIndex - 1);
            }
        } else if (key === "Enter") {
            this.onItemChoice(this.pointingAtIndex);
        } else if (key === "End" || code === "Numpad1") {
            this.selectDirectoryItem(this.directoryItems.length - 1);
        } else if (key === "Home" || code === "Numpad7") {
            this.selectDirectoryItem(0);
        }
    }

    getViewId(): string {
        return `${VIEW_ID_PREFIX}${this.id}`;
    }

    getDirectoryItemId(index: number): string {
        return `${VIEW_ID_PREFIX}${this.id}${DIRECTORY_ITEM_ID_PREFIX}${index}`;
    }

    selectDirectoryItem(index: number): void {
        console.log(index);
        const directoryItem = this.container.querySelector(`#${this.getDirectoryItemId(index)}`);
        if (!directoryItem) { return; }
        const currentlySelected = this.container.querySelector(`.${SELECTED_ITEM_CLASS}`);
        if (currentlySelected) {
            currentlySelected.classList.remove(SELECTED_ITEM_CLASS);
        }
        directoryItem.classList.toggle(SELECTED_ITEM_CLASS);
        this.pointingAtIndex = index;
        this.pointingAtDirectoryItem = this.directoryItems[this.pointingAtIndex].name;
    }

    onItemChoice(index: number): void {
        const directoryItem = this.directoryItems[index];
        switch (directoryItem.itemType) {
            case DIRECTORY_ITEM_TYPE_DIRECTORY: {
                this.changeDirectory(this.currentDirectory + "\\" + directoryItem.name); // TODO
                break;
            }
            case DIRECTORY_ITEM_TYPE_DIRECTORY_GOBACK: {
                this.changeDirectory(this.currentDirectory.split('\\').slice(0, -1).join('\\')); // TODO
                break;
            }
            default: {
                break;
            }
        }
    }

    async changeDirectory(newDirectory: string): Promise<void> {
        const changeDirectoryResult: ChangeDirectoryResult = await ChangeDirectory({ 
            directory: newDirectory,
        });
        this.currentDirectory = changeDirectoryResult.newDirectory;
        this.directoryItems = [BACK_DIRECTORY_ITEM, ...changeDirectoryResult.directoryItems];
        this.pointingAtIndex = 0;
        this.pointingAtDirectoryItem = this.directoryItems[this.pointingAtIndex].name;
        this.render();
    }
}

export {
    DirectoryView,
}

export type {
    View,
}
