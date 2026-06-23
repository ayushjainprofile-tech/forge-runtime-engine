"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/layout/Navigation";
import { Database, Terminal, ShieldCheck, Zap, Activity, Layout, ChevronRight } from "lucide-react";

const ARCHITECTURE_NODES = [
  {
    id: "JSON",
    title: "Raw Configuration",
    icon: Database,
    purpose: "Acts as the single source of truth for the application's structure and behavior.",
    input: "User or API provided JSON string.",
    output: "Parsed JSON Object.",
    tradeoffs: "JSON is easy to write but lacks strict runtime guarantees.",
    failure: "Caught by the initial JSON.parse boundary. Engine halts.",
    why: "Enables no-code and low-code platforms to dictate UI purely via metadata."
  },
  {
    id: "Parser",
    title: "Parser Engine",
    icon: Terminal,
    purpose: "Transforms loosely structured JSON into a strictly typed Abstract Syntax Tree (AST).",
    input: "Parsed JSON Object.",
    output: "Forge AST (Abstract Syntax Tree).",
    tradeoffs: "Adds initial processing overhead to enforce strict typing.",
    failure: "Malformed structures map to generic 'UnknownNode' types to prevent crashing.",
    why: "Creates a safe boundary between untrusted external data and internal engine logic."
  },
  {
    id: "Validator",
    title: "Validation Engine",
    icon: ShieldCheck,
    purpose: "Runs static analysis and applies domain-specific business rules using a Plugin Registry.",
    input: "Forge AST.",
    output: "Array of Validation Diagnostics (Errors/Warnings).",
    tradeoffs: "Synchronous validation delays the immediate render pass.",
    failure: "Diagnostics are generated; the engine never crashes on invalid data.",
    why: "Guarantees that malformed or incomplete ASTs generate precise, actionable feedback."
  },
  {
    id: "Normalizer",
    title: "Normalization Engine",
    icon: Zap,
    purpose: "Automatically fixes unsafe properties, resolving missing IDs, and applying structural defaults.",
    input: "Forge AST.",
    output: "Normalized Forge AST + Fix Report.",
    tradeoffs: "Intelligent guessing may sometimes obscure developer intent if not carefully bounded.",
    failure: "If unfixable, node remains in its state and relies on ErrorBoundary at runtime.",
    why: "Reduces fatal crashes in production by actively self-healing the state."
  },
  {
    id: "Runtime",
    title: "Runtime Optimization",
    icon: Activity,
    purpose: "Pre-calculates static properties and prunes dead code for lightning-fast rendering.",
    input: "Normalized Forge AST.",
    output: "Optimized Runtime Model.",
    tradeoffs: "High upfront cost for an incredibly fast O(1) traversal later.",
    failure: "Fallback to unoptimized AST execution.",
    why: "Essential for massive applications (e.g., thousands of nested dashboard widgets)."
  },
  {
    id: "Renderer",
    title: "Dynamic Renderer",
    icon: Layout,
    purpose: "Maps the Runtime Model to actual React components via the Component Registry.",
    input: "Optimized Runtime Model.",
    output: "React Virtual DOM.",
    tradeoffs: "Dynamic components can break React's reconciliation if keys aren't stable.",
    failure: "Caught by React Error Boundary; falls back to 'Error State Widget'.",
    why: "The final layer that brings the declarative JSON configuration to life."
  }
];

export default function ArchitecturePage() {
  const [activeNode, setActiveNode] = useState(ARCHITECTURE_NODES[0].id);

  const selectedNode = ARCHITECTURE_NODES.find(n => n.id === activeNode)!;

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      <Navigation />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 mt-12">
        {/* Left Column: Pipeline Timeline */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-serif mb-6 text-white tracking-wide">Architecture</h1>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-white/5" />
            
            <div className="flex flex-col gap-6">
              {ARCHITECTURE_NODES.map((node) => {
                const isActive = activeNode === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    className={`relative z-10 flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left w-full group ${
                      isActive ? "bg-[#111111] border border-white/10 shadow-lg" : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className={`p-3 rounded-lg transition-colors ${
                      isActive ? "bg-accent-primary text-white" : "bg-bg-dark text-text-secondary group-hover:text-white group-hover:bg-white/10"
                    }`}>
                      <node.icon size={20} />
                    </div>
                    <div>
                      <h3 className={`font-medium transition-colors ${isActive ? "text-white" : "text-text-secondary group-hover:text-white"}`}>
                        {node.title}
                      </h3>
                      <p className="text-xs text-text-tertiary uppercase tracking-widest mt-1">
                        {node.id}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Dive Details */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-10 shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full justify-center max-w-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-accent-primary/10 text-accent-primary rounded-xl">
                  <selectedNode.icon size={32} />
                </div>
                <h2 className="text-4xl font-serif tracking-tight">{selectedNode.title}</h2>
              </div>

              <p className="text-xl text-text-secondary font-light leading-relaxed mb-12">
                {selectedNode.purpose}
              </p>

              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <h4 className="text-xs text-text-tertiary uppercase tracking-widest mb-3">Input</h4>
                  <div className="font-mono text-sm text-text-primary bg-bg-dark p-3 rounded border border-white/5">
                    {selectedNode.input}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs text-text-tertiary uppercase tracking-widest mb-3">Output</h4>
                  <div className="font-mono text-sm text-accent-primary bg-bg-dark p-3 rounded border border-white/5">
                    {selectedNode.output}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Zap size={16} className="text-status-warning" /> Engineering Tradeoffs
                  </h4>
                  <p className="text-text-secondary leading-relaxed">{selectedNode.tradeoffs}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-status-success" /> Fault Tolerance
                  </h4>
                  <p className="text-text-secondary leading-relaxed">{selectedNode.failure}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Terminal size={16} className="text-accent-primary" /> Why It Matters
                  </h4>
                  <p className="text-text-secondary leading-relaxed">{selectedNode.why}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}