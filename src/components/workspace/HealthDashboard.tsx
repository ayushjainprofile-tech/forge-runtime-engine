"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react";

interface HealthDashboardProps {
  score: number;
  compileTime: number;
  rulesChecked: number;
  componentsRegistered: number;
  warnings: number;
  errors: number;
  autoFixes: number;
}

export function HealthDashboard({
  score,
  compileTime,
  rulesChecked,
  componentsRegistered,
  warnings,
  errors,
  autoFixes
}: HealthDashboardProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) return;
    const duration = 1000;
    const incrementTime = (duration / end) * 2;
    const timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="bg-bg-elevated border border-white/5 p-5 rounded-xl shadow-lg">
      <div className="flex items-center gap-6">
        
        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className={score > 80 ? "text-status-success" : score > 50 ? "text-status-warning" : "text-status-error"}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-mono font-bold">{displayScore}%</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="flex-1 grid grid-cols-3 gap-4">
          <Metric label="Status" value={errors === 0 ? "Healthy" : "Degraded"} icon={errors === 0 ? CheckCircle : ShieldAlert} color={errors === 0 ? "text-status-success" : "text-status-error"} />
          <Metric label="Compile Time" value={`${compileTime}ms`} icon={Activity} />
          <Metric label="Rules Checked" value={rulesChecked} />
          <Metric label="Registered" value={componentsRegistered} />
          <Metric label="Warnings" value={warnings} color="text-status-warning" icon={AlertTriangle} />
          <Metric label="Auto Fixes" value={autoFixes} color="text-accent-secondary" />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, icon: Icon, color = "text-white" }: { label: string, value: string | number, icon?: any, color?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-text-tertiary uppercase tracking-wider mb-1 flex items-center gap-1">
        {Icon && <Icon size={12} />} {label}
      </span>
      <span className={`font-mono text-lg font-medium ${color}`}>{value}</span>
    </div>
  );
}
