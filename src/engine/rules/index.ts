import { pluginRegistry } from "../registry";
import { missingIdRule } from "./missing-id";
import { duplicateIdRule } from "./duplicate-id";

export function registerAllRules() {
  try {
    pluginRegistry.registerRule(missingIdRule);
    pluginRegistry.registerRule(duplicateIdRule);
    // Future rules like Invalid Layout, Missing Title, etc., will be registered here.
  } catch (e) {
    // Ignore already registered errors during hot reloads
  }
}
