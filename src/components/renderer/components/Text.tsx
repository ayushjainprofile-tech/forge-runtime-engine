import React from "react";
import { AstNode } from "@/engine/ast/types";

export function TextComponent({ node }: { node: AstNode }) {
  const variant = node.props.variant || "body";
  
  const classNames = {
    hero: "text-5xl font-serif text-text-primary",
    h1: "text-3xl font-medium text-text-primary",
    h2: "text-2xl font-medium text-text-primary",
    body: "text-base text-text-secondary",
    caption: "text-sm text-text-tertiary",
  }[variant as string] || "text-base text-text-secondary";

  return <p className={classNames}>{node.props.content || "Empty text"}</p>;
}
