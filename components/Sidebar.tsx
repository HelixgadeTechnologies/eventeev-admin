'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  BarChart3, 
  Settings,
  LogOut,
  Search,
  ChevronDown,
  Gamepad2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Logo from './Logo';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Users', href: '/users', hasDropdown: true },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: Clock, label: 'Waitlist', href: '/waitlist' },
  { icon: BarChart3, label: 'Revenue', href: '/revenue' },
  { icon: Gamepad2, label: 'Games', href: '/games' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-72 bg-white rounded-[2.5rem] border border-slate-100 z-50 flex flex-col shadow-sm">
      <div className="p-8 pb-4">
        <Logo className="mb-8" />
        
        <div className="relative group mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/10 transition-all text-sm text-slate-900"
          />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "text-primary bg-orange-50 font-bold" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={cn(isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.hasDropdown && <ChevronDown size={14} className="text-slate-400" />}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div className="w-full h-full flex items-center justify-center bg-orange-100 text-primary font-bold text-sm">
              AJ
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Alex Jordan</p>
            <span className="bg-orange-100 text-primary text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Admin</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all text-sm font-medium">
            <Settings size={18} />
            Settings
          </Link>
          <button 
            onClick={() => window.location.href = '/login'}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
