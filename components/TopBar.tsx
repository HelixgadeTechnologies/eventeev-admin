'use client';

import { Search, Bell, Command } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-64 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-12 pr-16 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-slate-50 transition-all text-sm text-slate-900"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-[10px] text-slate-400 font-bold">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
        </button>

        <div className="h-6 w-[1px] bg-slate-200 mx-2" />

        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Alex Jordan</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Super Admin</p>
          </div>
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 group-hover:border-blue-500/50 transition-all">
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-blue-600 font-bold text-sm">
              AJ
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
