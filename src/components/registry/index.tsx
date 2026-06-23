"use client";

import React from "react";
import { AstNode } from "@/engine/ast/types";
import { FallbackComponent } from "../renderer/fallback";
import { ErrorBoundary } from "../fallback/ErrorBoundary";

type ComponentRenderer = React.ComponentType<{ node: AstNode }>;

class ComponentRegistry {
  private renderers = new Map<string, ComponentRenderer>();

  register(type: string, component: ComponentRenderer) {
    this.renderers.set(type, component);
  }

  get(type: string): ComponentRenderer {
    return this.renderers.get(type) || FallbackComponent;
  }
}

export const componentRegistry = new ComponentRegistry();

export function DynamicRenderer({ node }: { node: AstNode }) {
  const Component = componentRegistry.get(node.type);
  
  return (
    <ErrorBoundary nodeId={node.id}>
      <Component node={node} />
    </ErrorBoundary>
  );
}
