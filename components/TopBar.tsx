'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Command, 
  Menu, 
  LogOut, 
  Settings, 
  ExternalLink, 
  ChevronDown,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Executive Dashboard', subtitle: 'Platform overview, live performance & registry metrics' },
  '/events': { title: 'Events Management', subtitle: 'Review, moderate, and track event registry' },
  '/users': { title: 'User Directory', subtitle: 'Moderation, platform roles & access control' },
  '/waitlist': { title: 'Waitlist Approvals', subtitle: 'Review pending applications and grant platform access' },
  '/revenue': { title: 'Revenue & Finance', subtitle: 'Gross merchandise volume, ticketing & earnings breakdown' },
  '/games': { title: 'Interactive Games', subtitle: 'Quizzes, live engagement & attendee challenges' },
  '/settings': { title: 'Platform Settings', subtitle: 'System preferences, security & administrator configuration' },
};

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentInfo = routeTitles[pathname] || {
    title: pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ') || 'Admin Portal',
    subtitle: 'Eventeev administrative console'
  };

  const handleLogout = () => {
    localStorage.removeItem('eventeev_admin_token');
    router.push('/login');
  };

  const notifications = [
    { id: 1, title: '11 Waitlist Applications Pending', desc: 'New applicants from Nigeria, Indonesia, and USA awaiting review.', time: '10m ago' },
    { id: 2, title: 'Recent Ticket Verification', desc: '12 attendee tickets checked in successfully.', time: '1h ago' },
    { id: 3, title: 'System Backup Complete', desc: 'All database snapshots synchronized to secure storage.', time: '4h ago' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-xs mb-6 rounded-2xl">
      {/* Left: Mobile Toggle + Breadcrumbs & Page Heading */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/dashboard" className="hover:text-slate-600 transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-orange-600 font-bold">{currentInfo.title}</span>
          </div>
          <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Right: Status Pill, Notifications, Quick Action, Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Live Systems Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live • Systems Normal</span>
        </div>

        {/* Global Quick Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search console..."
            className="w-full bg-slate-100/80 border border-transparent hover:border-slate-200 focus:border-orange-500/40 rounded-xl py-2 pl-9 pr-10 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-400 font-bold">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Activity & Alerts</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-700">2 New</span>
                </div>
                <button 
                  onClick={() => router.push('/waitlist')} 
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                >
                  View Waitlist
                </button>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <Link href="/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-900">
                  Dismiss all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Profile Card & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pl-2.5 rounded-2xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Admin Eventeev</p>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Super Admin</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-sm shadow-orange-500/30 ring-2 ring-orange-100">
              AE
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">Admin Eventeev</p>
                <p className="text-[11px] text-slate-400 truncate">admin@eventeev.com</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Full System Privileges
                </div>
              </div>

              <div className="space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings size={15} className="text-slate-400" />
                  Platform Settings
                </Link>
                <a
                  href="https://eventeev.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <ExternalLink size={15} className="text-slate-400" />
                    Visit Live Site
                  </span>
                  <ArrowUpRight size={12} className="text-slate-400" />
                </a>
              </div>

              <div className="pt-1 mt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
