"use client";

import React from "react";
import { 
  Building2, 
  MapPin, 
  Users, 
  Activity, 
  Phone, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  MoreVertical,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const branches = [
  {
    id: "br-001",
    name: "Colombo Main Branch",
    location: "Colombo 03, Sri Lanka",
    manager: "Senidu Ravihara",
    phone: "+94 77 123 4567",
    status: "Active",
    sales: "Rs. 845,000",
    performance: 92,
    color: "bg-[#10b981]"
  },
  {
    id: "br-002",
    name: "Galle Branch",
    location: "Galle Fort, Galle",
    manager: "Hansana Perera",
    phone: "+94 77 987 6543",
    status: "Maintenance",
    sales: "Rs. 420,000",
    performance: 78,
    color: "bg-[#f59e0b]"
  }
];

export default function BranchesPage() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
             <Building2 className="w-3.5 h-3.5" /> Store/Locations Management
           </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Branch Infrastructure
          </h1>
        </div>
        <button className="px-4 py-1.5 text-xs font-bold bg-[#ff9900] text-[#15191d] rounded hover:bg-[#ec7211] transition-all flex items-center gap-2 shadow-md">
          <Plus className="w-4 h-4" /> Provision New Branch
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Active Branches", value: "2", icon: Building2, color: "text-[#3b82f6]" },
          { label: "Global Performance", value: "85%", icon: Activity, color: "text-[#10b981]" },
          { label: "Operational Quota", value: "Available", icon: Zap, color: "text-[#ff9900]" },
        ].map((stat, i) => (
          <div key={i} className="console-card p-5">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
               <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <h2 className="text-2xl font-black text-foreground">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Branch List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {branches.map((branch, i) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="console-card overflow-hidden group"
          >
            <div className="px-6 py-4 bg-muted/30 border-b border-border flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", branch.status === "Active" ? "bg-[#10b981]" : "bg-[#f59e0b]")} />
                  <h3 className="text-sm font-bold tracking-tight">{branch.name}</h3>
               </div>
               <span className="text-[10px] font-mono text-muted-foreground">{branch.id}</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Location Metadata</p>
                     <p className="text-xs font-bold flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {branch.location}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Branch Manager</p>
                     <p className="text-xs font-bold flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" /> {branch.manager}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Contact Protocol</p>
                     <p className="text-xs font-bold flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {branch.phone}
                     </p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Health & Performance</p>
                        <span className="text-xs font-black">{branch.performance}%</span>
                     </div>
                     <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-1000", branch.color)} 
                          style={{ width: `${branch.performance}%` }} 
                        />
                     </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded border border-border flex items-center justify-between">
                     <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Active Sales Quota</p>
                        <p className="text-lg font-black text-foreground">{branch.sales}</p>
                     </div>
                     <button className="p-2 hover:bg-[#24292e] rounded transition-colors group/btn">
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/btn:text-[#ff9900]" />
                     </button>
                  </div>
               </div>
            </div>

            <div className="px-6 py-3 bg-muted/10 border-t border-border flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <button className="text-[10px] font-black text-[#3b82f6] uppercase tracking-widest hover:underline flex items-center gap-1">
                     <ShieldCheck className="w-3 h-3" /> Security Logs
                  </button>
                  <button className="text-[10px] font-black text-[#3b82f6] uppercase tracking-widest hover:underline flex items-center gap-1">
                     <Activity className="w-3 h-3" /> Real-time Metrics
                  </button>
               </div>
               <button className="p-1 hover:bg-muted rounded">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
