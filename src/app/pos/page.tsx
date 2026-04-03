"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Search, 
  User, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  CreditCard,
  Banknote,
  Building2,
  PackageCheck,
  ChevronDown,
  Cpu,
  Monitor,
  Zap,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductService } from "@/services/firebase/ProductService";
import { Customer, CustomerService } from "@/services/firebase/CustomerService";
import { SalesService, SaleItem } from "@/services/firebase/SalesService";
import { cn } from "@/lib/utils";

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "Bank Transfer">("Cash");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsubProducts = ProductService.listenToProducts(setProducts);
    const unsubCustomers = CustomerService.listenToCustomers(setCustomers);
    return () => { unsubProducts(); unsubCustomers(); };
  }, []);

  const total = cart.reduce((acc, item) => acc + (item.price || 0), 0);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart([...cart, product]);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCheckout = async () => {
    if (!selectedCustomerId || cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      const saleItems: SaleItem[] = cart.map(p => ({
        productId: p.id,
        productName: p.modelNumber,
        serialNumber: p.serialNumbers[0] || "N/A",
        price: p.price
      }));

      await SalesService.processSale({
        customerId: selectedCustomerId,
        customerName: selectedCustomer?.name || "Unknown",
        items: saleItems,
        totalAmount: total,
        paymentMethod: paymentMethod,
      });

      setCart([]);
      setSelectedCustomerId("");
      alert("Billing completed successfully!");
    } catch (error) {
      console.error(error);
      alert("Error processing transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.modelNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-140px)] animate-in">
      {/* Resource Navigator */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">Point of Sale</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">lk-west-1a-az1 • Active Session</p>
           </div>
           <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Find resources by pattern..."
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded text-xs focus:ring-1 focus:ring-[#ff9900]/50 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
            <AnimatePresence>
              {filteredProducts.map((p) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className={cn(
                    "console-card p-4 group cursor-pointer hover:border-[#ff9900] transition-all relative overflow-hidden",
                    p.stock <= 0 && "opacity-50 grayscale cursor-not-allowed grayscale-0"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 border border-border rounded flex items-center justify-center bg-muted/20 group-hover:bg-[#ff9900]/5 transition-colors">
                      <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-[#ff9900]" />
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground bg-muted p-1 px-2 rounded mb-1 inline-block">Units: {p.stock}</span>
                       <p className="text-xs font-black text-foreground">Rs. {p.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-foreground truncate">{p.modelNumber}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">{p.brandName} • {p.btu} BTU</p>
                  
                  <div className="flex items-center gap-2">
                     <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }} />
                     </div>
                     <span className="text-[10px] font-black text-[#ff9900/80] opacity-0 group-hover:opacity-100 transition-opacity uppercase">Provision Product</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cart Control Panel */}
      <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0 h-full">
        <div className="console-card flex-1 flex flex-col rounded overflow-hidden">
           {/* Header */}
           <div className="px-6 py-4 bg-muted/40 border-b border-border flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#ff9900]" /> Resource Provisioning
              </h3>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
           </div>

           {/* Items List */}
           <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-pattern-cube bg-fixed">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                   <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/30 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                   </div>
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-2 text-foreground">Empty Resource Collection</p>
                   <p className="text-[10px] text-muted-foreground tracking-tighter">Select a provisionable resource from the navigator</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={`${item.id}-${index}`} 
                    className="flex flex-col p-3 rounded bg-card border border-border group relative hover:border-[#ff9900]/30 transition-all"
                  >
                     <div className="flex items-center justify-between">
                        <div className="min-w-0">
                           <p className="text-xs font-black text-[#3b82f6] truncate group-hover:text-foreground transition-colors">{item.modelNumber}</p>
                           <p className="text-[10px] font-mono text-muted-foreground">inst-{item.id.substring(0, 8)}</p>
                        </div>
                        <p className="text-xs font-black">Rs. {item.price.toLocaleString()}</p>
                     </div>
                     <button 
                       onClick={() => removeFromCart(index)}
                       className="absolute top-2 right-2 p-1.5 bg-muted rounded opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all scale-90 group-hover:scale-100"
                     >
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                  </motion.div>
                ))
              )}
           </div>

           {/* Totals & Provisioning Action */}
           <div className="p-6 bg-muted/30 border-t border-border space-y-6">
              {/* Target Instance (Customer) */}
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Resource Destination</label>
                 <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-[#ff9900]">
                       <User className="w-full h-full" />
                    </div>
                    <select 
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded text-[11px] font-bold appearance-none focus:ring-1 focus:ring-[#ff9900] outline-none transition-all group-hover:border-slate-500"
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                    >
                       <option value="">Select Target Destination...</option>
                       {customers.map(c => (
                         <option key={c.id} value={c.id}>{c.name} [lk-u-{c.id.substring(0, 8)}]</option>
                       ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                 </div>
              </div>

              {/* Protocol Method */}
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Transaction Protocol</label>
                 <div className="grid grid-cols-3 gap-1">
                   {[
                     { id: "Cash", icon: Banknote },
                     { id: "Card", icon: CreditCard },
                     { id: "Bank Transfer", icon: Building2 }
                   ].map((m) => (
                     <button
                       key={m.id}
                       onClick={() => setPaymentMethod(m.id as any)}
                       className={cn(
                         "flex items-center gap-2 p-2 rounded border text-[9px] font-black uppercase tracking-tighter transition-all",
                         paymentMethod === m.id 
                           ? "border-[#ff9900] bg-[#ff9900]/10 text-[#ff9900] shadow-sm" 
                           : "border-border text-muted-foreground hover:bg-muted"
                       )}
                     >
                       <m.icon className="w-3 h-3" /> {m.id}
                     </button>
                   ))}
                 </div>
              </div>

              {/* Final Summary */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                 <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-80">
                    <span>Provisioning Quota</span>
                    <span>Rs. {total.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-[#10b981]">Aggregate Total</span>
                    <span className="text-2xl font-black text-foreground">Rs. {total.toLocaleString()}</span>
                 </div>
                 
                 <div className="flex items-start gap-2 bg-blue-600/10 p-2 rounded border border-blue-600/30 mb-2">
                    <Info className="w-3.5 h-3.5 text-[#3b82f6] shrink-0 mt-0.5" />
                    <p className="text-[9px] text-[#3b82f6] font-bold leading-normal">
                      Confirming this transaction will decrease inventory resources and create a cloud-billing invoice for the destination resource.
                    </p>
                 </div>

                 <button 
                    disabled={!selectedCustomerId || cart.length === 0 || isProcessing}
                    onClick={handleCheckout}
                    className={cn(
                      "w-full py-3.5 rounded-md flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl",
                      !selectedCustomerId || cart.length === 0 || isProcessing
                        ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                        : "bg-[#ff9900] text-[#15191d] hover:bg-[#ec7211] shadow-[#ff9900]/20 hover:scale-[1.01] active:scale-[0.99]"
                    )}
                  >
                    {isProcessing ? "INITIALIZING..." : (
                      <>
                        Commit Transaction <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
