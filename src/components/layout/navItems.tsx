import type { ReactNode } from "react";
import { House, ScrollText, User, Medal, Shield } from "lucide-react";
import { AuctionIcon, BannedIcon } from "../layout/navIcon";

export type NavItemConfig = {
  to: string;
  label: string;
  icon: ReactNode;
  isActive: (pathname: string) => boolean;
};

const iconClass = "w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]";

// The 5 always-visible links. Both the desktop bar and the mobile menu
// map over this instead of each hardcoding their own <NavItem> list.
export const primaryNavItems: NavItemConfig[] = [
  { to: "/", label: "Home", icon: <House className={iconClass} />, isActive: (p) => p === "/" },
  { to: "/rules", label: "Rules", icon: <ScrollText className={iconClass} />, isActive: (p) => p.startsWith("/rules") },
  { to: "/players", label: "Players", icon: <User className={iconClass} />, isActive: (p) => p.startsWith("/players") },
  {
    to: "/seasons",
    label: "Standings",
    icon: <Medal className={iconClass} />,
    isActive: (p) => p.startsWith("/seasons") || p.startsWith("/group-stage"),
  },
  { to: "/admins", label: "Admins", icon: <Shield className={iconClass} />, isActive: (p) => p.startsWith("/admins") },
];

// The "Explore" desktop dropdown / extra mobile links
export const exploreNavItems: NavItemConfig[] = [
  { to: "/auction", label: "Auction", icon: <AuctionIcon />, isActive: (p) => p.startsWith("/auction") },
  { to: "/wall-of-shame", label: "Banned", icon: <BannedIcon />, isActive: (p) => p.startsWith("/wall-of-shame") },
];