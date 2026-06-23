import React from "react";
import { AlertTriangle } from "lucide-react";
import { AstNode } from "@/engine/ast/types";

export function FallbackComponent({ node }: { node: AstNode }) {
  return (
    <div className="p-4 border border-white/10 bg-[#111] rounded-lg text-sm w-full shadow-inner relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-accent-secondary" />
      <div className="flex items-center gap-2 text-accent-secondary mb-2 font-medium">
        <AlertTriangle size={16} />
        <span>Graceful Fallback Active: "{node.type}"</span>
      </div>
      <p className="text-text-secondary text-xs mb-3">
        The engine could not find a registered renderer for this component type. The layout has automatically recovered and execution continues safely.
      </p>
      <div className="text-xs font-mono text-text-tertiary bg-bg-darker p-2 rounded overflow-auto">
        <pre>{JSON.stringify(node.props, null, 2)}</pre>
      </div>
    </div>
  );
}
