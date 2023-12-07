import { CreateDiv } from "./dom";
import { DIRECTORY_ITEM_TYPE_DIRECTORY, DIRECTORY_ITEM_TYPE_DIRECTORY_GOBACK, DIRECTORY_ITEM_TYPE_FILE, DirectoryItem } from "./fs";
import { SingleActionLock } from "./lock";
import { ChangeDirectory, ChangeDirectoryResult, OpenFile } from "./protocol";
import { ApplyStyleConfiguration, StyleConfiguration } from "./style";
import { ViewState, View, VIEW_CLASS, VIEW_ID_PREFIX } from "./view"

const DIRECTORY_ITEM_ID_PREFIX: string = "directory-item-";

// Directory view classes
const DIRECTORY_CONTAINER_CLASS: string = "directory-container";
const DIRECTORY_HEADER_CONTAINER_CLASS: string = "directory-header-container";
const DIRECTORY_ITEMS_CONTAINER_CLASS: string = "directory-items-container";
const DIRECTORY_ITEM_CLASS: string = "directory-item";
const DIRECTORY_ITEM_TYPE_FILE_CLASS: string = "directory-item-type-file";
const DIRECTORY_ITEM_TYPE_DIRECTORY_CLASS: string = "directory-item-type-directory";
const SELECTED_ITEM_CLASS: string = "selected-item";

const BACK_DIRECTORY_ITEM: DirectoryItem = { 
    name: "..", 
    itemType: DIRECTORY_ITEM_TYPE_DIRECTORY_GOBACK, 
    size: 0 ,
};

class DirectoryView implements View {
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
    viewContainer: HTMLElement;
    directoryHeaderContainer: HTMLElement;
    directoryContainer: HTMLElement;
    directoryItemsContainer: HTMLElement;

    /**
     * Lock used for concurrent syncs/updates.
     */
    actionLock: SingleActionLock; // TODO revisit

    constructor(id: number, currentDirectory: string) {
        this.id = id;
        this.currentDirectory = currentDirectory;
        this.directoryItems = [];
        this.state = ViewState.CREATED;

        this.directoryHeaderContainer = this.createDirectoryHeaderContainer();
        this.directoryItemsContainer = this.createDirectoryItemsContainer();
        this.directoryContainer = this.createDirectoryContainer();
        this.viewContainer = this.createViewContainer();
        this.actionLock = new SingleActionLock();
    }

    async init(): Promise<void> {
        const changeDirectoryResult: ChangeDirectoryResult = await ChangeDirectory({ directory: this.currentDirectory });
        this.currentDirectory = changeDirectoryResult.newDirectory;
        this.directoryItems = [BACK_DIRECTORY_ITEM, ...changeDirectoryResult.directoryItems];
        this.state = ViewState.INITIALIZED;
    }

    bind(parentElement: HTMLElement): void {
        parentElement.appendChild(this.viewContainer);
    }

    /**
     * Render all dynamic state
     */
    update(): void { // TODO revisit
        // Update header
        if (this.directoryHeaderContainer.firstChild) {
            this.directoryHeaderContainer.firstChild.textContent = this.currentDirectory;
        }

        // Update directory items
        while (this.directoryItemsContainer.firstChild) {
            this.directoryItemsContainer.removeChild(this.directoryItemsContainer.firstChild);
        }
        this.directoryItems.forEach((directoryItem: DirectoryItem, index: number) => {
            const classes = [DIRECTORY_ITEM_CLASS];
            if (index === this.pointingAtIndex) {
                classes.push(SELECTED_ITEM_CLASS);
            }
            if (directoryItem.itemType === DIRECTORY_ITEM_TYPE_FILE) {
                classes.push(DIRECTORY_ITEM_TYPE_FILE_CLASS);
            } else if (directoryItem.itemType === DIRECTORY_ITEM_TYPE_DIRECTORY ||
                directoryItem.itemType === DIRECTORY_ITEM_TYPE_DIRECTORY_GOBACK) {
                classes.push(DIRECTORY_ITEM_TYPE_DIRECTORY_CLASS);
            }
            const directoryItemElement = CreateDiv({
                id: this.getDirectoryItemId(index),
                classList: classes,
                onClickListener: _ => this.onItemClick(index),
                onDoubleClickListener: _ => this.onItemDoubleClick(index),
            });
            directoryItemElement.innerText = directoryItem.name;
            this.directoryItemsContainer.appendChild(directoryItemElement);
        });
    }

