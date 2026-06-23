"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Database, Terminal, ShieldCheck, Zap, Activity, Layout, Info } from "lucide-react";

interface PremiumHeroProps {
  onStartBuilding: () => void;
  isCompiling: boolean;
  onCompilationComplete: () => void;
}

const PIPELINE_STAGES = [
  { id: "JSON", title: "Raw JSON", icon: Database, tooltip: "Source configuration payload" },
  { id: "Parser", title: "AST Parser", icon: Terminal, tooltip: "Transforms to strict AST" },
  { id: "Validator", title: "Validator", icon: ShieldCheck, tooltip: "Business rule enforcement" },
  { id: "Normalizer", title: "Normalizer", icon: Zap, tooltip: "Safe auto-corrections" },
  { id: "Runtime", title: "Optimizer", icon: Activity, tooltip: "Pre-calculates runtime metrics" },
  { id: "Renderer", title: "Renderer", icon: Layout, tooltip: "Virtual DOM projection" }
];

const COMPILING_MESSAGES = [
  "Loading Configuration...",
  "Parsing Metadata...",
  "Running Validation...",
  "Applying Safe Auto Fixes...",
  "Generating Runtime...",
  "Renderer Ready..."
];

export function PremiumHero({ onStartBuilding, isCompiling, onCompilationComplete }: PremiumHeroProps) {
  const [activeStage, setActiveStage] = useState(-1);
  const [compileMessage, setCompileMessage] = useState("");

  useEffect(() => {
    if (isCompiling) {
      let currentStage = 0;
      const interval = setInterval(() => {
        setActiveStage(currentStage);
        setCompileMessage(COMPILING_MESSAGES[currentStage]);
        currentStage++;
        if (currentStage >= PIPELINE_STAGES.length) {
          clearInterval(interval);
          setTimeout(() => onCompilationComplete(), 300); // Small pause before transition
        }
      }, 200); // 6 stages * 200ms = 1.2s total time
      
      return () => clearInterval(interval);
    }
  }, [isCompiling, onCompilationComplete]);

  // Floating Particles
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.div 
      className="relative min-h-screen w-full bg-[#07090B] overflow-hidden flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-accent-primary/5 rounded-[100%] blur-[120px]" />
        
        {/* Engineering Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />

        {/* Animated Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Floating Particles */}
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* --- FLOATING METRICS (Subtle) --- */}
      <motion.div 
        className="absolute top-8 right-8 z-20 flex gap-6 text-xs font-mono text-text-tertiary hidden md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          SYSTEM_READY
        </div>
        <div>LATENCY: 12ms</div>
        <div>V: 1.0.4</div>
      </motion.div>

      {/* --- HERO CONTENT --- */}
      <motion.div 
        className="relative z-10 text-center flex flex-col items-center mt-[-10vh] px-6 max-w-4xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className="text-[5rem] md:text-[8rem] font-serif text-white tracking-tighter leading-none mb-6 drop-shadow-2xl">
          FORGE
        </h1>
        
        <h2 className="text-xl md:text-3xl text-text-primary font-sans font-light tracking-wide mb-6">
          Metadata-Driven Runtime Engine
        </h2>
        
        <p className="text-base md:text-lg text-text-secondary font-light max-w-2xl mx-auto leading-relaxed mb-12">
          Validate, Normalize and Safely Render Applications from JSON Configuration.
        </p>

        {/* Start Building Button */}
        <button 
          onClick={onStartBuilding}
          disabled={isCompiling}
          className={`relative overflow-hidden px-8 py-4 rounded-full font-medium transition-all duration-500 flex items-center justify-center min-w-[280px] group ${
            isCompiling 
              ? "bg-white/5 border border-white/10 text-white/80 cursor-wait scale-95" 
              : "bg-accent-primary text-white hover:bg-accent-primary/90 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(var(--color-accent-primary),0.4)] hover:shadow-[0_0_60px_rgba(var(--color-accent-primary),0.6)]"
          }`}
        >
          {/* Button Shine Effect */}
          {!isCompiling && (
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          )}
          
          {isCompiling ? (
            <motion.span 
              key="compiling"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-sm flex items-center gap-3"
            >
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Initializing Runtime...
            </motion.span>
          ) : (
            <span key="idle">Start Building</span>
          )}
        </button>
      </motion.div>

      {/* --- PIPELINE ANIMATION --- */}
      <motion.div 
        className="absolute bottom-16 w-full max-w-5xl px-8 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <div className="relative flex items-center justify-between w-full">
          {/* Base Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-white/5 -translate-y-1/2 z-0" />
          
          {/* Active Processing Line (Fills up) */}
          {isCompiling && activeStage > 0 && (
            <motion.div 
              className="absolute top-1/2 left-8 h-[2px] bg-gradient-to-r from-accent-primary/50 to-accent-primary -translate-y-1/2 z-0 shadow-[0_0_15px_rgba(var(--color-accent-primary),0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: `calc(${(activeStage / (PIPELINE_STAGES.length - 1)) * 100}% - 4rem)` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          )}

          {PIPELINE_STAGES.map((stage, idx) => {
            const isActive = activeStage === idx;
            const isPast = activeStage > idx;
            const isIdle = !isCompiling && !isPast && !isActive;

            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center group cursor-default">
                
                {/* Node Circle */}
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border bg-[#07090B] transition-all duration-300 ${
                  isActive 
                    ? "border-accent-primary shadow-[0_0_30px_rgba(var(--color-accent-primary),0.6)] scale-110" 
                    : isPast 
                      ? "border-white/30 text-white/50" 
                      : "border-white/10 text-white/30 group-hover:border-white/30"
                }`}>
                  <stage.icon size={20} className={`transition-colors ${isActive ? "text-accent-primary" : ""}`} />
                  
                  {/* Processing Ripple */}
                  {isActive && (
                    <motion.div 
                      className="absolute inset-0 rounded-full border border-accent-primary"
                      animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
                
                {/* Stage Label */}
                <span className={`mt-4 text-xs font-mono transition-colors duration-300 ${
                  isActive ? "text-accent-primary font-bold" : isPast ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"
                }`}>
                  {stage.id}
                </span>

                {/* Tooltip on Hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-2 bg-[#111] border border-white/10 px-3 py-1.5 rounded text-xs text-text-primary whitespace-nowrap shadow-xl">
                  <Info size={12} className="text-accent-primary" />
                  {stage.tooltip}
                </div>
              </div>
            );
          })}
        </div>

        {/* Compiling Message Output */}
        <div className="h-6 mt-8 flex justify-center">
          <AnimatePresence mode="wait">
            {isCompiling && (
              <motion.p 
                className="text-text-secondary font-mono text-sm tracking-wider flex items-center gap-2"
                key={compileMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-accent-primary">{">"}</span> {compileMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

    </motion.div>
  );
}