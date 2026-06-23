import { AstRoot, AstNode } from "../ast/types";
import { pluginRegistry } from "../registry";
import { AutofixContext } from "../validator/types";

export interface NormalizationReport {
  ast: AstRoot;
  fixes: {
    path: string;
    message: string;
    confidence: "SAFE" | "BEST_GUESS";
  }[];
}

export function normalizeAst(ast: AstRoot): NormalizationReport {
  const fixes: NormalizationReport["fixes"] = [];
  const rules = pluginRegistry.getRules();
  
  // Deep clone AST to mutate safely
  const normalizedAst: AstRoot = JSON.parse(JSON.stringify(ast));

  function walk(node: AstNode, path: string) {
    for (const rule of rules) {
      if (rule.autofix) {
        const context: AutofixContext = { node, path, ast: normalizedAst };
        const result = rule.autofix(context);
        if (result) {
          // Apply fix
          Object.assign(node, result.node);
          fixes.push({
            path,
            message: result.message,
            confidence: result.confidence
          });
        }
      }
    }

    if (node.children) {
      node.children.forEach((c, i) => walk(c, `${path}.children[${i}]`));
    }
  }

  normalizedAst.views.forEach((v, i) => walk(v, `views[${i}]`));

  return { ast: normalizedAst, fixes };
}
