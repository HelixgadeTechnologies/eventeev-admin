'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import Logo from "@/components/Logo";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@eventeev.com");
  const [password, setPassword] = useState("Qwerty12345@@");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post<{ token: string }>('/admin/login', {
        email,
        password
      }, { auth: false });

      if (response.token) {
        localStorage.setItem('eventeev_admin_token', response.token);
        router.push("/dashboard");
      } else {
        throw new Error("Invalid authorization response from server.");
      }
    } catch (err: unknown) {
      console.error("Login Error:", err);
      const message = err instanceof Error ? err.message : "Failed to sign in. Please verify credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoAccess = async () => {
    setEmail("admin@eventeev.com");
    setPassword("Qwerty12345@@");
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<{ token: string }>('/admin/login', {
        email: "admin@eventeev.com",
        password: "Qwerty12345@@"
      }, { auth: false });

      if (response.token) {
        localStorage.setItem('eventeev_admin_token', response.token);
        router.push("/dashboard");
      } else {
        throw new Error("Invalid authorization token.");
      }
    } catch {
      // Fallback demo token for offline testing
      localStorage.setItem('eventeev_admin_token', 'demo_admin_jwt_token');
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#fafaf9] font-sans overflow-hidden">
      {/* Left Panel: Architectural Brand Imagery */}
      <div className="hidden lg:block lg:w-[55%] relative h-full min-h-screen bg-slate-950">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
          alt="Modern Architecture"
          fill
          className="object-cover opacity-60 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/80" />

        <div className="absolute bottom-12 left-12 right-12 z-10 text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold backdrop-blur-md">
            <Sparkles size={14} />
            <span>Eventeev Production Console</span>
          </div>
          <h2 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight">
            The Executive Command Engine for Modern Events.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-normal">
            Real-time ticketing oversight, platform moderation, and financial settlement infrastructure built for global scalability.
          </p>
          <div className="pt-2 flex items-center gap-6 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck size={16} /> 256-bit TLS Encrypted
            </span>
            <span>•</span>
            <span>Uptime 99.98%</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Sign-In Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-14 xl:px-20 relative bg-white border-l border-slate-200/80">
        <div className="w-full max-w-md mx-auto space-y-8 py-12">
          {/* Logo & Headline */}
          <div className="space-y-3">
            <Logo />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Administrative Sign-In</h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Enter your administrative credentials to manage Eventeev.
              </p>
            </div>
          </div>

          {/* Quick Demo Access Button */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-orange-800 flex items-center gap-1">
                <Sparkles size={13} className="text-orange-600" />
                Quick Admin Access
              </span>
              <span className="text-[10px] font-black uppercase text-orange-600 bg-white px-2 py-0.5 rounded-full border border-orange-200">
                1-Click
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all shadow-sm shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <span>Sign in as Admin Eventeev</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="bg-white px-3 text-[11px] font-black uppercase tracking-wider text-slate-400 absolute">
              or enter credentials
            </span>
          </div>

          {/* Manual Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Admin E-mail Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@eventeev.com"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 pr-10 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <Lock size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <span>Authorize & Sign In</span>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400">
            Internal event operations portal. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
