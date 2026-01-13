"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  BarChart3,
  Shield,
  Brain,
  Zap,
  Dna,
  Clock,
  AlertTriangle,
  TrendingUp,
  type LucideIcon
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import type { NavItem } from "./Navbar";

// Icon mapping for resolving string names to components
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  Shield,
  Brain,
  Zap,
  Dna,
  Clock,
  AlertTriangle,
  TrendingUp,
};

interface DesktopNavigationProps {
  navigationConfig: readonly NavItem[];
}

/**
 * Desktop Navigation Client Component
 * Handles hover states and dropdown interactions
 */
export function DesktopNavigation({ navigationConfig }: DesktopNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
      {navigationConfig.map((item) => (
        <DesktopNavItem key={item.label} item={item} pathname={pathname} />
      ))}
    </nav>
  );
}

interface DesktopNavItemProps {
  item: NavItem;
  pathname: string | null;
}

function DesktopNavItem({ item, pathname }: DesktopNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if active (either the main link or one of the sub-items)
  const isActive = item.href === pathname || item.items?.some(sub => sub.href === pathname);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  }, [isOpen]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!item.items) {
    // Standard Link
    return (
      <Link
        href={item.href || "#"}
        className={`px-3 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 ${isActive
            ? "text-white bg-neutral-900"
            : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
          }`}
      >
        {item.label}
      </Link>
    );
  }

  // Dropdown Trigger
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 ${isOpen || isActive
            ? "text-white bg-neutral-900"
            : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
          }`}
      >
        {item.label}
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Content */}
      <div
        role="menu"
        aria-label={`${item.label} submenu`}
        className={`absolute left-0 top-full pt-2 w-64 transition-all duration-200 ${isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 translate-y-1 invisible"
          }`}
      >
        <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-xl ring-1 ring-black/5">
          <div className="p-1">
            {item.items.map((subItem) => {
              const Icon = subItem.icon ? ICON_MAP[subItem.icon] : null;
              return (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  role="menuitem"
                  className="group flex items-start gap-3 rounded-md p-2 hover:bg-neutral-900 transition-colors focus:outline-none focus:bg-neutral-900"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 group-hover:border-neutral-700 group-hover:text-white group-focus:border-neutral-700 group-focus:text-white">
                    {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-200 group-hover:text-white group-focus:text-white">
                      {subItem.label}
                    </div>
                    {subItem.description && (
                      <div className="text-xs text-neutral-500 line-clamp-1 group-hover:text-neutral-400 group-focus:text-neutral-400">
                        {subItem.description}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}