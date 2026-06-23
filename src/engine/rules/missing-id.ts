import { ValidationRule, ValidationDiagnostic } from "../validator/types";
import { AstNode, AstRoot } from "../ast/types";
import { v4 as uuidv4 } from 'uuid';

export const missingIdRule: ValidationRule = {
  id: "missing-id",
  severity: "ERROR",
  description: "Nodes must have an ID.",
  validate: (ast: AstRoot): ValidationDiagnostic[] => {
    const diagnostics: ValidationDiagnostic[] = [];
    const walk = (node: AstNode, path: string) => {
      if (!node.id || node.id.trim() === "") {
        diagnostics.push({
          ruleId: "missing-id",
          nodeId: undefined,
          path,
          severity: "ERROR",
          message: `Field or component at ${path} is missing an ID.`,
          reason: "Components require unique IDs for state management and React key reconciliation.",
          impact: "Unstable component re-rendering and loss of local state.",
          confidence: "HIGH",
          autoFixStrategy: "Generate a random unique UUIDv4 prefix.",
          exampleFix: `"id": "field_a1b2c3d4"`,
          documentationHint: "docs/rules/missing-id"
        });
      }
      if (node.children) {
        node.children.forEach((c, i) => walk(c, `${path}.children[${i}]`));
      }
    };
    ast.views.forEach((v, i) => walk(v, `views[${i}]`));
    return diagnostics;
  },
  autofix: (context) => {
    if (!context.node.id || context.node.id.trim() === "") {
      const generatedId = `field_${uuidv4().split('-')[0]}`;
      return {
        node: { ...context.node, id: generatedId },
        confidence: "SAFE",
        message: `Field missing ID. Generated ${generatedId}.`,
      };
    }
    return null;
  }
};
