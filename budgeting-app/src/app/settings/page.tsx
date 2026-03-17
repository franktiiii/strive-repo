"use client";

import {
  User,
  Bell,
  Palette,
  Shield,
  CreditCard,
  Download,
  LogOut,
  ChevronRight,
  Moon,
  Smartphone,
} from "lucide-react";

const settingsSections = [
  {
    title: "Account",
    items: [
      {
        icon: User,
        label: "Profile",
        description: "Name, email, avatar",
        color: "#7B61FF",
        value: "frank@strive.app",
      },
      {
        icon: Shield,
        label: "Security",
        description: "Password, 2FA, sessions",
        color: "#00B4D8",
      },
      {
        icon: CreditCard,
        label: "Connected Accounts",
        description: "Bank accounts, cards",
        color: "#00D632",
        value: "2 connected",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        icon: Bell,
        label: "Notifications",
        description: "Push, email, budget alerts",
        color: "#FF9F43",
        value: "On",
      },
      {
        icon: Palette,
        label: "Appearance",
        description: "Theme, colors, display",
        color: "#FF6B9D",
        value: "Dark",
      },
      {
        icon: Moon,
        label: "Currency",
        description: "Default currency for display",
        color: "#A8FF00",
        value: "USD ($)",
      },
      {
        icon: Smartphone,
        label: "Mobile App",
        description: "Sync settings, biometric lock",
        color: "#00B4D8",
      },
    ],
  },
  {
    title: "Data",
    items: [
      {
        icon: Download,
        label: "Export Data",
        description: "Download your transactions as CSV",
        color: "#7B61FF",
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D632] to-[#A8FF00] flex items-center justify-center text-black text-2xl font-black">
            F
          </div>
          <div>
            <h2 className="text-xl font-bold">Frank</h2>
            <p className="text-sm text-muted-foreground">frank@strive.app</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Member since October 2025
            </p>
          </div>
          <div className="ml-auto">
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#00D632]/10 text-[#00D632]">
              Pro Plan
            </span>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      {settingsSections.map((section) => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {section.title}
          </h3>
          <div className="glass-card rounded-2xl overflow-hidden">
            {section.items.map((item, i) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left ${
                  i < section.items.length - 1 ? "border-b border-white/[0.04]" : ""
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                {item.value && (
                  <span className="text-sm text-muted-foreground shrink-0">{item.value}</span>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Danger zone */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Danger Zone
        </h3>
        <div className="glass-card rounded-2xl overflow-hidden">
          <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#FF4757]/5 transition-colors text-left">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FF4757]/10">
              <LogOut className="w-5 h-5 text-[#FF4757]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#FF4757]">Sign Out</p>
              <p className="text-xs text-muted-foreground">Log out of your account</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          </button>
        </div>
      </div>
    </>
  );
}
