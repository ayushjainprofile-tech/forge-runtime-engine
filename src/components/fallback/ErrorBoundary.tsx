"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  nodeId?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-4 border border-status-error/20 bg-status-error/10 rounded-lg text-sm">
          <div className="flex items-center gap-2 text-status-error mb-2 font-medium">
            <AlertCircle size={16} />
            <span>Component Crashed</span>
          </div>
          <p className="text-text-secondary text-xs">
            {this.props.nodeId ? `Node: ${this.props.nodeId}` : "Unknown node"} failed to render.
          </p>
          <div className="mt-2 text-xs font-mono text-status-error/80 bg-bg-dark p-2 rounded">
            {this.state.error?.message}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
