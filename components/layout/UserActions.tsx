"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Brain, Github, Settings, Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";

/**
 * UserActions Client Component
 * Handles authentication UI and mobile menu toggle
 */
export function UserActions() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    // Dispatch custom event to notify MobileNavigation component
    window.dispatchEvent(new CustomEvent('toggleMobileMenu'));
  };

  // Listen for route changes to sync mobile menu state
  useEffect(() => {
    const handleRouteChange = () => setIsMobileMenuOpen(false);

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* How It Works - Available to everyone */}
      <Link
        href="/how-it-works"
        className="hidden items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white sm:flex focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <Brain className="h-3.5 w-3.5" aria-hidden="true" />
        <span>How It Works</span>
      </Link>

      <SignedIn>
        {/* Repo Connect (Compact)
        <Link
          href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}
          className="hidden items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white sm:flex focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <Github className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Connect Repo</span>
        </Link> */}

        {/* Settings Icon */}
        <Link
          href="/settings"
          className="text-neutral-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </SignedIn>

      {/* Auth */}
      <div className="flex items-center">
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-neutral-700 text-xs focus:ring-white/20"
            >
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-7 w-7 ring-2 ring-neutral-900 focus:ring-white/20",
                userButtonPopoverCard: "bg-neutral-950 border border-neutral-800 shadow-2xl",
                userButtonPopoverFooter: "hidden"
              }
            }}
          />
        </SignedIn>

        {/* Mobile Toggle */}
        <SignedIn>
          <button
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle mobile navigation"
            className="ml-4 md:hidden text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded p-1"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </SignedIn>
      </div>
    </div>
  );
}