import { AstRoot } from "../ast/types";
import { ValidationDiagnostic } from "./types";
import { pluginRegistry } from "../registry";

export function validateAst(ast: AstRoot): ValidationDiagnostic[] {
  const diagnostics: ValidationDiagnostic[] = [];
  const rules = pluginRegistry.getRules();

  for (const rule of rules) {
    const ruleDiagnostics = rule.validate(ast);
    diagnostics.push(...ruleDiagnostics);
  }

  return diagnostics;
}
