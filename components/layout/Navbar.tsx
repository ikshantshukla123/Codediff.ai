import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { Code2 } from "lucide-react";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { UserActions } from "./UserActions";
import { NAVIGATION_CONFIG } from "./navigation-config";

// --- Types ---
export type SubItem = {
  href: string;
  label: string;
  description?: string;
  icon?: string; // Changed from LucideIcon to string
};

export type NavItem = {
  label: string;
  href?: string;
  icon?: string; // Changed from LucideIcon to string
  items?: SubItem[];
};

/**
 * Main Navbar component (Server Component)
 * Renders the static shell and delegates interactive features to Client Components
 */
export function Navbar() {
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

          {/* Desktop Navigation - Client Component for interactivity */}
          <SignedIn>
            <DesktopNavigation navigationConfig={NAVIGATION_CONFIG} />
          </SignedIn>
        </div>

        {/* Right: User Actions - Client Component for auth state and mobile menu */}
        <UserActions />
      </div>

      {/* Mobile Navigation - Client Component for state management */}
      <SignedIn>
        <MobileNavigation navigationConfig={NAVIGATION_CONFIG} />
      </SignedIn>
    </header>
  );
}

// Re-export configuration for use in other components
export { NAVIGATION_CONFIG } from "./navigation-config";