    discard(): void {
        this.viewContainer.remove();
    }

    applyStyleConfiguration(styleConfiguration: StyleConfiguration): void {
        ApplyStyleConfiguration(this.viewContainer, styleConfiguration);
    }
    
    async onItemClick(index: number): Promise<void> {
        try {
            await this.actionLock.acquire();
            this.selectDirectoryItem(index);
        } catch (e: any) {
            return;
        } finally {
            this.actionLock.release();
        }
    }

    async onItemDoubleClick(index: number): Promise<void> {
        try {
            await this.actionLock.acquire();
            this.onItemChoice(index);
        } catch (e: any) {
            return;
        } finally {
            this.actionLock.release();
        }
    }

    async handleKeyDown(key: String, code: String, alt: boolean, shift: boolean, ctrl: boolean): Promise<void> {
        try {
            await this.actionLock.acquire();
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
        } catch (e: any) {
            return;
        } finally {
            this.actionLock.release();
        }
    }

    selectDirectoryItem(index: number): void {
        const directoryItem = this.directoryItemsContainer.querySelector(`#${this.getDirectoryItemId(index)}`);
        if (!directoryItem) { return; }
        const currentlySelected = this.directoryItemsContainer.querySelector(`.${SELECTED_ITEM_CLASS}`);
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
                const nextDirectory = this.currentDirectory + '\\' + directoryItem.name; 
                this.changeDirectory(nextDirectory); // TODO
                break;
            }
            case DIRECTORY_ITEM_TYPE_DIRECTORY_GOBACK: {
                const nextDirectory = this.currentDirectory.split('\\').slice(0, -1).join('\\');
                this.changeDirectory(nextDirectory); // TODO
                break;
            }
            case DIRECTORY_ITEM_TYPE_FILE: {
                const filepath = this.currentDirectory + '\\' + directoryItem.name;
                this.openFile(filepath);
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
        this.update();
    }

    async openFile(filepath: string): Promise<void> {
        await OpenFile({
            filepath: filepath,
            sessionId: this.id,
        });
    }

    createDirectoryHeaderContainer(): HTMLElement {
        const directoryHeaderContainer = CreateDiv({
            classList: [
                DIRECTORY_HEADER_CONTAINER_CLASS,
            ],
        });

        const currentDirectoryHeaderText = CreateDiv({});
        directoryHeaderContainer.appendChild(currentDirectoryHeaderText);

        return directoryHeaderContainer;
    }

    createDirectoryItemsContainer(): HTMLElement {
        return CreateDiv({
            classList: [
                DIRECTORY_ITEMS_CONTAINER_CLASS,
            ],
        });
    }

    createDirectoryContainer(): HTMLElement {
        const directoryContainer = CreateDiv({
            classList: [
                DIRECTORY_CONTAINER_CLASS,
            ],
        });

        directoryContainer.appendChild(this.directoryHeaderContainer);
        directoryContainer.appendChild(this.directoryItemsContainer);

        return directoryContainer;
    }

    createViewContainer(): HTMLElement {
        const viewContainer = CreateDiv({
            id: this.getViewId(),
            classList: [
                VIEW_CLASS
            ],
        });

        viewContainer.appendChild(this.directoryContainer);

        return viewContainer;
    }

    getViewId(): string {
        return `${VIEW_ID_PREFIX}${this.id}`;
    }

    getDirectoryItemId(index: number): string {
        return `${VIEW_ID_PREFIX}${this.id}${DIRECTORY_ITEM_ID_PREFIX}${index}`;
    }
}

export {
    DirectoryView,
}
