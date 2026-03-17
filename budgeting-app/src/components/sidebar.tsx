"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Target,
  Trophy,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4">
        <button onClick={() => setMobileOpen(true)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
        <span className="ml-3 text-xl font-bold gradient-text">STRIVE</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-[260px] bg-[#0E0E16] border-r border-white/[0.06] flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D632] to-[#A8FF00] flex items-center justify-center">
              <span className="text-black font-black text-lg">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">STRIVE</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                Always Strive & Prosper
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#00D632]/10 text-[#00D632]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_6px_rgba(0,214,50,0.5)]")} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00D632] shadow-[0_0_6px_rgba(0,214,50,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info + sign out */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#00D632]/20 flex items-center justify-center text-[#00D632] text-sm font-bold">
              {user?.email?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <span className="text-sm text-white/70 truncate flex-1">
              {user?.email ?? ""}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/50 hover:text-[#FF4757] hover:bg-[#FF4757]/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
