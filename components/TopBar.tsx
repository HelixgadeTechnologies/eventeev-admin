'use client';

import { Search, Bell, Command } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-64 h-20 glass border-b border-border z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-16 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm text-white"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-text-muted font-bold">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-white transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>

        <div className="h-8 w-[1px] bg-white/10 mx-2" />

        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Alex Jordan</p>
            <p className="text-xs text-text-muted">Super Admin</p>
          </div>
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-all">
            <div className="absolute inset-0 bg-gradient-primary opacity-20" />
            <div className="w-full h-full flex items-center justify-center bg-white/10 text-primary font-bold">
              AJ
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
