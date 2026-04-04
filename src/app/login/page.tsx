"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Cpu, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // In a real app, you'd call signInWithEmailAndPassword here
      // For this demo, we'll suggest using Google first or implement a simple mock
      throw new Error("Email login is currently being provisioned. Please use Google Authenticator.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#15191d] p-6 bg-pattern-cube">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        {/* AWS Header */}
        <div className="flex flex-col items-center mb-10 text-white">
          <div className="w-14 h-14 rounded-xl bg-[#ff9900] flex items-center justify-center text-[#15191d] mb-4 shadow-xl shadow-black/40">
            <Cpu className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Cloud Management Console</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Authorized Personal Only</p>
        </div>

        {/* Login Card */}
        <div className="console-card bg-white p-8 rounded shadow-2xl space-y-6">
          <div className="space-y-1">
             <h2 className="text-xl font-black text-slate-900">Sign in</h2>
             <p className="text-xs text-slate-500">Access CoolFlow cloud services for lk-west-1</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                <div className="relative group">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff9900] transition-colors" />
                   <input 
                      type="email" 
                      required
                      placeholder="admin@coolflow.lk"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-[#ff9900] transition-all text-slate-900"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                   />
                </div>
             </div>

             <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                   <button type="button" className="text-[10px] font-bold text-[#0073bb] hover:underline">Forgot IAM password?</button>
                </div>
                <div className="relative group">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff9900] transition-colors" />
                   <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-[#ff9900] transition-all text-slate-900"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                   />
                   <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                   >
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                </div>
             </div>

             {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 flex items-start gap-3 rounded animate-in fade-in slide-in-from-top-2">
                   <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                   <p className="text-[10px] font-bold text-red-600 leading-normal">{error}</p>
                </div>
             )}

             <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#ff9900] text-[#15191d] font-black text-xs uppercase tracking-widest rounded hover:bg-[#ec7211] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-98 disabled:opacity-50"
             >
                {isLoading ? "Authenticating..." : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
             </button>
          </form>

          <div className="relative py-2">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
             <div className="relative flex justify-center text-[10px] font-black uppercase"><span className="bg-white px-2 text-slate-400">or use single sign-on</span></div>
          </div>

          <button 
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-98"
          >
            <div className="w-4 h-4"><ChromeIcon /></div>
            Sign in with Google Directory
          </button>
        </div>

        <div className="mt-8 text-center text-[10px] font-bold text-slate-500">
           © 2026 CoolFlow Sri Lanka Cloud Infrastructure. <br/>All Rights Reserved.
        </div>
      </motion.div>
    </div>
  );
}

const ChromeIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);
