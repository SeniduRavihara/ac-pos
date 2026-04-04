"use client";

import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Palette, 
  Database,
  Bell,
  Cpu,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Display", icon: Palette },
    { name: "Organization", icon: Shield },
    { name: "Storage", icon: Database },
    { name: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6 animate-in">
       {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
             <SettingsIcon className="w-3.5 h-3.5" /> IAM Settings
           </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Account Management
          </h1>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-3 py-1.5 text-xs font-bold border border-border bg-card hover:bg-muted transition-colors rounded">
              View Audit Logs
           </button>
           <button className="px-4 py-1.5 text-xs font-bold bg-[#ff9900] text-[#15191d] rounded hover:bg-[#ec7211] transition-all shadow-md active:scale-95">
             Save Changes
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         {/* Sidebar Tabs */}
         <div className="w-full lg:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 rounded text-left transition-all",
                  activeTab === tab.name 
                    ? "bg-[#24292e] text-[#ff9900] border border-[#ff9900]/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                   <tab.icon className="w-4 h-4" />
                   <span className="text-xs font-black uppercase tracking-widest">{tab.name}</span>
                </div>
                {activeTab === tab.name && <ChevronRight className="w-3 h-3" />}
              </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="flex-1 space-y-6 pb-20">
            {activeTab === "Profile" && (
                <div className="space-y-6">
                   <div className="console-card">
                      <div className="px-6 py-4 bg-muted/30 border-b border-border">
                         <h3 className="text-sm font-bold tracking-tight">Identity Overview</h3>
                      </div>
                      <div className="p-8 space-y-8">
                         <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded border border-border bg-muted/20 flex items-center justify-center text-2xl font-black text-[#ff9900]">
                               {user?.displayName?.charAt(0) || "U"}
                            </div>
                            <div className="space-y-1">
                               <h4 className="text-xl font-black">{user?.displayName || "System Administrator"}</h4>
                               <p className="text-xs text-muted-foreground font-mono leading-none flex items-center gap-2">
                                  arn:lk:acpos:iam::{user?.uid?.substring(0, 12)} <ExternalLink className="w-3 h-3" />
                               </p>
                               <div className="pt-2">
                                  <span className="px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Verified Root User</span>
                               </div>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</label>
                               <div className="px-4 py-2.5 bg-muted/10 border border-border rounded text-[11px] font-bold text-foreground">
                                  {user?.email}
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Authentication Method</label>
                               <div className="px-4 py-2.5 bg-muted/10 border border-border rounded text-[11px] font-bold text-foreground flex items-center gap-2">
                                  Google OAuth v2.0 <Cpu className="w-3 h-3 text-[#ff9900]" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="console-card p-6 border-l-4 border-l-[#ff9900]">
                      <div className="flex items-start gap-4">
                         <Shield className="w-5 h-5 text-[#ff9900] mt-0.5" />
                         <div className="space-y-1">
                            <h4 className="text-sm font-black">Security Compliance</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                               Your account is currently protected by enterprise-grade security protocols. 
                               Access attempts from unrecognized regions (lk-west-1a) will be logged and flagged.
                            </p>
                            <button className="text-[10px] font-black text-[#3b82f6] uppercase tracking-widest hover:underline mt-2">Manage Multi-Factor Auth</button>
                         </div>
                      </div>
                   </div>
                </div>
            )}

            {activeTab === "Display" && (
                <div className="space-y-6">
                   <div className="console-card">
                      <div className="px-6 py-4 bg-muted/30 border-b border-border">
                         <h3 className="text-sm font-bold tracking-tight">Theme Preferences</h3>
                      </div>
                      <div className="p-8">
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              { name: "Light", icon: Sun, id: "light", desc: "Warm AWS Login-inspired beige" },
                              { name: "Dark", icon: Moon, id: "dark", desc: "Deep AWS Console-inspired navy" },
                              { name: "System", icon: Monitor, id: "system", desc: "Sync with your OS resources" }
                            ].map((mode) => (
                              <button
                                key={mode.id}
                                onClick={() => setTheme(mode.id)}
                                className={cn(
                                  "flex flex-col items-center p-6 rounded border text-center transition-all",
                                  theme === mode.id 
                                    ? "border-[#ff9900] bg-[#ff9900]/5 ring-1 ring-[#ff9900]/20" 
                                    : "border-border hover:bg-muted"
                                )}
                              >
                                <div className={cn(
                                  "w-12 h-12 rounded-full border border-border flex items-center justify-center mb-4",
                                  theme === mode.id ? "bg-[#ff9900] text-white" : "bg-card text-muted-foreground"
                                )}>
                                   <mode.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-widest mb-1">{mode.name} Mode</h4>
                                <p className="text-[10px] text-muted-foreground leading-normal">{mode.desc}</p>
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
            )}

            <div className="console-card p-6 bg-muted/10 opacity-70 cursor-not-allowed">
               <h3 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" /> Global Instance Settings
               </h3>
               <p className="text-[10px] italic">Access to regional configuration (lk-west-1) is managed by the root organization.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
