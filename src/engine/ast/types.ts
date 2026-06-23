export type ComponentType = "Text" | "Table" | "Card" | "Form" | "Dashboard" | "Chart" | "Fallback";

export interface AstNode {
  id: string;
  type: ComponentType | string;
  props: Record<string, any>;
  children?: AstNode[];
  _meta?: {
    originalPath?: string;
    isFallback?: boolean;
    missingId?: boolean;
    confidence?: "SAFE" | "BEST_GUESS";
  };
}

export interface AstRoot {
  schemaVersion: string;
  appMeta: {
    title: string;
    description?: string;
  };
  views: AstNode[];
  workflows?: any[];
}
