interface CreateDivParams {
    id?: string,
    classList?: Array<string>,
    onClickListener?: (this: HTMLDivElement, ev: MouseEvent) => any,
    onDoubleClickListener?: (this: HTMLDivElement, ev: MouseEvent) => any,
}

export function CreateDiv(params: CreateDivParams): HTMLDivElement {
    const element = document.createElement("div");
    if (params.id) {
        element.id = params.id;
    }
    if (params.classList) {
        params.classList.forEach(cls => element.classList.add(cls));
    }
    if (params.onClickListener) {
        element.addEventListener("click", params.onClickListener);
    }
    if (params.onDoubleClickListener) {
        element.addEventListener("dblclick", params.onDoubleClickListener);
    }
    return element;
}
