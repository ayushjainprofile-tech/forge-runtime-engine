"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ValidationDiagnostic } from "@/engine/validator/types";
import { AlertCircle, ChevronDown, ChevronRight, Wrench, Info, BookOpen, AlertTriangle } from "lucide-react";

interface ValidationPanelProps {
  diagnostics: ValidationDiagnostic[];
}

export function ValidationPanel({ diagnostics }: ValidationPanelProps) {
  if (diagnostics.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-text-tertiary p-8 border border-white/5 rounded-xl bg-bg-elevated">
        <CheckCircleIcon size={48} className="text-status-success mb-4 opacity-50" />
        <p>No validation issues detected.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2 custom-scrollbar">
      {diagnostics.map((diag, index) => (
        <DiagnosticCard key={`${diag.ruleId}-${index}`} diagnostic={diag} />
      ))}
    </div>
  );
}

function DiagnosticCard({ diagnostic }: { diagnostic: ValidationDiagnostic }) {
  const [expanded, setExpanded] = useState(false);
  const isError = diagnostic.severity === "ERROR";

  return (
    <div className={`border rounded-lg overflow-hidden transition-colors ${
      isError ? "border-status-error/30 bg-status-error/5 hover:border-status-error/50" : "border-status-warning/30 bg-status-warning/5 hover:border-status-warning/50"
    }`}>
      {/* Header (Always visible) */}
      <div 
        className="px-4 py-3 cursor-pointer flex items-start gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="mt-0.5">
          {isError ? <AlertCircle size={16} className="text-status-error" /> : <AlertTriangle size={16} className="text-status-warning" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-bold ${isError ? "text-status-error" : "text-status-warning"}`}>
              {diagnostic.ruleId}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 text-text-secondary font-mono">
                {diagnostic.path}
              </span>
              {expanded ? <ChevronDown size={14} className="text-text-tertiary" /> : <ChevronRight size={14} className="text-text-tertiary" />}
            </div>
          </div>
          <p className="text-sm text-text-primary mt-1 line-clamp-1">{diagnostic.message}</p>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 bg-black/20"
          >
            <div className="p-4 flex flex-col gap-4 text-sm">
              
              {/* Reason & Impact */}
              <div className="grid grid-cols-2 gap-4">
                {diagnostic.reason && (
                  <div>
                    <h5 className="text-xs text-text-tertiary uppercase tracking-wider mb-1 flex items-center gap-1"><Info size={12}/> Reason</h5>
                    <p className="text-text-secondary">{diagnostic.reason}</p>
                  </div>
                )}
                {diagnostic.impact && (
                  <div>
                    <h5 className="text-xs text-text-tertiary uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Impact</h5>
                    <p className="text-text-secondary">{diagnostic.impact}</p>
                  </div>
                )}
              </div>

              {/* Auto Fix Strategy */}
              {diagnostic.autoFixStrategy && (
                <div className="bg-accent-secondary/10 border border-accent-secondary/20 rounded p-3">
                  <h5 className="text-xs text-accent-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Wrench size={12}/> Auto Fix Strategy
                  </h5>
                  <p className="text-accent-secondary/90 mb-2">{diagnostic.autoFixStrategy}</p>
                  {diagnostic.exampleFix && (
                    <pre className="text-xs font-mono bg-black/50 p-2 rounded text-text-secondary border border-white/5">
                      {diagnostic.exampleFix}
                    </pre>
                  )}
                  {diagnostic.confidence && (
                    <div className="mt-2 text-xs flex items-center gap-2">
                      <span className="text-text-tertiary">Confidence:</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        diagnostic.confidence === "HIGH" ? "bg-status-success/20 text-status-success" : "bg-status-warning/20 text-status-warning"
                      }`}>
                        {diagnostic.confidence}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Documentation Hint */}
              {diagnostic.documentationHint && (
                <a href="#" className="inline-flex items-center gap-1 text-xs text-accent-primary hover:underline w-max">
                  <BookOpen size={12} /> {diagnostic.documentationHint}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
}
