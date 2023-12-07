import { StyleConfiguration } from "./style";

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
    bind(parentElement: HTMLElement): void;
    update(): void;
    discard(): void;

    /**
     * Styling methods.
     */
    applyStyleConfiguration(styleConfiguration: StyleConfiguration): void;

    /**
     * Event methods.
     */
    handleKeyDown(key: String, code: String, alt: boolean, shift: boolean, ctrl: boolean): Promise<void>;
}

const VIEW_ID_PREFIX: string = "view-";
const VIEW_CLASS: string = "view";

export {
    ViewState,
    VIEW_ID_PREFIX,
    VIEW_CLASS,
}

export type {
    View,
}
