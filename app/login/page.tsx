'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@eventeev.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-bg.png"
          alt="Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* Language Switcher (Top Right) */}
      <div className="absolute top-8 right-8 z-20">
        <button className="glass px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10">
          <Globe size={16} />
          <span>English</span>
          <ArrowRight size={14} className="rotate-90" />
        </button>
      </div>

      <div className="z-10 w-full max-w-[500px] px-6 py-12 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2 scale-110">
          <div className="bg-[#ea580c] p-2 rounded-lg">
             <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                <span className="text-[#ea580c] font-black text-[10px]">E</span>
             </div>
          </div>
          <span className="text-3xl font-extrabold text-white tracking-tight">Eventeev</span>
        </div>

        {/* Main Card */}
        <div className="glass w-full p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Sign in</h1>
            <p className="text-text-muted text-sm">Enter your credentials to access your account</p>
          </div>

          {/* Social Login */}
          <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 px-4 flex items-center justify-center gap-3 transition-all mb-6 group/social">
            <div className="w-5 h-5 relative grayscale group-hover/social:grayscale-0 transition-all">
              <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </div>
            <span className="text-sm font-bold text-white">Continue with Google</span>
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">OR</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                  placeholder="admin@eventeev.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group/check">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary transition-all" />
                <span className="text-xs text-text-muted group-hover/check:text-white transition-colors">Remember me for 30 days</span>
              </label>
              <a href="#" className="text-xs font-bold text-[#ea580c] hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ea580c] hover:bg-[#d94e0b] text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-[#ea580c]/20 flex items-center justify-center gap-3 text-sm group/btn"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Bottom Pill */}
        <div className="mt-8">
          <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium">
            <span className="text-slate-600">Don&apos;t have an account?</span>
            <Link href="#" className="text-[#ea580c] font-bold hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
