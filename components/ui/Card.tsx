import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111111] border border-[#262626] rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}