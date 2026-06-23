import { FreConfig } from "../types";
import { AstRoot, AstNode } from "../ast/types";

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

export function parseJsonToAst(config: FreConfig): AstRoot {
  if (!config.views || !Array.isArray(config.views)) {
    throw new ParseError("Invalid configuration: missing or invalid 'views' array.");
  }

  return {
    schemaVersion: config.schemaVersion,
    appMeta: {
      title: config.title || "Untitled Application",
      description: config.description,
    },
    views: config.views.map((v, i) => parseNode(v, `views[${i}]`)),
    workflows: config.workflows || [],
  };
}

function parseNode(node: any, path: string): AstNode {
  if (!node || typeof node !== "object") {
    throw new ParseError(`Invalid node at ${path}`);
  }

  const children = Array.isArray(node.children) 
    ? node.children.map((child: any, i: number) => parseNode(child, `${path}.children[${i}]`))
    : undefined;

  return {
    id: node.id || "",
    type: node.type || "Unknown",
    props: node.props || {},
    children,
    _meta: {
      originalPath: path,
    }
  };
}
