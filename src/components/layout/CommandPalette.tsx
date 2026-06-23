"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Code, Layout, ShieldCheck, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = [
    { id: "workspace", label: "Open Workspace Editor", icon: Code, action: () => router.push("/workspace") },
    { id: "architecture", label: "View System Architecture", icon: Layout, action: () => router.push("/architecture") },
    { id: "validation", label: "View Validation Rules", icon: ShieldCheck, action: () => router.push("/workspace") },
    { id: "health", label: "Check Engine Health", icon: Activity, action: () => router.push("/workspace") },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-white/5 gap-3">
              <Search size={18} className="text-text-tertiary" />
              <input 
                autoFocus
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white text-sm"
              />
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-text-tertiary font-mono">ESC</span>
            </div>
            
            <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar">
              {filtered.length > 0 ? (
                filtered.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors group"
                  >
                    <cmd.icon size={16} className="text-text-tertiary group-hover:text-white" />
                    {cmd.label}
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-text-tertiary">
                  No commands found.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
