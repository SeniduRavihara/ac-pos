"use client";

import React from "react";
import { Building2, ShieldCheck, Mail, Globe, MapPin, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CompanyProfilePage() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
             <Building2 className="w-3.5 h-3.5" /> Organizational Profile
           </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Company Configuration
          </h1>
        </div>
        <button className="px-4 py-1.5 text-xs font-bold bg-[#ff9900] text-[#15191d] rounded hover:bg-[#ec7211] transition-all flex items-center gap-2 shadow-md">
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="console-card p-6 space-y-8">
             <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded border-2 border-dashed border-border flex items-center justify-center bg-muted/20">
                   <Building2 className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                   <h2 className="text-xl font-black text-foreground">CoolFlow POS Solutions</h2>
                   <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Verified Enterprise Account
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Official Email</p>
                      <p className="text-xs font-bold flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" /> contact@coolflowpos.com</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Corporate Website</p>
                      <p className="text-xs font-bold flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-muted-foreground" /> www.coolflowpos.com</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Primary HQ</p>
                      <p className="text-xs font-bold flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Colombo 03, Sri Lanka</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Tax Identifier (VAT)</p>
                      <p className="text-xs font-bold flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" /> SL-VAT-2024-998811</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="console-card p-6">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Security Compliance</h3>
              <div className="space-y-3">
                 {[
                   { label: "Data Encryption", status: "Enabled", color: "text-[#10b981]" },
                   { label: "Audit Logging", status: "Active", color: "text-[#10b981]" },
                   { label: "Multi-factor Auth", status: "Required", color: "text-[#3b82f6]" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-xs font-medium text-slate-400">{item.label}</span>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.status}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
