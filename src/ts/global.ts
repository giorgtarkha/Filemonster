import { View } from "./view";

interface GlobalContext {
    activeViewId: number;
    views: Map<number, View>;
}

let nextAvailableViewId: number = 0;

const globalContext: GlobalContext = {
    activeViewId: 0,
    views: new Map<number, View>(),
};

export function GetGlobalContext(): GlobalContext {
    return globalContext;
}

export function GetNextAvailableViewId(): number {
    return nextAvailableViewId++;
}

export function GetActiveView(): View | null {
    return globalContext.views.get(globalContext.activeViewId) || null;
}

export function AddViewToGlobalContext(view: View): void {
    globalContext.views.set(view.id, view);
}
