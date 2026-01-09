"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/Button"; // Assuming you have this
import {
  LayoutDashboard,
  BarChart3,
  Shield,
  Github,
  Brain,
  Zap,
  Dna,
  Clock,
  AlertTriangle,
  TrendingUp,
  Settings,
  ChevronDown,
  Menu,
  X,
  Code2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// --- Types ---
type SubItem = {
  href: string;
  label: string;
  description?: string; // Added description for pro look
  icon?: any;
};

type NavItem = {
  label: string;
  href?: string; // Optional: if it's just a trigger for a menu
  icon?: any;
  items?: SubItem[]; // Dropdown items
};

// --- Configuration ---
const NAVIGATION_config: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Security",
    icon: Shield,
    items: [
      { href: "/security/intelligence", label: "Threat Intelligence", description: "Live vulnerabilities & proofs", icon: AlertTriangle },
      { href: "/security/vulnerabilities", label: "Live Exploits", description: "Active breach attempts", icon: Zap },
      { href: "/security/compliance", label: "Compliance", description: "Audit logs & reports", icon: Shield },
    ]
  },
  {
    label: "Analytics",
    icon: BarChart3,
    items: [
      { href: "/analytics", label: "Overview", description: "General metrics", icon: BarChart3 },
      { href: "/analytics/predictive", label: "Predictive", description: "Future risk AI models", icon: Brain },
      { href: "/analytics/temporal", label: "Time Travel", description: "Code evolution history", icon: Clock },
    ]
  },
  {
    label: "Automation",
    icon: Zap,
    items: [
      { href: "/automation/healing", label: "Auto-Healing", description: "Automated fix campaigns", icon: Zap },
      { href: "/automation/dna", label: "Codebase DNA", description: "Genetic structure analysis", icon: Dna },
    ]
  },
  {
    label: "Team",
    href: "/business/team",
    icon: TrendingUp,
  }
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Left: Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-black">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="hidden text-sm font-bold text-white sm:inline-block">
              CodeDiff AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <SignedIn>
            <nav className="hidden md:flex items-center gap-1">
              {NAVIGATION_config.map((item) => (
                <DesktopNavItem key={item.label} item={item} pathname={pathname} />
              ))}
            </nav>
          </SignedIn>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* How It Works - Available to everyone */}
          <Link
            href="/how-it-works"
            className="hidden items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white sm:flex"
          >
            <Brain className="h-3.5 w-3.5" />
            <span>How It Works</span>
          </Link>

          <SignedIn>
            {/* Repo Connect (Compact) */}
            <Link
              href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}
              className="hidden items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white sm:flex"
            >
              <Github className="h-3.5 w-3.5" />
              <span>Connect Repo</span>
            </Link>

            {/* Settings Icon */}
            <Link href="/settings" className="text-neutral-400 transition-colors hover:text-white">
              <Settings className="h-4 w-4" />
            </Link>
          </SignedIn>

          {/* Auth */}
          <div className="flex items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="h-8 border-neutral-700 text-xs">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7 ring-2 ring-neutral-900",
                    userButtonPopoverCard: "bg-neutral-950 border border-neutral-800 shadow-2xl",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
              />
            </SignedIn>

            {/* Mobile Toggle */}
            <SignedIn>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-4 md:hidden text-neutral-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-14 h-[calc(100vh-3.5rem)] w-full overflow-y-auto bg-black border-b border-neutral-800 p-4 md:hidden">
          <div className="flex flex-col space-y-4">
            {NAVIGATION_config.map((item) => (
              <MobileNavItem key={item.label} item={item} pathname={pathname} />
            ))}
            <Link
              href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}
              className="flex items-center gap-3 rounded-md bg-neutral-900 px-4 py-3 text-sm font-medium text-white"
            >
              <Github className="h-4 w-4" />
              Connect Repository
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// --- Sub-Components ---

function DesktopNavItem({ item, pathname }: { item: NavItem, pathname: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if active (either the main link or one of the sub-items)
  const isActive = item.href === pathname || item.items?.some(sub => sub.href === pathname);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150); // Small delay to prevent flickering
  };

  if (!item.items) {
    // Standard Link
    return (
      <Link
        href={item.href || "#"}
        className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${isActive ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
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
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md ${isOpen || isActive ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
          }`}
      >
        {item.label}
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Content */}
      <div
        className={`absolute left-0 top-full pt-2 w-64 transition-all duration-200 ${isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-1 invisible"
          }`}
      >
        <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-xl ring-1 ring-black/5">
          <div className="p-1">
            {item.items.map((subItem) => {
              const Icon = subItem.icon;
              return (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className="group flex items-start gap-3 rounded-md p-2 hover:bg-neutral-900 transition-colors"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 group-hover:border-neutral-700 group-hover:text-white">
                    {Icon && <Icon className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-200 group-hover:text-white">
                      {subItem.label}
                    </div>
                    {subItem.description && (
                      <div className="text-xs text-neutral-500 line-clamp-1 group-hover:text-neutral-400">
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

function MobileNavItem({ item, pathname }: { item: NavItem, pathname: string | null }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = item.href === pathname || item.items?.some(sub => sub.href === pathname);

  if (!item.items) {
    return (
      <Link
        href={item.href || "#"}
        className={`block rounded-md px-4 py-3 text-sm font-medium ${isActive ? "bg-neutral-900 text-white" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
          }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="rounded-md bg-neutral-950/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium ${isActive ? "text-white" : "text-neutral-400"
          }`}
      >
        <span>{item.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {isExpanded && (
        <div className="space-y-1 px-2 pb-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              {subItem.icon && <subItem.icon className="h-4 w-4" />}
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}