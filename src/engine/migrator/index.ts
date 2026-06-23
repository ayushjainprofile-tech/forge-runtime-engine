import { FreConfig, CURRENT_ENGINE_VERSION } from "../types";
import { migrateFrom1_0_to_1_1 } from "./migrations/v1_0";
import { migrateFrom1_1_to_1_2 } from "./migrations/v1_1";

export class MigrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MigrationError";
  }
}

export function migrateConfig(config: any): FreConfig {
  if (!config || typeof config !== "object") {
    throw new MigrationError("Invalid configuration object");
  }

  let currentVersion = config.schemaVersion || "1.0";

  if (currentVersion === CURRENT_ENGINE_VERSION) {
    return config as FreConfig;
  }

  // 1.0 -> 1.1
  if (currentVersion === "1.0") {
    config = migrateFrom1_0_to_1_1(config);
    currentVersion = "1.1";
  }

  // 1.1 -> 1.2
  if (currentVersion === "1.1") {
    config = migrateFrom1_1_to_1_2(config);
    currentVersion = "1.2";
  }

  if (currentVersion !== CURRENT_ENGINE_VERSION) {
    throw new MigrationError(
      `Unsupported schema version. Expected <= ${CURRENT_ENGINE_VERSION}, got ${currentVersion}`
    );
  }

  return config as FreConfig;
}
