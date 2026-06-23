import { AstRoot, AstNode } from "../ast/types";

export function optimizeAst(ast: AstRoot): AstRoot {
  const optimizedAst: AstRoot = JSON.parse(JSON.stringify(ast));

  function optimizeNode(node: AstNode): AstNode | null {
    if (node.children) {
      // Remove dead components
      const optimizedChildren = node.children
        .map(optimizeNode)
        .filter((c): c is AstNode => c !== null);
      
      node.children = optimizedChildren;
    }

    // Optimization: empty page removal
    if ((node.type === "Page" || node.type === "Dashboard") && (!node.children || node.children.length === 0)) {
      return null;
    }

    return node;
  }

  optimizedAst.views = optimizedAst.views
    .map(optimizeNode)
    .filter((c): c is AstNode => c !== null);

  return optimizedAst;
}
