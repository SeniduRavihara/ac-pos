"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Wrench,
  ChevronRight,
  Sun,
  Moon,
  Search,
  Bell,
  HelpCircle,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "POS", href: "/pos", icon: ShoppingCart },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-background bg-pattern-cube overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 64 }}
        className="relative flex flex-col h-full bg-[#15191d] text-white z-50 border-r border-[#24292e]"
      >
        {/* Sidebar Header/Logo */}
        <div className="flex items-center h-14 px-4 bg-[#15191d] border-b border-[#24292e]">
          <div className="w-8 h-8 rounded bg-[#ff9900] flex items-center justify-center text-[#15191d] font-bold shrink-0 shadow-lg shadow-black/20">
            <Cpu className="w-5 h-5 fill-current" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 font-semibold text-sm tracking-tight whitespace-nowrap overflow-hidden"
              >
                CoolFlow POS
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center px-3 py-2 rounded transition-colors duration-150 relative",
                    isActive 
                      ? "bg-[#24292e] text-[#ff9900]" 
                      : "text-slate-400 hover:bg-[#24292e] hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-[#ff9900]" : "group-hover:text-white")} />
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-3 text-xs font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-full bg-[#ff9900]" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-[#24292e]">
          <button 
            onClick={logout}
            className="flex items-center w-full px-3 py-2 rounded text-slate-400 hover:bg-[#24292e] hover:text-white transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            {isSidebarOpen && <span className="ml-3 text-xs font-medium">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute right-[-12px] top-6 w-6 h-6 bg-[#24292e] border border-[#3b4149] rounded flex items-center justify-center text-slate-400 hover:text-white transition-all z-50 shadow-md"
        >
          <ChevronRight className={cn("w-3 h-3 transition-transform", isSidebarOpen && "rotate-180")} />
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 bg-[#15191d] border-b border-[#24292e] text-white z-40 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#ff9900] transition-colors">
              <Menu className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold tracking-tight">Navigation</span>
            </div>
            {/* Search Bar Placeholder */}
            <div className="hidden lg:flex items-center bg-[#24292e] rounded-md border border-[#3b4149] px-3 py-1.5 w-80">
              <Search className="w-4 h-4 text-slate-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search items, customers, or services..."
                className="bg-transparent border-none text-[11px] outline-none text-slate-300 w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-slate-400 hover:bg-[#24292e] hover:text-white rounded-md transition-all active:scale-95"
             >
               {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </button>
             <button className="p-2 text-slate-400 hover:bg-[#24292e] hover:text-white rounded-md transition-all">
               <Bell className="w-4 h-4" />
             </button>
             <button className="hidden sm:flex p-2 text-slate-400 hover:bg-[#24292e] hover:text-white rounded-md transition-all">
               <HelpCircle className="w-4 h-4" />
             </button>
             <div className="h-6 w-[1px] bg-[#24292e] mx-2" />
             <div className="flex items-center gap-2 bg-[#24292e] hover:bg-[#3b4149] cursor-pointer px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-[#ff9900]/30 group">
               <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black group-hover:bg-[#ff9900] transition-colors">
                 {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "A"}
               </div>
               <span className="text-[11px] font-bold text-slate-300 group-hover:text-white">
                 {user?.displayName || user?.email?.split('@')[0] || "Admin"}
               </span>
               <ChevronRight className="w-3 h-3 text-slate-500 rotate-90" />
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="min-h-full px-6 py-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
