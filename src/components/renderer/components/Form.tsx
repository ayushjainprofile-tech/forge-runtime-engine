import React from "react";
import { AstNode } from "@/engine/ast/types";

export function FormComponent({ node }: { node: AstNode }) {
  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
      {node.props.fields?.map((field: any) => (
        <div key={field.id || Math.random().toString()} className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-secondary">{field.label}</label>
          <input 
            type={field.type || "text"} 
            placeholder={field.placeholder}
            className="bg-bg-base border border-white/10 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>
      ))}
      <button 
        type="submit" 
        className="mt-2 bg-accent-primary text-white font-medium px-4 py-2 rounded-md hover:bg-accent-primary/90 transition-colors self-start"
      >
        {node.props.submitLabel || "Submit"}
      </button>
    </form>
  );
}
