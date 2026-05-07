'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Trash2, 
  ExternalLink, 
  DollarSign,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  MapPin,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Event {
  id: number | string;
  title: string;
  organizer_name?: string;
  owner?: string;
  start_date?: string;
  date?: string;
  location?: string;
  tickets_sold?: number;
  total_revenue?: number;
  revenue?: string | number;
  image_url?: string;
}

export default function EventManagementPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<Event[]>('/events');
        setEvents(data);
      } catch (err: any) {
        console.error("Fetch Events Error:", err);
        setError(err.message || "Failed to load events.");
        if (err.message.includes('401')) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const filteredEvents = events.filter(event => {
    const title = event.title || "";
    const owner = event.organizer_name || event.owner || "";
    const location = event.location || "";
    
    return title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
           location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getGradient = (id: number | string) => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-orange-400 to-red-500',
      'from-emerald-400 to-cyan-500',
      'from-rose-400 to-red-600',
      'from-amber-400 to-orange-500'
    ];
    const index = typeof id === 'number' ? id % gradients.length : id.length % gradients.length;
    return `bg-gradient-to-br ${gradients[index]}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Event Management</h1>
          <p className="text-slate-500 font-medium">Oversee all events created on the platform.</p>
        </div>
        <div className="flex items-center bg-white border border-slate-100 p-1 rounded-xl shadow-sm">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-slate-900'}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-slate-900'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search by event title, owner, or location..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm text-slate-900 shadow-sm"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="flex-1">{error}</span>
          <button onClick={() => window.location.reload()} className="underline underline-offset-4">Retry</button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary mb-4" size={48} />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Events Data...</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                className={`bg-white rounded-[2rem] overflow-hidden group border border-slate-100 hover:border-orange-500/30 transition-all duration-300 shadow-sm hover:shadow-xl ${viewMode === 'list' ? 'flex flex-row items-center gap-6 p-4' : ''}`}
              >
                <div className={`${viewMode === 'grid' ? 'h-48 w-full' : 'h-32 w-48 shrink-0'} ${event.image_url ? '' : getGradient(event.id)} relative overflow-hidden`}>
                  {event.image_url ? (
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-sm">
                    Live
                  </div>
                </div>

                <div className={`p-6 ${viewMode === 'list' ? 'flex-1 p-0' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{event.title}</h3>
                    {viewMode === 'grid' && (
                      <div className="text-primary hover:bg-orange-50 p-2 rounded-xl transition-all cursor-pointer border border-transparent hover:border-orange-100">
                        <ExternalLink size={18} />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-4 font-medium">By <span className="text-slate-900 font-bold">{event.organizer_name || event.owner || 'Unknown'}</span></p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <CalendarIcon size={14} className="text-primary" />
                      {event.start_date || event.date || 'TBA'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <MapPin size={14} className="text-primary" />
                      {event.location || 'Online'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tickets</p>
                      <div className="flex items-center gap-2 text-slate-900 font-black">
                        <UsersIcon size={16} className="text-blue-500" />
                        {event.tickets_sold || 0}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                      <div className="flex items-center gap-2 text-green-600 font-black">
                        <DollarSign size={16} />
                        {typeof event.total_revenue === 'number' ? `$${event.total_revenue.toLocaleString()}` : (event.revenue || '$0')}
                      </div>
                    </div>
                  </div>

                  <div className={`mt-6 flex items-center gap-3 ${viewMode === 'list' ? 'justify-end' : ''}`}>
                    <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-all text-xs border border-slate-100">
                      Details
                    </button>
                    <button className="flex-1 bg-orange-50 hover:bg-orange-100 text-primary font-bold py-3 rounded-xl transition-all text-xs border border-orange-100">
                      Manage
                    </button>
                    <button className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-bold text-lg">No events found matching your search.</p>
              <button onClick={() => setSearchTerm('')} className="mt-4 text-primary font-bold hover:underline">Clear search</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
