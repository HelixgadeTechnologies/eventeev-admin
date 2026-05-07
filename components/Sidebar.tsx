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
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: Clock, label: 'Waitlist', href: '/waitlist' },
  { icon: BarChart3, label: 'Revenue', href: '/revenue' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-border z-50 flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2 rounded-xl">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <span className="text-primary font-black text-xs">E</span>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Eventeev</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                  : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-primary" : "group-hover:text-white")} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border">
        <button 
          onClick={() => window.location.href = '/login'}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
