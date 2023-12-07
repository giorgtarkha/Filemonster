import { AddViewToGlobalContext, GetActiveView, GetNextAvailableViewId } from "./global";
import { ApplyStyleConfiguration, DEFAULT_STYLE_CONFIGURATION } from "./style";
import { View } from "./view";
import { DirectoryView } from "./directory_view";

document.addEventListener("DOMContentLoaded", async _ => {
    ApplyStyleConfiguration(document.documentElement, DEFAULT_STYLE_CONFIGURATION);
    const test: View = new DirectoryView(GetNextAvailableViewId(), "");
    await test.init();
    test.bind(document.body);
    test.update();
    AddViewToGlobalContext(test);
});

document.addEventListener("keydown", (event) => {
    event.preventDefault();
    const view = GetActiveView()!!; // TODO
    console.log(event.key, event.code, event.shiftKey, event.ctrlKey, event.altKey);
    view.handleKeyDown(event.key, event.code, event.altKey, event.shiftKey, event.ctrlKey);
});
