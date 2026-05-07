'use client';

import { useState } from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Trash2, 
  ExternalLink, 
  DollarSign,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

const events = [
  { 
    id: 1, 
    title: 'Global Tech Summit 2024', 
    owner: 'Google Developers', 
    date: 'May 15, 2024', 
    location: 'San Francisco, CA',
    ticketsSold: 1250, 
    revenue: '$125,000',
    image: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  },
  { 
    id: 2, 
    title: 'Neon Nights Music Festival', 
    owner: 'Electric Vibes Ent.', 
    date: 'June 22, 2024', 
    location: 'Miami, FL',
    ticketsSold: 5000, 
    revenue: '$450,000',
    image: 'bg-gradient-to-br from-purple-500 to-pink-600'
  },
  { 
    id: 3, 
    title: 'Modern Art Expo', 
    owner: 'Lumina Gallery', 
    date: 'July 10, 2024', 
    location: 'New York, NY',
    ticketsSold: 840, 
    revenue: '$42,000',
    image: 'bg-gradient-to-br from-orange-400 to-red-500'
  },
  { 
    id: 4, 
    title: 'Wellness & Yoga Retreat', 
    owner: 'ZenFlow Collective', 
    date: 'August 05, 2024', 
    location: 'Bali, Indonesia',
    ticketsSold: 120, 
    revenue: '$60,000',
    image: 'bg-gradient-to-br from-emerald-400 to-cyan-500'
  },
];

export default function EventManagementPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Event Management</h1>
          <p className="text-text-muted">Oversee all events created on the platform.</p>
        </div>
        <div className="flex items-center glass p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search by event title, owner, or location..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm text-white"
        />
      </div>

      {/* Events Grid/List */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
        {events.map((event) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8 }}
            className={`bg-white rounded-[2rem] overflow-hidden group border border-slate-200 hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl ${viewMode === 'list' ? 'flex flex-row items-center gap-6 p-4' : ''}`}
          >
            <div className={`${viewMode === 'grid' ? 'h-48 w-full' : 'h-32 w-48 shrink-0'} ${event.image} relative`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                Featured
              </div>
            </div>

            <div className={`p-6 ${viewMode === 'list' ? 'flex-1 p-0' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{event.title}</h3>
                {viewMode === 'grid' && (
                  <div className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-all cursor-pointer">
                    <ExternalLink size={18} />
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-4 font-medium">By <span className="text-slate-900">{event.owner}</span></p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarIcon size={14} className="text-blue-600" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin size={14} className="text-blue-600" />
                  {event.location}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tickets Sold</p>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <UsersIcon size={16} className="text-blue-600" />
                    {event.ticketsSold}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <DollarSign size={16} />
                    {event.revenue}
                  </div>
                </div>
              </div>

              <div className={`mt-6 flex items-center gap-3 ${viewMode === 'list' ? 'justify-end' : ''}`}>
                <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl transition-all text-xs border border-slate-200">
                  View Details
                </button>
                <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2.5 rounded-xl transition-all text-xs border border-blue-100">
                  Revenue
                </button>
                <button className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
