import { ValidationRule } from "../validator/types";

class PluginRegistry {
  private rules = new Map<string, ValidationRule>();

  registerRule(rule: ValidationRule) {
    if (this.rules.has(rule.id)) {
      throw new Error(`Rule with ID ${rule.id} already registered.`);
    }
    if (typeof rule.validate !== "function") {
      throw new Error(`Rule ${rule.id} is missing a validate() function.`);
    }
    this.rules.set(rule.id, rule);
  }

  getRules(): ValidationRule[] {
    return Array.from(this.rules.values());
  }

  getRule(id: string): ValidationRule | undefined {
    return this.rules.get(id);
  }
}

export const pluginRegistry = new PluginRegistry();
