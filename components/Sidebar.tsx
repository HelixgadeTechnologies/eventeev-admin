'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  BarChart3, 
  Settings,
  LogOut,
  Gamepad2,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Logo from './Logo';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Calendar, label: 'Events', href: '/events', badge: '9' },
  { icon: Users, label: 'Users', href: '/users', badge: '12' },
  { icon: Clock, label: 'Waitlist', href: '/waitlist', badge: '11', badgeColor: 'bg-orange-500 text-white' },
  { icon: BarChart3, label: 'Revenue', href: '/revenue' },
  { icon: Gamepad2, label: 'Games', href: '/games' },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('eventeev_admin_token');
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside 
        className={cn(
          "fixed top-4 bottom-4 left-4 w-72 bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 z-50 flex flex-col justify-between transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="p-6 pb-4 flex items-center justify-between">
            <Logo />
            {onClose && (
              <button 
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick Subtitle / Badge */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Production Console • v1.2</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            <p className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Platform Core
            </p>

            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-200 group text-sm font-semibold relative",
                    isActive 
                      ? "text-orange-600 bg-orange-50/90 shadow-xs border border-orange-200/60" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-xl transition-colors",
                      isActive 
                        ? "text-orange-600 bg-white shadow-xs" 
                        : "text-slate-400 group-hover:text-slate-700 bg-slate-100/60 group-hover:bg-slate-200/50"
                    )}>
                      <Icon size={17} />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full transition-transform group-hover:scale-105",
                      item.badgeColor || (isActive ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600")
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 mt-3 border-t border-slate-100">
              <p className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Administration
              </p>
              
              <Link
                href="/settings"
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-200 group text-sm font-semibold",
                  pathname === '/settings'
                    ? "text-orange-600 bg-orange-50/90 shadow-xs border border-orange-200/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-1.5 rounded-xl transition-colors",
                    pathname === '/settings'
                      ? "text-orange-600 bg-white shadow-xs" 
                      : "text-slate-400 group-hover:text-slate-700 bg-slate-100/60"
                  )}>
                    <Settings size={17} />
                  </div>
                  <span>Settings</span>
                </div>
              </Link>
            </div>
          </nav>
        </div>

        {/* Bottom Profile & Sign Out Widget */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              AE
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">Admin Eventeev</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">admin@eventeev.com</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
