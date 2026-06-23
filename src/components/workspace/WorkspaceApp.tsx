"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/layout/Navigation";
import { compileConfig } from "@/engine";
import { DynamicRenderer } from "@/components/registry";
import { registerAllComponents } from "@/components/renderer";
import { HealthDashboard } from "./HealthDashboard";
import { ValidationPanel } from "./ValidationPanel";
import { DiffViewer } from "./DiffViewer";
import { EventTimeline } from "./EventTimeline";
import { Code, Layout, ShieldCheck, Clock, CheckCircle } from "lucide-react";

// Register components for the runtime
registerAllComponents();

const DEFAULT_CONFIG_STR = JSON.stringify({
  schemaVersion: "1.0",
  title: "CRM Dashboard",
  pages: [
    {
      id: "main-dashboard",
      type: "Dashboard",
      children: [
        {
          id: "welcome-card",
          type: "Card",
          props: { title: "Welcome back, Admin" },
          children: [
            { type: "Text", props: { content: "Here's your summary for today." } }
          ]
        },
        {
          type: "Card",
          props: { title: "Quick Actions" },
          children: [
            { id: "action-form", type: "Form", props: { submitLabel: "Create User", fields: [{id: "email", label: "Email Address"}] } },
            { id: "unknown-widget", type: "SuperWidget", props: { complexData: [1,2,3] } }
          ]
        }
      ]
    }
  ]
}, null, 2);

export function WorkspaceApp() {
  const [jsonConfig, setJsonConfig] = useState(DEFAULT_CONFIG_STR);
  const [compileResult, setCompileResult] = useState<any>(null);
  const [compileTimeMs, setCompileTimeMs] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);
  
  // Right panel tabs
  const [rightTab, setRightTab] = useState<"validation" | "diff">("validation");

  const handleCompile = () => {
    setIsCompiling(true);
    const start = performance.now();
    try {
      const parsed = JSON.parse(jsonConfig);
      const result = compileConfig(parsed);
      const end = performance.now();
      setCompileResult(result);
      setCompileTimeMs(Math.round(end - start));
    } catch (e) {
      // Handle syntax error
      setCompileResult(null);
    } finally {
      setTimeout(() => setIsCompiling(false), 300); // UI delay for feel
    }
  };

  useEffect(() => {
    handleCompile(); // Initial compile
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleCompile();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        // Mock save
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jsonConfig]);

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] text-white overflow-hidden">
      <Navigation />
      
      <main className="flex-1 flex flex-col pt-20 px-6 pb-6 w-full h-full">
        {/* Header Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          {compileResult && (
            <HealthDashboard 
              score={compileResult.healthScore}
              compileTime={compileTimeMs}
              rulesChecked={42} // mocked for now
              componentsRegistered={12} // mocked
              warnings={compileResult.diagnostics.filter((d:any) => d.severity === "WARNING").length}
              errors={compileResult.diagnostics.filter((d:any) => d.severity === "ERROR").length}
              autoFixes={compileResult.normalizations.length}
            />
          )}
        </motion.div>

        {/* 3-Column Layout */}
        <div className="flex-1 flex gap-4 h-[calc(100vh-220px)]">
          
          {/* LEFT: JSON Editor */}
          <motion.div 
            className="flex-1 flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-[#151515] px-4 py-2 flex items-center justify-between border-b border-white/5">
              <span className="text-xs font-mono text-text-tertiary flex items-center gap-2"><Code size={14}/> configuration.json</span>
              <span className="text-[10px] text-text-tertiary">Ctrl+Enter to compile</span>
            </div>
            <textarea
              value={jsonConfig}
              onChange={(e) => setJsonConfig(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent text-text-secondary font-mono text-xs p-4 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 resize-none custom-scrollbar"
            />
          </motion.div>

          {/* CENTER: Runtime Preview & Timeline */}
          <motion.div 
            className="flex-[1.5] flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex-[2] flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-xl">
              <div className="bg-[#151515] px-4 py-2 flex items-center justify-between border-b border-white/5">
                <span className="text-xs font-mono text-text-tertiary flex items-center gap-2"><Layout size={14}/> Runtime Preview</span>
                {isCompiling && <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />}
              </div>
              <div className="flex-1 p-4 overflow-auto custom-scrollbar relative">
                {isCompiling ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                    <div className="w-6 h-6 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin" />
                  </div>
                ) : null}
                
                {compileResult?.runtimeModel?.pages?.length > 0 ? (
                  <DynamicRenderer node={compileResult.runtimeModel.pages[0]} />
                ) : (
                  <div className="h-full flex items-center justify-center text-text-tertiary">
                    {compileResult ? "No pages found." : "Syntax error in JSON."}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-xl">
              <div className="bg-[#151515] px-4 py-2 flex items-center gap-2 border-b border-white/5">
                <Clock size={14} className="text-text-tertiary"/>
                <span className="text-xs font-mono text-text-tertiary">Event Timeline</span>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                {compileResult && <EventTimeline compileResult={compileResult} compileTimeMs={compileTimeMs} />}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Validation & Diff */}
          <motion.div 
            className="flex-1 flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-[#151515] flex items-center border-b border-white/5">
              <button 
                onClick={() => setRightTab("validation")}
                className={`flex-1 px-4 py-2 text-xs font-mono flex items-center justify-center gap-2 border-b-2 transition-colors ${rightTab === "validation" ? "border-accent-primary text-white bg-white/5" : "border-transparent text-text-tertiary hover:text-white"}`}
              >
                <ShieldCheck size={14}/> Validation
                {compileResult && compileResult.diagnostics.length > 0 && (
                  <span className="bg-status-error/20 text-status-error px-1.5 py-0.5 rounded-full text-[10px] leading-none">
                    {compileResult.diagnostics.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setRightTab("diff")}
                className={`flex-1 px-4 py-2 text-xs font-mono flex items-center justify-center gap-2 border-b-2 transition-colors ${rightTab === "diff" ? "border-accent-secondary text-white bg-white/5" : "border-transparent text-text-tertiary hover:text-white"}`}
              >
                <CheckCircle size={14}/> Normalizer
                {compileResult && compileResult.normalizations.length > 0 && (
                  <span className="bg-accent-secondary/20 text-accent-secondary px-1.5 py-0.5 rounded-full text-[10px] leading-none">
                    {compileResult.normalizations.length}
                  </span>
                )}
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-hidden relative">
              {compileResult && rightTab === "validation" && <ValidationPanel diagnostics={compileResult.diagnostics} />}
              {compileResult && rightTab === "diff" && <DiffViewer fixes={compileResult.normalizations} />}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}