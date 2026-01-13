"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Github,
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
import { useState, useEffect } from "react";
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

interface MobileNavigationProps {
  navigationConfig: readonly NavItem[];
}

/**
 * Mobile Navigation Client Component
 * Manages mobile menu state and expansion
 */
export function MobileNavigation({ navigationConfig }: MobileNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setExpandedItems(new Set()); // Reset expanded items on route change
  }, [pathname]);

  // Expose toggle function to parent components via custom event
  useEffect(() => {
    const handleToggle = () => setIsMobileMenuOpen(prev => !prev);

    window.addEventListener('toggleMobileMenu', handleToggle);
    return () => window.removeEventListener('toggleMobileMenu', handleToggle);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  if (!isMobileMenuOpen) return null;

  return (
    <div className="absolute left-0 top-14 h-[calc(100vh-3.5rem)] w-full overflow-y-auto bg-black border-b border-neutral-800 p-4 md:hidden">
      <nav role="navigation" aria-label="Mobile navigation">
        <div className="flex flex-col space-y-4">
          {navigationConfig.map((item) => (
            <MobileNavItem
              key={item.label}
              item={item}
              pathname={pathname}
              expandedItems={expandedItems}
              setExpandedItems={setExpandedItems}
            />
          ))}
          <Link
            href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}
            className="flex items-center gap-3 rounded-md bg-neutral-900 px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            Connect Repository
          </Link>
        </div>
      </nav>
    </div>
  );
}

interface MobileNavItemProps {
  item: NavItem;
  pathname: string | null;
  expandedItems: Set<string>;
  setExpandedItems: (items: Set<string>) => void;
}

function MobileNavItem({ item, pathname, expandedItems, setExpandedItems }: MobileNavItemProps) {
  const isExpanded = expandedItems.has(item.label);
  const isActive = item.href === pathname || item.items?.some(sub => sub.href === pathname);

  const toggleExpansion = () => {
    const newExpandedItems = new Set(expandedItems);
    if (isExpanded) {
      newExpandedItems.delete(item.label);
    } else {
      newExpandedItems.add(item.label);
    }
    setExpandedItems(newExpandedItems);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpansion();
    }
  };

  if (!item.items) {
    return (
      <Link
        href={item.href || "#"}
        className={`block rounded-md px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/20 ${isActive
            ? "bg-neutral-900 text-white"
            : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
          }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="rounded-md bg-neutral-950/50">
      <button
        onClick={toggleExpansion}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={`mobile-submenu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
        className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/20 ${isActive ? "text-white" : "text-neutral-400"
          }`}
      >
        <span>{item.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
        <div
          id={`mobile-submenu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          className="space-y-1 px-2 pb-2"
        >
          {item.items.map((subItem) => {
            const Icon = subItem.icon ? ICON_MAP[subItem.icon] : null;
            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-900 hover:text-white transition-colors focus:outline-none focus:bg-neutral-900 focus:text-white"
              >
                {Icon && (
                  <Icon className="h-4 w-4" aria-hidden="true" />
                )}
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}