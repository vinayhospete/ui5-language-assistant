import deepFreezeStrict from "deep-freeze-strict";
import { cloneDeep } from "lodash";
import { Settings } from "../api";

// These properties are defined (with their default values) in the package.json of the client
const defaultSettings: Settings = {
  codeAssist: { deprecated: false, experimental: false },
  trace: { server: "off" },
  logging: { level: "error" },
  SAPUI5WebServer: "",
  SplitAttributesOnFormat: true,
  LimitUniqueIdDiagnostics: false,
};
deepFreezeStrict(defaultSettings);

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with VSCode or Theia
// but could happen with other clients.
let globalSettings: Settings = defaultSettings;
/**
 * Configuration settings
 */
let configSettings: Settings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Promise<Settings>> = new Map();

// Function used for testing purposes
export function resetSettings(): void {
  globalSettings = defaultSettings;
  documentSettings.clear();
}
export function getDefaultSettings(): Settings {
  return defaultSettings;
}

export function getSettingsForDocument(resource: string): Promise<Settings> {
  const result = documentSettings.get(resource);
  if (result === undefined) {
    return Promise.resolve(globalSettings);
  }
  return result;
}

export function hasSettingsForDocument(resource: string): boolean {
  return documentSettings.get(resource) !== undefined;
}

export function setSettingsForDocument(
  resource: string,
  settings: Promise<Settings>
): void {
  documentSettings.set(resource, settings);
}

export function clearSettings(): void {
  documentSettings.clear();
}

export function clearDocumentSettings(resource: string): void {
  documentSettings.delete(resource);
}

export function setGlobalSettings(settings: Settings): void {
  globalSettings = cloneDeep(settings);
  deepFreezeStrict(globalSettings);
}

export function setConfigurationSettings(settings: Settings): void {
  configSettings = cloneDeep(settings);
  deepFreezeStrict(configSettings);
}
export function getConfigurationSettings(): Settings {
  return deepFreezeStrict(configSettings);
}
