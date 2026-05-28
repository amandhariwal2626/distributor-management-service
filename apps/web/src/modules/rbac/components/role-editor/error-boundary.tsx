"use client";

import { Component, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div>
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground max-w-md mt-1">
              {this.state.error.message || "An unexpected error occurred while loading the role editor."}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
          >
            Reload page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
