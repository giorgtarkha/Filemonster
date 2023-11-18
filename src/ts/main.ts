import { AddViewToGlobalContext, GetActiveView, GetNextAvailableViewId } from "./global";
import { ApplyStyleConfiguration, DEFAULT_STYLE_CONFIGURATION } from "./style";
import { View, DirectoryView } from "./view";

document.addEventListener("DOMContentLoaded", async _ => {
    ApplyStyleConfiguration(document.documentElement, DEFAULT_STYLE_CONFIGURATION);
    const test: View = new DirectoryView(GetNextAvailableViewId(), "");
    await test.init();
    test.render(document.body);
    AddViewToGlobalContext(test);
});

document.addEventListener("keydown", (event) => {
    event.preventDefault();
    const view = GetActiveView()!!; // TODO
    view.handleKeyDown(event.key, event.code);
});
