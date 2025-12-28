"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ClickableRowProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function ClickableRow({ href, children, className = "" }: ClickableRowProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <tr
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer ${className}`}
      tabIndex={0}
      role="button"
      aria-label={`Navigate to ${href}`}
    >
      {children}
    </tr>
  );
}

