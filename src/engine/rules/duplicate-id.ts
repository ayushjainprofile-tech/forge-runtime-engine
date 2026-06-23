import { ValidationRule, ValidationDiagnostic } from "../validator/types";
import { AstNode, AstRoot } from "../ast/types";
import { v4 as uuidv4 } from 'uuid';

export const duplicateIdRule: ValidationRule = {
  id: "duplicate-id",
  severity: "ERROR",
  description: "All IDs must be unique across the entire configuration.",
  validate: (ast: AstRoot): ValidationDiagnostic[] => {
    const diagnostics: ValidationDiagnostic[] = [];
    const idMap = new Map<string, string>();
    const walk = (node: AstNode, path: string) => {
      if (node.id) {
        if (idMap.has(node.id)) {
          diagnostics.push({
            ruleId: "duplicate-id",
            nodeId: node.id,
            path,
            severity: "ERROR",
            message: `Duplicate ID found: "${node.id}". Previously defined at ${idMap.get(node.id)}`,
            reason: "IDs must be globally unique to ensure consistent virtual DOM updates and targeted actions.",
            impact: "Action handlers might trigger on the wrong component. React hydration errors.",
            confidence: "HIGH",
            autoFixStrategy: "Append a random unique suffix to the duplicate ID.",
            exampleFix: `"id": "action-form_dup_8f2a"`,
            documentationHint: "docs/rules/duplicate-id"
          });
        } else {
          idMap.set(node.id, path);
        }
      }
      if (node.children) {
        node.children.forEach((c, i) => walk(c, `${path}.children[${i}]`));
      }
    };
    ast.views.forEach((v, i) => walk(v, `views[${i}]`));
    return diagnostics;
  },
  autofix: (context) => {
    // Only autofix if it's actually requested for this node
    const generatedId = `${context.node.id}_dup_${uuidv4().split('-')[0]}`;
    return {
      node: { ...context.node, id: generatedId },
      confidence: "SAFE",
      message: `Renamed duplicate ID to ${generatedId}.`,
    };
  }
};
