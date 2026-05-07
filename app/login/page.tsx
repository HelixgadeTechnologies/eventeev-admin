'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
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
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      {/* Left Panel: Architectural Image */}
      <div className="hidden lg:block lg:w-[60%] relative h-full">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
          alt="Modern Architecture"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-[40%] flex flex-col relative bg-white">
        {/* Top Gear Icon */}
        <div className="absolute top-6 right-6 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
          <Settings size={20} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 md:px-20 lg:px-16 xl:px-24">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="flex flex-col items-center mb-10">
              <Logo className="mb-6 scale-125" />
              <h1 className="text-2xl font-bold text-slate-800">Sign in</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-slate-100/80 border-none rounded-xl px-5 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-slate-100 transition-all text-sm font-medium"
                  placeholder="E-mail Address *"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-slate-100/80 border-none rounded-xl px-5 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-slate-100 transition-all text-sm font-medium"
                  placeholder="Password *"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold animate-shake">
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-blue-600/20 flex items-center justify-center text-sm"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Don&apos;t have an account? Sign Up!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
