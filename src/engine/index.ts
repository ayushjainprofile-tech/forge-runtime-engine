import { FreConfig } from "./types";
import { migrateConfig } from "./migrator";
import { parseJsonToAst } from "./parser";
import { validateAst } from "./validator";
import { normalizeAst, NormalizationReport } from "./normalizer";
import { optimizeAst } from "./optimizer";
import { registerAllRules } from "./rules";

export interface CompileResult {
  runtimeModel: any; // The AST optimized for runtime
  diagnostics: any[]; // Validation errors/warnings
  normalizations: NormalizationReport["fixes"];
  healthScore: number;
}

export function compileConfig(rawConfig: any): CompileResult {
  // 1. Initialize Registry
  registerAllRules();

  // 2. Migrate Schema
  const migratedConfig = migrateConfig(rawConfig);

  // 3. Parse JSON to AST
  const ast = parseJsonToAst(migratedConfig);

  // 4. Validate (Static Analysis & Business Rules)
  const diagnostics = validateAst(ast);

  // 5. Normalize (Autofix unsafe config)
  const { ast: normalizedAst, fixes } = normalizeAst(ast);

  // 6. Optimize (Prune dead code)
  const runtimeModel = optimizeAst(normalizedAst);

  // 7. Calculate Health Score
  const errorCount = diagnostics.filter(d => d.severity === "ERROR").length;
  const warningCount = diagnostics.filter(d => d.severity === "WARNING").length;
  const autoFixCount = fixes.length;
  
  // Basic heuristic: 100 - (errors * 10) - (warnings * 5) - (fixes * 2)
  let healthScore = 100 - (errorCount * 10) - (warningCount * 5) - (autoFixCount * 2);
  if (healthScore < 0) healthScore = 0;
  if (healthScore > 100) healthScore = 100;

  return {
    runtimeModel,
    diagnostics,
    normalizations: fixes,
    healthScore,
  };
}
