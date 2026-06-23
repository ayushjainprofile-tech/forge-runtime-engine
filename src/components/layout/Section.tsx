"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionProps {
  id: string;
  number: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, number, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`relative w-full py-[120px] px-8 md:px-16 overflow-hidden ${className}`}>
      {/* Ghost Number */}
      <motion.div 
        className="absolute top-0 right-[-5%] text-[20rem] md:text-[30rem] font-serif font-bold text-white opacity-5 select-none pointer-events-none leading-none tracking-tighter"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 0.05 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {number}
      </motion.div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {children}
      </div>
    </section>
  );
}