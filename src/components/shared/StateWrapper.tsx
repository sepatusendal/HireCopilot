import * as React from "react";
import { cn } from "@/lib/utils";

interface StateWrapperProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Single reusable state machine for data-driven views: Loading / Empty / Error / Success.
 * Every page that fetches data should route through this instead of ad-hoc conditionals.
 */
export function StateWrapper({
  isLoading,
  isError,
  isEmpty,
  loadingFallback,
  errorFallback,
  emptyFallback,
  onRetry,
  children,
  className,
}: StateWrapperProps) {
  if (isLoading) {
    return <div className={className}>{loadingFallback ?? <DefaultSkeleton />}</div>;
  }

  if (isError) {
    return (
      <div className={className}>
        {errorFallback ?? <DefaultError onRetry={onRetry} />}
      </div>
    );
  }

  if (isEmpty) {
    return <div className={className}>{emptyFallback ?? <DefaultEmpty />}</div>;
  }

  return <>{children}</>;
}

function DefaultSkeleton() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-16 w-full animate-pulse rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-surface"
        />
      ))}
    </div>
  );
}

function DefaultError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-3 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card p-6 shadow-brutal"
      )}
    >
      <p className="font-bold text-rejection">Something went wrong.</p>
      <p className="text-sm text-muted-foreground">We couldn&apos;t load this. Try again in a moment.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-4 py-2 text-sm font-bold shadow-brutal-sm hover:-translate-y-0.5"
        >
          Retry
        </button>
      )}
    </div>
  );
}

function DefaultEmpty() {
  return (
    <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border bg-transparent p-6">
      <p className="font-bold">Nothing here yet.</p>
      <p className="text-sm text-muted-foreground">Your AI recruiter hasn&apos;t found anything to show.</p>
    </div>
  );
}
