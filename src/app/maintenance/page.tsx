"use client";

import React, { useState, useEffect } from "react";
import { 
  Wrench, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  CalendarDays,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MaintenanceRecord, MaintenanceService } from "@/services/firebase/MaintenanceService";
import { cn } from "@/lib/utils";

export default function MaintenancePage() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = MaintenanceService.listenToUpcomingMaintenance((data) => {
      setRecords(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20";
      case "Overdue": return "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20";
      default: return "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20";
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
             <Wrench className="w-3.5 h-3.5" /> Maintenance & Ops
           </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Service Events
          </h1>
        </div>
        <button className="px-5 py-2.5 bg-[#ff9900] text-[#15191d] rounded hover:bg-[#ec7211] transition-all font-bold flex items-center gap-2 shadow-md">
          <CalendarDays className="w-5 h-5" /> Schedule Maintenance
        </button>
      </div>

      {/* Overview Tracker */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending Events", value: records.filter(r => r.status === "Scheduled").length, icon: Calendar, color: "text-[#3b82f6]" },
          { label: "Today's Quota", value: "4", icon: Clock, color: "text-[#ff9900]" },
          { label: "Completed", value: records.filter(r => r.status === "Completed").length, icon: CheckCircle2, color: "text-[#10b981]" },
          { label: "Overdue Alerts", value: records.filter(r => r.status === "Overdue").length, icon: AlertCircle, color: "text-[#ef4444]" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i} 
            className="console-card p-4 flex items-center gap-4 bg-muted/20"
          >
             <div className="p-2 rounded border border-border bg-card">
               <stat.icon className={cn("w-5 h-5", stat.color)} />
             </div>
             <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider leading-none mb-1">{stat.label}</p>
               <h4 className="text-lg font-black text-foreground leading-none">{stat.value}</h4>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table style list */}
      <div className="console-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <Database className="w-4 h-4 text-[#ff9900]" /> Scheduled Operations
           </h3>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Filter by Date</span>
              <button className="p-1.5 hover:bg-muted rounded border border-border"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
           </div>
        </div>

        <div className="divide-y divide-border/50">
          <AnimatePresence>
            {loading ? (
               [1,2,3].map(i => <div key={i} className="h-24 px-6 py-4 animate-pulse flex items-center gap-4"><div className="w-12 h-12 bg-muted rounded" /><div className="flex-1 space-y-2"><div className="h-3 bg-muted rounded w-1/4" /><div className="h-3 bg-muted rounded w-1/2" /></div></div>)
            ) : records.length === 0 ? (
              <div className="py-24 text-center opacity-40">
                 <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                 <p className="text-[11px] font-black uppercase tracking-[0.2em]">No scheduled service tasks found</p>
              </div>
            ) : (
              records.map((r, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={r.id}
                  className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-6 group hover:bg-muted/30 transition-all border-l-4 border-l-transparent hover:border-l-[#ff9900]"
                >
                  {/* Event ID & Date */}
                  <div className="flex items-center gap-4 md:w-48 shrink-0">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded border border-border bg-card text-[#3b82f6] font-black">
                      <span className="text-[9px] uppercase font-bold tracking-tighter opacity-60 font-mono mb-0.5">{new Date(r.nextServiceDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                      <span className="text-xl leading-none">{new Date(r.nextServiceDate).getDate()}</span>
                    </div>
                     <div className="min-w-0">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Ref ID</p>
                      <p className="text-[11px] font-mono font-bold text-foreground">mnt-{r.id.substring(0, 8)}</p>
                    </div>
                  </div>

                  {/* Resource Identity */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded border border-border bg-muted/20 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Customer</p>
                        <p className="text-xs font-bold text-foreground hover:text-[#3b82f6] cursor-pointer inline-flex items-center gap-1 group">
                          {r.customerName} <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded border border-border bg-muted/20 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Unit Serial</p>
                        <p className="text-xs font-mono font-bold text-foreground">sn-{r.serialNumber.substring(0, 10)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Status */}
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                    <span className={cn(
                      "px-3 py-1 text-[9px] font-black uppercase border tracking-[0.15em] rounded-sm",
                      getStatusColor(r.status)
                    )}>
                      {r.status}
                    </span>
                     <div className="flex items-center gap-2">
                      <button className="p-2 bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981] hover:text-white rounded border border-[#10b981]/30 transition-all font-black text-[10px] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETE
                      </button>
                      <button className="p-2 hover:bg-muted rounded border border-border"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
