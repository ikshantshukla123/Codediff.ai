"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/Button";
import { LayoutDashboard, BarChart3, Shield, Github } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/charts", label: "Analytics", icon: BarChart3 },
  ];

  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));

  return (
    <header className="border-b border-[#262626] bg-[#0a0a0a]/95 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg text-white tracking-tight">CodeDiff</span>
          </Link>

          {/* Navigation Links */}
          <SignedIn>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-[#1a1a1a] text-white border border-[#262626]"
                        : "text-gray-400 hover:text-white hover:bg-[#111111]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </SignedIn>
        </div>

        {/* Auth Controls */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <span>
                <Button variant="outline" size="sm">Sign In</Button>
              </span>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <Link 
              href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden md:inline">Connect Repo</span>
            </Link>
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