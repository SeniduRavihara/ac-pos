"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  MoreVertical,
  History,
  Edit,
  Trash2,
  ChevronRight,
  Database,
  ShieldCheck,
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Customer, CustomerService } from "@/services/firebase/CustomerService";
import { cn } from "@/lib/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = CustomerService.listenToCustomers((data) => {
      setCustomers(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
             <ShieldCheck className="w-3.5 h-3.5" /> Customer Relations Management
           </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Customer Directory
          </h1>
        </div>
        <button className="px-4 py-1.5 text-xs font-bold bg-[#ff9900] text-[#15191d] rounded hover:bg-[#ec7211] transition-all flex items-center gap-2 shadow-md">
          <UserPlus className="w-4 h-4" /> Register New Customer
        </button>
      </div>

      {/* Summary Summary */}
      <div className="console-card p-4 flex items-center gap-6 bg-muted/20">
         <div className="flex flex-col items-center justify-center w-12 h-12 rounded border border-border bg-card">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
         </div>
         <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-border">
            <div className="flex flex-col px-4 first:pl-0">
               <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Customers</span>
               <span className="text-lg font-black">{customers.length}</span>
            </div>
            <div className="flex flex-col px-4">
               <span className="text-[10px] font-bold text-muted-foreground uppercase">Account Type</span>
               <span className="text-lg font-black text-[#ff9900]">Individual</span>
            </div>
         </div>
      </div>

      {/* Search Console */}
      <div className="console-card px-4 py-3 flex items-center bg-card">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filter by name, phone, or customer ID..."
              className="w-full pl-9 pr-4 py-1.5 bg-background border border-border rounded text-xs focus:ring-1 focus:ring-[#ff9900/50] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-40 rounded border border-border bg-muted/10 animate-pulse" />)
          ) : filteredCustomers.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-50 bg-muted/20 border-2 border-dashed border-border rounded">
               <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
               <p className="text-xs font-black uppercase tracking-widest text-foreground">No customers found</p>
            </div>
          ) : (
            filteredCustomers.map((c, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={c.id}
                className="console-card p-5 group flex flex-col justify-between hover:border-[#ff9900] transition-all bg-card"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 border border-border rounded flex items-center justify-center bg-blue-600/10 text-blue-600 dark:text-blue-400 font-black text-sm group-hover:bg-[#ff9900] group-hover:text-[#15191d] group-hover:border-transparent transition-all">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-muted rounded"><Edit className="w-3.5 h-3.5 text-muted-foreground hover:text-[#ff9900]" /></button>
                    <button className="p-1.5 hover:bg-muted rounded"><Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" /></button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-black text-foreground mb-1 flex items-center gap-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                    {c.name} <ChevronRight className="w-3 h-3 rotate-[-45deg] opacity-0 group-hover:opacity-100 transition-all font-black text-[#ff9900]" />
                  </h3>
                  <p className="text-[10px] font-mono text-muted-foreground mb-4">id:cus-{c.id.substring(0, 12)}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span className="text-[11px] font-bold text-foreground">{c.phone}</span>
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="text-[11px] font-bold text-foreground truncate">{c.email}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="text-[11px] font-medium leading-relaxed line-clamp-2">{c.address}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                   <div className="flex -space-x-1.5">
                      {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border border-card bg-muted flex items-center justify-center text-[8px] font-black text-muted-foreground">S</div>)}
                   </div>
                   <button className="text-[10px] font-black uppercase text-[#3b82f6] hover:underline flex items-center gap-1 transition-all">
                      View Service Events <ChevronRight className="w-3 h-3" />
                   </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
