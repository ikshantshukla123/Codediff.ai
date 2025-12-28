"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/Button"; // Reusing our new button!

export function Navbar() {
  return (
    <header className="border-b border-[#262626] bg-[#0a0a0a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Minimal Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-6 w-6 bg-white rounded-sm"></div>
          <span className="font-semibold text-lg text-white tracking-tight">CodeDiff</span>
        </Link>

        {/* Auth Controls */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              {/* We have to wrap our custom button to work with Clerk triggers */}
              <span>
                <Button variant="outline" size="sm">Sign In</Button>
              </span>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 ring-2 ring-[#262626]"
                }
              }}
            />
          </SignedIn>
        </div>

      </div>
    </header>
  );
}