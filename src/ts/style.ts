interface StyleConfigurationEntry {
    key: string;
    value: string;
}

interface StyleConfiguration {
    fontFamily: StyleConfigurationEntry;
    textColor: StyleConfigurationEntry;
    textColorHover: StyleConfigurationEntry;
    backgroundColor: StyleConfigurationEntry;
    backgroundColorHover: StyleConfigurationEntry;
}

/** Default configuration */
export const DEFAULT_STYLE_CONFIGURATION: StyleConfiguration = {
    fontFamily: { key: "--font-family", value: "'Cascadia Code', monospace", },
    textColor: { key: "--text-color", value: "#f9f9f9", },
    textColorHover: { key: "--text-color-hover", value: "#707070", },
    backgroundColor: { key: "--background-color", value: "#2e2e2e", },
    backgroundColorHover: { key: "--background-color-hover", value: "#7d7d7d" }
}

export function ApplyStyleConfiguration(element: HTMLElement, configuration: StyleConfiguration) {
    Object.values(configuration).forEach((styleConfiguration: StyleConfigurationEntry) => {
        element.style.setProperty(styleConfiguration.key, styleConfiguration.value);
    });
}

export type {
    StyleConfigurationEntry,
    StyleConfiguration,
}
