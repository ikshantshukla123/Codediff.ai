import { ReactNode } from "react";

interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

export function Skeleton({ className = "", children }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-[#1a1a1a] rounded ${className}`}>
      {children || <div className="h-full w-full" />}
    </div>
  );
}

