'use client';

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("alex.jordan@gmail.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log("Login attempt:", { email, password });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] flex items-center justify-center p-4 lg:p-10 font-sans">
      <div className="w-full max-w-[1280px] h-full min-h-[700px] lg:h-[840px] bg-white rounded-[32px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col lg:flex-row">
        
        {/* Left Panel: Hero Image & Testimonial */}
        <div className="relative w-full lg:w-[42%] h-[350px] lg:h-auto overflow-hidden">
          <Image
            src="/login-hero.png"
            alt="Workspace Hero"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle gradient overlay to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-b lg:from-black/40 lg:to-black/10" />
          
          {/* Brand Logo Overlay */}
          <div className="absolute top-8 left-8 lg:top-12 lg:left-12">
             <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                  <Image src="/logo-white.svg" alt="Eventeev" width={40} height={40} className="w-8 h-8" />
                </div>
                <span className="text-white font-bold text-2xl tracking-tight">Eventeev</span>
             </div>
          </div>

          {/* Testimonial Overlay */}
          <div className="absolute bottom-8 left-8 right-8 lg:bottom-16 lg:left-16 lg:right-16 text-white animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-[28px] lg:text-[40px] font-bold leading-[1.2] mb-6 font-feather">
              “Simply all the tools that my team and I need.”
            </h2>
            <div className="space-y-1">
              <p className="font-bold text-lg lg:text-xl">Karen Yue</p>
              <p className="text-white/70 font-medium text-sm lg:text-base">Director of Digital Marketing Technology</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-24 bg-white">
          <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-right-8 duration-1000">
            {/* Heading */}
            <div className="text-center mb-12">
              <h1 className="text-[32px] lg:text-[45px] font-bold text-[#0f172a] mb-4 font-feather tracking-tight">
                Welcome back, Boss
              </h1>
              <p className="text-[#64748b] text-[15px] lg:text-[17px] max-w-[360px] mx-auto font-medium leading-relaxed">
                Access the most powerful enterprise event management network.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative group">
                <div className="absolute top-2.5 left-5 text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest">
                  Email
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[54px] bg-white border border-[#e2e8f0] rounded-xl px-5 pt-5 pb-1 text-[#0f172a] font-medium outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-600 transition-all text-sm shadow-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="absolute top-2.5 left-5 text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest">
                  Password
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[54px] bg-white border border-[#e2e8f0] rounded-xl px-5 pt-5 pb-1 text-[#0f172a] font-medium outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-600 transition-all text-sm shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Extras: Forgot Only */}
              <div className="flex flex-col pt-1">
                <a href="#" className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors w-fit ml-1">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[52px] bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-violet-600/20 flex items-center justify-center gap-2 text-base"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  ) : (
                    "Log in"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
