"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Home", href: "/" },
  { name: "Workspace", href: "/workspace" },
  { name: "Architecture", href: "/architecture" },
];

export function Navigation() {
  const pathname = usePathname();

  // Don't show nav on landing page
  if (pathname === "/") return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 bg-white/5 border border-white/10 backdrop-blur-md p-1 rounded-full shadow-lg shadow-black/20">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-white text-bg-darker shadow-sm" 
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
