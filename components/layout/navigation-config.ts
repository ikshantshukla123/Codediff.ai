import type { NavItem } from "./Navbar";

/**
 * Typed navigation configuration with icon names
 * Icons are resolved in Client Components to avoid serialization issues
 */
export const NAVIGATION_CONFIG: readonly NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Security",
    icon: "Shield",
    items: [
      {
        href: "/security/intelligence",
        label: "Threat Intelligence",
        description: "Live vulnerabilities & proofs",
        icon: "AlertTriangle"
      },
      {
        href: "/security/vulnerabilities",
        label: "Live Exploits",
        description: "Active breach attempts",
        icon: "Zap"
      },
      {
        href: "/security/compliance",
        label: "Compliance",
        description: "Audit logs & reports",
        icon: "Shield"
      },
    ]
  },
  {
    label: "Analytics",
    icon: "BarChart3",
    items: [
      {
        href: "/analytics",
        label: "Overview",
        description: "General metrics",
        icon: "BarChart3"
      },
      {
        href: "/analytics/predictive",
        label: "Predictive",
        description: "Future risk AI models",
        icon: "Brain"
      },
      {
        href: "/analytics/temporal",
        label: "Time Travel",
        description: "Code evolution history",
        icon: "Clock"
      },
    ]
  },
  {
    label: "Automation",
    icon: "Zap",
    items: [
      {
        href: "/automation/healing",
        label: "Auto-Healing",
        description: "Automated fix campaigns",
        icon: "Zap"
      },
      {
        href: "/automation/dna",
        label: "Codebase DNA",
        description: "Genetic structure analysis",
        icon: "Dna"
      },
    ]
  },
  {
    label: "Team",
    href: "/business/team",
    icon: "TrendingUp",
  }
] as const;