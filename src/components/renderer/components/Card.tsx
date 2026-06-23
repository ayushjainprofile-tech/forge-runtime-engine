import React from "react";
import { AstNode } from "@/engine/ast/types";
import { DynamicRenderer } from "@/components/registry";

export function CardComponent({ node }: { node: AstNode }) {
  return (
    <div className="bg-bg-dark rounded-xl border border-white/5 p-6 shadow-xl w-full">
      {node.props.title && (
        <h3 className="text-lg font-medium text-text-primary mb-4">{node.props.title}</h3>
      )}
      <div className="flex flex-col gap-4">
        {node.children?.map(child => (
          <DynamicRenderer key={child.id} node={child} />
        ))}
      </div>
    </div>
  );
}
