import { AstNode, AstRoot } from "../ast/types";

export type ValidationSeverity = "ERROR" | "WARNING" | "INFO";

export interface ValidationDiagnostic {
  ruleId: string;
  nodeId?: string;
  path?: string;
  severity: ValidationSeverity;
  message: string;
  reason?: string;
  impact?: string;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
  autoFixStrategy?: string;
  exampleFix?: string;
  documentationHint?: string;
}

export interface AutofixContext {
  node: AstNode;
  path: string;
  ast: AstRoot;
}

export interface AutofixResult {
  node: AstNode;
  confidence: "SAFE" | "BEST_GUESS";
  message: string;
}

export interface ValidationRule {
  id: string;
  severity: ValidationSeverity;
  description: string;
  validate: (ast: AstRoot) => ValidationDiagnostic[];
  autofix?: (context: AutofixContext) => AutofixResult | null;
}
