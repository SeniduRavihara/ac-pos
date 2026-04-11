"use client";

import React from "react";
import { 
  TrendingUp, 
  Package, 
  Users, 
  Wrench, 
  ExternalLink,
  ShoppingCart,
  Activity,
  Server,
  CloudLightning,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SeedService } from "@/services/firebase/SeedService";
import { useState } from "react";

const stats = [
  { name: "Total Sales", value: "Rs. 1,245,000", icon: ShoppingCart, change: "+12.5%", color: "text-[#3b82f6]" },
  { name: "Inventory", value: "48", icon: Package, change: "-4", color: "text-[#ff9900]" },
  { name: "Customers", value: "124", icon: Users, change: "+8", color: "text-[#10b981]" },
  { name: "Service Tasks", value: "12", icon: Wrench, change: "Scheduled", color: "text-[#8b5cf6]" },
];

export default function DashboardPage() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await SeedService.seedAll();
      alert("Mock data initialized successfully!");
    } catch (e) {
      console.error(e);
      alert("Data generation failed. Check Console / Firebase Config.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            CoolFlow Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            Branch: <span className="font-bold text-foreground">Colombo Main</span> <ChevronRight className="w-3 h-3" /> 
            Status: <span className="flex items-center gap-1 text-[#10b981] font-bold"><Activity className="w-3 h-3" /> Online</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-bold border border-border bg-card hover:bg-muted transition-colors rounded">
             Refresh
          </button>
          <button className="px-4 py-1.5 text-xs font-bold bg-[#ff9900] text-[#15191d] rounded hover:bg-[#ec7211] transition-all shadow-md active:scale-95 flex items-center gap-2">
            <PlusIcon /> Launch POS
          </button>
        </div>
      </div>

      {/* AWS Look Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="console-card p-5 group hover:border-[#ff9900]/50 transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-2">
               <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{stat.name}</span>
               <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-black text-foreground">{stat.value}</h2>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                stat.change.startsWith("+") ? "bg-[#10b981]/10 text-[#10b981]" : "bg-muted text-muted-foreground"
              )}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Console Features / Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           {/* Service Health Card */}
           <div className="console-card overflow-hidden">
              <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
                 <h3 className="text-sm font-bold flex items-center gap-2">
                   <Server className="w-4 h-4 text-[#ff9900]" /> Operational Status
                 </h3>
                 <span className="text-[10px] font-bold text-muted-foreground">Updated 2m ago</span>
              </div>
              <div className="p-6">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="space-y-4">
                       <p className="text-[11px] font-black text-muted-foreground uppercase tracking-tighter">Inventory Health</p>
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full border-4 border-[#10b981] flex items-center justify-center">
                             <span className="text-lg font-black">92%</span>
                          </div>
                          <div>
                             <p className="text-sm font-bold">In-Stock units</p>
                             <p className="text-xs text-muted-foreground">All branches</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[11px] font-black text-muted-foreground uppercase tracking-tighter">Active Sessions</p>
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full border-4 border-[#3b82f6] flex items-center justify-center">
                             <span className="text-lg font-black">8</span>
                          </div>
                          <div>
                             <p className="text-sm font-bold">Live POS Clients</p>
                             <p className="text-xs text-muted-foreground">Connected via WebSocket</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[11px] font-black text-muted-foreground uppercase tracking-tighter">Schedules</p>
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full border-4 border-[#8b5cf6] flex items-center justify-center">
                             <span className="text-lg font-black">12</span>
                          </div>
                          <div>
                             <p className="text-sm font-bold">Planned Maintenance</p>
                             <p className="text-xs text-muted-foreground">Next 48 hours</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Sales Feed */}
           <div className="console-card">
              <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                     <CloudLightning className="w-4 h-4 text-[#ff9900]" /> Recent Activity
                  </h3>
                 <button className="text-xs text-[#3b82f6] font-bold hover:underline">View All Events</button>
              </div>
              <div className="divide-y divide-border">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                       <div>
                          <p className="text-xs font-bold">Transaction: Order completion for ord-1092</p>
                          <p className="text-[11px] text-muted-foreground">User: Admin@Colombo • Resource: Panasonic-Inv-1.5T</p>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">2026-04-03 23:45 UTC</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="space-y-6">
            <div className="console-card bg-[#24292e] text-white border-none">
               <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold tracking-tight">Business Efficiency Tips</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Increase your AC service cycle efficiency by 24% by enabling predictive maintenance logging. Check the local branch documentation for more details.
                  </p>
                 <button className="px-4 py-2 bg-[#ff9900] text-[#15191d] text-xs font-black rounded hover:bg-[#ec7211] transition-all flex items-center gap-2 uppercase tracking-tighter shadow-xl">
                   Learn More <ExternalLink className="w-3.5 h-3.5" />
                 </button>
              </div>
           </div>

           <div className="console-card p-6 border-l-4 border-l-[#ff9900]">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Quick Links</h4>
              <ul className="space-y-3">
                  {['Sales & Billing Dashboard', 'Service Guides', 'AC Support Center', 'POS Access Control'].map(link => (
                    <li key={link}>
                       <a href="#" className="text-xs font-bold text-[#3b82f6] hover:underline flex items-center justify-between group">
                         {link} <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </a>
                    </li>
                  ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2.5V9.5M2.5 6H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
