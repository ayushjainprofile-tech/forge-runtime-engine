"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PremiumHero } from "@/components/landing/PremiumHero";
import { WorkspaceApp } from "@/components/workspace/WorkspaceApp";

export default function Home() {
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleStartBuilding = () => {
    setIsCompiling(true);
  };

  return (
    <main className="min-h-screen bg-[#07090B]">
      <AnimatePresence mode="wait">
        {!showWorkspace ? (
          <PremiumHero 
            key="hero" 
            onStartBuilding={handleStartBuilding} 
            isCompiling={isCompiling} 
            onCompilationComplete={() => setShowWorkspace(true)}
          />
        ) : (
          <WorkspaceApp key="workspace" />
        )}
      </AnimatePresence>
    </main>
  );
}