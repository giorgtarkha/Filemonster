interface StyleConfigurationEntry {
    key: string;
    value: string;
}

interface StyleConfiguration {
    // General style configurations
    fontFamily: StyleConfigurationEntry;
    textColor: StyleConfigurationEntry;
    textColorHover: StyleConfigurationEntry;
    backgroundColor: StyleConfigurationEntry;
    backgroundColorHover: StyleConfigurationEntry;
    borderColor: StyleConfigurationEntry;

    // Directory view specific style configurations
    directoryViewFileColor: StyleConfigurationEntry;
    directoryViewDirectoryColor: StyleConfigurationEntry;
}

/** Default configuration */
export const DEFAULT_STYLE_CONFIGURATION: StyleConfiguration = {
    // General style configurations
    fontFamily: { key: "--font-family", value: "'Cascadia Code', monospace", },
    textColor: { key: "--text-color", value: "#f9f9f9", },
    textColorHover: { key: "--text-color-hover", value: "#707070", },
    backgroundColor: { key: "--background-color", value: "#2e2e2e", },
    backgroundColorHover: { key: "--background-color-hover", value: "#7d7d7d" },
    borderColor: { key: "--border-color", value: "#f7f7f7" },

    // Directory view specific style configurations
    directoryViewFileColor: { key: "--directory-item-file-color", value: "#00ffff" },
    directoryViewDirectoryColor: { key: "--directory-item-directory-color", value: "#f9f9f9" },
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
