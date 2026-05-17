"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["admin", "salesman"] },
  { name: "POS", href: "/pos", icon: ShoppingCart, roles: ["admin", "salesman"] },
  { name: "Inventory", href: "/inventory", icon: Package, roles: ["admin"] },
  { name: "Customers", href: "/customers", icon: Users, roles: ["admin", "salesman"] },
  { name: "Maintenance", href: "/maintenance", icon: Wrench, roles: ["admin"] },
  { 
    name: "Configuration", 
    icon: Settings,
    roles: ["admin"],
    subItems: [
      { name: "Store/Locations", href: "/settings/branches" },
      { name: "Company Profile", href: "/settings/profile" },
      { name: "Global Settings", href: "/settings" },
    ]
  },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Configuration"]);
  const { theme, setTheme } = useTheme();
  const { user, userData, loading, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
 
  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Basic Route Protection
  useEffect(() => {
    if (mounted && !loading && userData) {
      const currentItem = navItems.find(item => {
        if (item.href === pathname) return true;
        if (item.subItems?.some(sub => sub.href === pathname)) return true;
        return false;
      });

      if (currentItem && !currentItem.roles.some(role => userData.roles?.includes(role))) {
        router.push("/"); // Redirect to dashboard if unauthorized
      }
    }
  }, [mounted, loading, userData, pathname, router]);

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

        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems
            .filter(item => item.roles.some(role => userData?.roles?.includes(role)))
            .map((item) => {
              const hasSubItems = !!item.subItems;
              const isExpanded = expandedItems.includes(item.name);
              const isActive = item.href ? pathname === item.href : item.subItems?.some(sub => pathname === sub.href);
              
              return (
                <div key={item.name} className="space-y-0.5">
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={cn(
                        "w-full group flex items-center px-3 py-2 rounded transition-colors duration-150 relative",
                        isExpanded ? "text-white" : "text-slate-400 hover:bg-[#24292e] hover:text-white"
                      )}
                    >
                      <item.icon className={cn("w-4.5 h-4.5 shrink-0", isExpanded ? "text-[#ff9900]" : "group-hover:text-white")} />
                      {isSidebarOpen && (
                        <>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="ml-3 text-xs font-medium flex-1 text-left"
                          >
                            {item.name}
                          </motion.span>
                          <ChevronRight className={cn("w-3 h-3 transition-transform duration-200", isExpanded && "rotate-90")} />
                        </>
                      )}
                    </button>
                  ) : (
                    <Link href={item.href || "#"}>
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
                  )}

                  {/* Sub Items */}
                  <AnimatePresence>
                    {hasSubItems && isExpanded && isSidebarOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden ml-4 pl-4 border-l border-[#24292e] space-y-0.5"
                      >
                        {item.subItems?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link key={sub.name} href={sub.href}>
                              <div
                                className={cn(
                                  "group flex items-center px-3 py-1.5 rounded transition-colors duration-150 text-[11px]",
                                  isSubActive 
                                    ? "text-[#ff9900] font-bold" 
                                    : "text-slate-500 hover:text-white"
                                )}
                              >
                                {sub.name}
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
        <header className="h-14 flex items-center justify-between px-4 bg-[var(--header-bg)] border-b border-[#24292e] text-[var(--header-foreground)] z-40 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#ff9900] transition-colors">
              <Menu className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold tracking-tight">Navigation</span>
            </div>
            {/* Search Bar Placeholder */}
            <div className="hidden lg:flex items-center bg-white/5 backdrop-blur-sm rounded-md border border-white/10 px-3 py-1.5 w-80">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search items, customers, or services..."
                className="bg-transparent border-none text-[11px] outline-none text-slate-200 placeholder:text-slate-500 w-full"
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
