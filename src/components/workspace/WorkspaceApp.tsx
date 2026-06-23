"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const HEALTHY_CONFIG_STR = JSON.stringify({
  schemaVersion: "1.0",
  title: "CRM Dashboard (Healthy Demo)",
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
            { id: "welcome-text", type: "Text", props: { content: "Here's your summary for today." } }
          ]
        },
        {
          id: "quick-actions-card",
          type: "Card",
          props: { title: "Quick Actions" },
          children: [
            { id: "action-form", type: "Form", props: { submitLabel: "Create User", fields: [{id: "email", label: "Email Address"}] } }
          ]
        }
      ]
    }
  ]
}, null, 2);

const BROKEN_CONFIG_STR = JSON.stringify({
  schemaVersion: "1.0",
  title: "CRM Dashboard (Broken Demo)",
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
            { id: "welcome-card", type: "Text", props: { content: "This shares the ID welcome-card." } }
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
  const [jsonConfig, setJsonConfig] = useState(HEALTHY_CONFIG_STR);
  const [demoMode, setDemoMode] = useState<"healthy" | "broken" | "custom">("healthy");
  const [compileResult, setCompileResult] = useState<any>(null);
  const [compileTimeMs, setCompileTimeMs] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);
  
  // Right panel tabs
  const [rightTab, setRightTab] = useState<"validation" | "diff">("validation");

  const handleCompile = (configToCompile = jsonConfig) => {
    setIsCompiling(true);
    const start = performance.now();
    try {
      const parsed = JSON.parse(configToCompile);
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

  const handleLoadDemo = (mode: "healthy" | "broken") => {
    setDemoMode(mode);
    const config = mode === "healthy" ? HEALTHY_CONFIG_STR : BROKEN_CONFIG_STR;
    setJsonConfig(config);
    handleCompile(config);
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
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white overflow-y-auto">
      <Navigation />
      
      <main className="flex-1 flex flex-col pt-20 px-6 pb-6 w-full">
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
        <div className="flex-1 flex flex-col lg:flex-row gap-4">
          
          {/* LEFT: JSON Editor */}
          <motion.div 
            className="flex-1 flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-xl min-h-[350px] lg:h-[680px]"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-[#151515] px-4 py-2 flex items-center justify-between border-b border-white/5 gap-2">
              <span className="text-xs font-mono text-text-tertiary flex items-center gap-2"><Code size={14}/> configuration.json</span>
              <div className="flex gap-1.5 items-center">
                <button 
                  onClick={() => handleLoadDemo("healthy")}
                  className={`text-[9px] px-2 py-0.5 rounded font-mono transition-colors font-bold uppercase ${demoMode === "healthy" ? "bg-status-success text-black" : "bg-white/5 text-text-secondary hover:bg-white/10"}`}
                >
                  Healthy Demo
                </button>
                <button 
                  onClick={() => handleLoadDemo("broken")}
                  className={`text-[9px] px-2 py-0.5 rounded font-mono transition-colors font-bold uppercase ${demoMode === "broken" ? "bg-status-error text-white animate-pulse" : "bg-white/5 text-text-secondary hover:bg-white/10"}`}
                >
                  Broken Demo
                </button>
              </div>
            </div>
            <textarea
              value={jsonConfig}
              onChange={(e) => {
                setJsonConfig(e.target.value);
                setDemoMode("custom");
              }}
              spellCheck={false}
              className="flex-1 bg-transparent text-text-secondary font-mono text-xs p-4 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 resize-none min-h-[280px] lg:min-h-0 custom-scrollbar"
            />
          </motion.div>

          {/* CENTER: Runtime Preview & Timeline */}
          <motion.div 
            className="flex-[1.5] flex flex-col gap-4 min-h-[550px] lg:h-[680px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex-[2] flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-xl min-h-[350px] lg:h-0">
              <div className="bg-[#151515] px-4 py-2 flex items-center justify-between border-b border-white/5">
                <span className="text-xs font-mono text-text-tertiary flex items-center gap-2"><Layout size={14}/> Runtime Preview</span>
                {isCompiling && <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />}
              </div>
              <div className="flex-1 p-4 overflow-auto custom-scrollbar relative">
                {compileResult?.runtimeModel?.views?.length > 0 ? (
                  <DynamicRenderer node={compileResult.runtimeModel.views[0]} />
                ) : (
                  <div className="h-full flex items-center justify-center text-text-tertiary">
                    {compileResult ? "No pages found." : "Syntax error in JSON."}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-xl min-h-[180px] lg:h-0">
              <div className="bg-[#151515] px-4 py-2 flex items-center gap-2 border-b border-white/5">
                <Clock size={14} className="text-text-tertiary"/>
                <span className="text-xs font-mono text-text-tertiary">Event Timeline</span>
              </div>
              <div className="flex-1 p-4 overflow-auto custom-scrollbar">
                {compileResult && <EventTimeline compileResult={compileResult} compileTimeMs={compileTimeMs} />}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Validation & Diff */}
          <motion.div 
            className="flex-1 flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-xl min-h-[350px] lg:h-[680px]"
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
            
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar relative">
              {compileResult && rightTab === "validation" && <ValidationPanel diagnostics={compileResult.diagnostics} />}
              {compileResult && rightTab === "diff" && <DiffViewer fixes={compileResult.normalizations} />}
            </div>
          </motion.div>

        </div>
      </main>

      {/* Floating Compilation Toast */}
      <AnimatePresence>
        {isCompiling && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#151515] border border-white/10 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs text-white"
          >
            <div className="w-4 h-4 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin" />
            <span>Compiling configuration...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}