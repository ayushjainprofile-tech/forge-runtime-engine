"use client";

import React from "react";
import { NormalizationReport } from "@/engine/normalizer";
import { Wrench } from "lucide-react";

type NormalizationFix = NormalizationReport["fixes"][0];

interface DiffViewerProps {
  fixes: NormalizationFix[];
}

export function DiffViewer({ fixes }: DiffViewerProps) {
  if (fixes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-tertiary p-8 border border-white/5 rounded-xl bg-bg-elevated">
        <p>No normalizations applied. Configuration was already optimal.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto pr-2 custom-scrollbar">
      {fixes.map((fix, idx) => (
        <DiffCard key={idx} fix={fix} />
      ))}
    </div>
  );
}

function DiffCard({ fix }: { fix: NormalizationFix }) {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-lg overflow-hidden flex flex-col font-mono text-xs">
      <div className="flex items-center justify-between bg-black/40 px-3 py-2 border-b border-white/5">
        <span className="text-text-secondary">{fix.path}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
          fix.confidence === "SAFE" ? "bg-status-success/20 text-status-success" : "bg-status-warning/20 text-status-warning"
        }`}>
          {fix.confidence}
        </span>
      </div>
      <div className="flex px-3 py-2 bg-accent-secondary/10 text-accent-secondary/90 border-l-2 border-accent-secondary items-start gap-2">
        <Wrench size={12} className="mt-0.5 opacity-70" />
        <span className="flex-1 whitespace-pre-wrap">{fix.message}</span>
      </div>
    </div>
  );
}
