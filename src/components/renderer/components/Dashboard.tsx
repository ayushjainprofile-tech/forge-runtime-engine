import React from "react";
import { AstNode } from "@/engine/ast/types";
import { DynamicRenderer } from "@/components/registry";

export function DashboardComponent({ node }: { node: AstNode }) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {node.children?.map(child => (
          <DynamicRenderer key={child.id} node={child} />
        ))}
      </div>
    </div>
  );
}
