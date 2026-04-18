'use client';

import Image from "next/image";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log("Login attempt:", { email, password, rememberMe });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Full-screen Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-bg-v2.png"
          alt="Event Network Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Subtle overlay to ensure card contrast if needed */}
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]"></div>
      </div>

      {/* Content Layer: Right Aligned Card */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center lg:justify-end lg:pr-[120px] p-6 lg:p-12">
        <div className="w-full max-w-[480px] rounded-[32px] bg-white px-10 py-16 shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-right-12 duration-1000">
          {/* Brand Logo */}
          <div className="mb-14">
            <Image
              src="/logo-black.svg"
              alt="Eventeev"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>

          {/* Heading */}
          <div className="mb-14">
            <h1 className="mb-4 text-[42px] font-bold tracking-tight text-[#0f172a] font-feather leading-[1.05]">
              Sign in to Eventeev.
            </h1>
            <p className="text-[16px] text-[#64748b] font-medium">
              Enterprise administration and event management portal.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Email Field */}
            <div className="space-y-4">
              <label
                htmlFor="email"
                className="block text-[14px] font-bold text-[#334155] ml-0.5"
              >
                Email
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-5 py-[15px] text-[15px] text-[#0f172a] placeholder-[#94a3b8] transition-all focus:border-[#ea580c] focus:ring-4 focus:ring-[#ea580c]/5 outline-none font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between px-1">
                <label
                  htmlFor="password"
                  className="block text-[14px] font-bold text-[#334155] ml-0.5"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-[13px] font-bold text-[#ea580c] hover:text-[#c2410c] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-5 py-[15px] pr-12 text-[15px] text-[#0f172a] placeholder-[#94a3b8] transition-all focus:border-[#ea580c] focus:ring-4 focus:ring-[#ea580c]/5 outline-none font-medium shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Keep me signed in */}
            <div className="flex items-center gap-2 px-1 pt-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#cbd5e1] text-[#ea580c] focus:ring-[#ea580c]/20 accent-[#ea580c]"
              />
              <label htmlFor="remember" className="text-[13px] font-bold text-[#64748b] cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* Sign In Button */}
            <div className="pt-10">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#ea580c] py-[16px] text-[16px] font-bold text-white transition-all hover:bg-[#c2410c] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 shadow-xl shadow-[#ea580c]/20"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          {/* Footer Info */}
          <div className="mt-16 text-center lg:text-left">
            <p className="text-[12px] font-medium text-[#94a3b8]">
              &copy; {new Date().getFullYear()} Eventeev. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
