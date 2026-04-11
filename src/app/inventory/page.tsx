"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  ChevronDown,
  Edit,
  Trash2,
  ExternalLink,
  ChevronRight,
  Database,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductService } from "@/services/firebase/ProductService";
import { Brand, BrandService } from "@/services/firebase/BrandService";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribeBrands = BrandService.listenToBrands(setBrands);
    const unsubscribeProducts = ProductService.listenToProducts((data) => {
      setProducts(data);
      setLoading(false);
    });

    return () => {
      unsubscribeBrands();
      unsubscribeProducts();
    };
  }, []);

  const filteredProducts = products.filter(p => 
    p.modelNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
             <Database className="w-3.5 h-3.5" /> Product Inventory
           </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Stock Management
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-bold border border-border bg-card hover:bg-muted transition-colors rounded flex items-center gap-2">
             <RefreshCw className="w-3 h-3" /> Refresh
          </button>
          <div className="h-6 w-[1px] bg-border mx-1" />
          <button className="px-3 py-1.5 text-xs font-bold border border-border bg-card hover:bg-muted transition-colors rounded">
             Settings
          </button>
          <button className="px-4 py-1.5 text-xs font-bold bg-[#ff9900] text-[#15191d] rounded hover:bg-[#ec7211] transition-all flex items-center gap-2 shadow-md">
            Add New Product
          </button>
        </div>
      </div>

      {/* Resource Count / Summary Banner */}
      <div className="bg-muted/30 border border-border rounded p-4 flex items-center justify-between">
         <div className="flex items-center gap-6 divide-x divide-border">
            <div className="flex flex-col pr-6">
               <span className="text-[10px] font-bold text-muted-foreground uppercase">Total Products</span>
               <span className="text-xl font-black text-foreground">{products.length}</span>
            </div>
            <div className="flex flex-col px-6">
               <span className="text-[10px] font-bold text-muted-foreground uppercase">In Stock units</span>
               <span className="text-xl font-black text-[#10b981]">{products.reduce((acc, p) => acc + (p.stock || 0), 0)}</span>
            </div>
            <div className="flex flex-col px-6">
               <span className="text-[10px] font-bold text-muted-foreground uppercase">Low Stock alerts</span>
               <span className="text-xl font-black text-[#f59e0b]">{products.filter(p => p.stock < 5).length}</span>
            </div>
         </div>
         <button className="p-2 hover:bg-muted rounded transition-colors text-muted-foreground">
           <MoreVertical className="w-4 h-4" />
         </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="console-card px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 bg-card">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Find by product SKU, model, or brand..."
              className="w-full pl-9 pr-4 py-1.5 bg-background border border-border rounded text-xs focus:ring-1 focus:ring-[#ff9900/50] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-3 py-1.5 border border-border bg-card hover:bg-muted transition-colors rounded text-xs font-bold flex items-center justify-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
            <div className="h-6 w-[1px] bg-border mx-1" />
            <span className="text-[11px] font-bold text-muted-foreground">Displaying {filteredProducts.length} results</span>
         </div>
      </div>

      {/* Data Table */}
      <div className="console-card overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm z-10 border-b border-border shadow-sm">
              <tr>
                <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded border-border" /></th>
                <th className="w-[30%] px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Model & SKU</th>
                <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Specification</th>
                <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Inventory State</th>
                <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Unit Price</th>
                <th className="w-24 px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-4 py-6 h-12 bg-muted/10"></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-20 text-center text-xs font-bold text-muted-foreground bg-muted/20">
                    No products found matching the specified pattern.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors group cursor-default">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-border" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-border rounded flex items-center justify-center bg-card shrink-0">
                          <Package className="w-4 h-4 text-[#ff9900]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#3b82f6] hover:underline cursor-pointer truncate flex items-center gap-2">
                             {p.modelNumber} <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                             <ChevronRight className="w-2 h-2" /> SKU: {p.id.substring(0, 12)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                        <p className="text-xs font-bold text-foreground">{p.brandName}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                          {p.btu} BTU • {p.type} • {p.inverter}
                        </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                         <div className={cn(
                           "w-1.5 h-1.5 rounded-full shrink-0",
                           p.stock < 5 ? "bg-[#f59e0b] animate-pulse" : "bg-[#10b981]"
                         )} />
                         <span className={cn(
                           "text-[11px] font-black uppercase tracking-tight",
                           p.stock < 5 ? "text-[#f59e0b]" : "text-[#10b981]"
                         )}>
                           {p.stock} units available
                         </span>
                      </div>
                      <div className="mt-1 w-full bg-border rounded-full h-1 overflow-hidden max-w-[120px]">
                         <div 
                           className={cn("h-full transition-all duration-1000", p.stock < 5 ? "bg-[#f59e0b]" : "bg-[#10b981]")} 
                           style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }} 
                         />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                       <p className="text-xs font-black text-foreground">Rs. {p.price.toLocaleString()}</p>
                       <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Per Unit</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                       <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-muted transition-colors rounded">
                             <Edit className="w-3.5 h-3.5 text-muted-foreground hover:text-[#ff9900]" />
                          </button>
                          <button className="p-1.5 hover:bg-muted transition-colors rounded">
                             <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination bar style */}
        <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between text-[11px] font-bold text-muted-foreground">
           <span>Items per page: 50</span>
           <div className="flex items-center gap-4">
              <span>Displaying 1-{filteredProducts.length} of {products.length} products</span>
              <div className="flex gap-1">
                 <button className="p-1 hover:bg-muted rounded border border-border opacity-50"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                 <button className="p-1 hover:bg-muted rounded border border-border"><ChevronRight className="w-4 h-4" /></button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
