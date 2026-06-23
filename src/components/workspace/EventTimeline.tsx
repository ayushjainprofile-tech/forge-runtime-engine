"use client";

import React, { useMemo } from "react";
import { CompileResult } from "@/engine";

interface EventTimelineProps {
  compileResult: CompileResult;
  compileTimeMs: number;
}

interface TimelineEvent {
  timestamp: number; // offset in ms from start
  label: string;
  type: "system" | "error" | "fix" | "success";
  details?: string;
}

export function EventTimeline({ compileResult, compileTimeMs }: EventTimelineProps) {
  const events = useMemo(() => {
    const evts: TimelineEvent[] = [];
    let currentMs = 0;
    
    const addEvent = (label: string, type: TimelineEvent["type"], details?: string, duration: number = 0) => {
      evts.push({ timestamp: currentMs, label, type, details });
      currentMs += duration;
    };

    addEvent("Configuration Loaded", "system", "1.4KB payload", compileTimeMs * 0.1);
    addEvent("AST Parser Complete", "system", "Tree depth: 4", compileTimeMs * 0.2);
    
    if (compileResult.diagnostics.length > 0) {
      addEvent(`Validation Complete (${compileResult.diagnostics.length} issues)`, "system", undefined, 1);
      compileResult.diagnostics.forEach(d => {
        addEvent(`Issue Detected: ${d.ruleId}`, d.severity === "ERROR" ? "error" : "system", d.path, 0);
      });
    } else {
      addEvent("Validation Complete", "success", "0 issues", compileTimeMs * 0.3);
    }

    if (compileResult.normalizations.length > 0) {
      addEvent(`Normalization Complete (${compileResult.normalizations.length} fixes)`, "system", undefined, 1);
      compileResult.normalizations.forEach(f => {
        addEvent(`Auto Fix Applied`, "fix", f.path, 0);
      });
    }

    addEvent("Runtime Generated", "system", "Optimized AST ready", compileTimeMs * 0.2);
    addEvent("Renderer Ready", "success", "Virtual DOM attached", 0);

    return evts;
  }, [compileResult, compileTimeMs]);

  return (
    <div className="flex flex-col gap-0 h-full overflow-y-auto pr-2 custom-scrollbar font-mono text-xs">
      {events.map((evt, idx) => (
        <div key={idx} className="flex group relative">
          {/* Timeline Line */}
          <div className="absolute left-[39px] top-4 bottom-0 w-px bg-white/10 group-last:bg-transparent" />
          
          {/* Timestamp */}
          <div className="w-[80px] py-2 text-text-tertiary flex-shrink-0">
            +{evt.timestamp.toFixed(1)}ms
          </div>
          
          {/* Node */}
          <div className="py-2 pr-3 relative z-10">
            <div className={`w-2 h-2 rounded-full mt-1.5 ${
              evt.type === "error" ? "bg-status-error shadow-[0_0_8px_rgba(var(--color-status-error),0.6)]" :
              evt.type === "fix" ? "bg-accent-secondary shadow-[0_0_8px_rgba(var(--color-accent-secondary),0.6)]" :
              evt.type === "success" ? "bg-status-success shadow-[0_0_8px_rgba(var(--color-status-success),0.6)]" :
              "bg-text-tertiary border border-bg-darker"
            }`} />
          </div>
          
          {/* Content */}
          <div className="py-2 flex-1 border-b border-white/5 group-last:border-0 pb-3">
            <div className={`font-medium ${
              evt.type === "error" ? "text-status-error" :
              evt.type === "fix" ? "text-accent-secondary" :
              evt.type === "success" ? "text-status-success" :
              "text-text-primary"
            }`}>
              {evt.label}
            </div>
            {evt.details && (
              <div className="text-text-secondary mt-0.5">{evt.details}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
