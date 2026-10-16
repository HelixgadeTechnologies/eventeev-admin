'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Trash2, 
  Calendar as CalendarIcon,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Event {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  thumbnailImage?: string;
  image_url?: string;
  status?: string;
  tickets_sold?: number;
  total_revenue?: number;
  owner?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | string;
}

export default function EventManagementPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Interactive filters
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTab, setSelectedTab] = useState<'All' | 'Active' | 'Completed' | 'Draft'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [eventsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let ignore = false;
    const fetchEvents = async () => {
      try {
        const data = await api.get<{ events: Event[] }>('/admin/events');
        if (!ignore) {
          setEvents(data.events || []);
        }
      } catch (err: unknown) {
        console.error("Fetch Events Error:", err);
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Failed to load events.";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This action will remove all ticket associations.")) return;
    
    try {
      setActionLoading(id);
      await api.delete(`/admin/events/${id}`);
      setSuccess("Event successfully removed from the registry.");
      setEvents(prev => prev.filter(e => (e._id || e.id) !== id));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete event.";
      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString?: string, timeString?: string) => {
    if (!dateString) return 'TBA';
    try {
      const d = new Date(dateString);
      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return timeString ? `${formattedDate} • ${timeString}` : formattedDate;
    } catch {
      return timeString ? `${dateString} • ${timeString}` : dateString;
    }
  };

  const getCategoryStyles = (category?: string) => {
    const cat = (category || 'conference').toLowerCase();
    if (cat.includes('tech') || cat.includes('software')) {
      return 'bg-blue-50 text-blue-700 border-blue-200/70';
    } else if (cat.includes('conference')) {
      return 'bg-orange-50 text-orange-700 border-orange-200/70';
    } else if (cat.includes('watch') || cat.includes('food')) {
      return 'bg-purple-50 text-purple-700 border-purple-200/70';
    }
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
  };

  // Distinct category list
  const categories = ['All Categories', ...Array.from(new Set(events.map(e => e.category).filter(Boolean) as string[]))];

  // Tab counts
  const allCount = events.length;
  const activeCount = events.filter(e => ['published', 'ongoing', 'active'].includes((e.status || '').toLowerCase())).length;
  const completedCount = events.filter(e => ['completed', 'past'].includes((e.status || '').toLowerCase())).length;
  const draftCount = events.filter(e => (e.status || '').toLowerCase() === 'draft').length;

  // Filtered events
  const filteredEvents = events.filter(event => {
    const title = event.title || "";
    const location = event.location || "";
    let ownerName = "";
    if (typeof event.owner === 'object' && event.owner !== null) {
      ownerName = `${event.owner.firstName || ''} ${event.owner.lastName || ''}`;
    }
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All Categories' || event.category === selectedCategory;

    const status = (event.status || '').toLowerCase();
    let matchesTab = true;
    if (selectedTab === 'Active') {
      matchesTab = ['published', 'ongoing', 'active'].includes(status);
    } else if (selectedTab === 'Completed') {
      matchesTab = ['completed', 'past'].includes(status);
    } else if (selectedTab === 'Draft') {
      matchesTab = status === 'draft';
    }

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Pagination
  const totalFilteredCount = filteredEvents.length;
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(totalFilteredCount / eventsPerPage) || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Alert */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-8 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-xs ${
              error ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{error || success}</span>
            <button onClick={() => { setError(null); setSuccess(null); }} className="ml-3 hover:opacity-70">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar: Tabs, Search, Category Filter, and View Mode */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Status Tab Selectors */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-fit flex-wrap gap-1">
          {[
            { id: 'All', label: 'All Events', count: allCount },
            { id: 'Active', label: 'Live Now', count: activeCount },
            { id: 'Completed', label: 'Completed', count: completedCount },
            { id: 'Draft', label: 'Drafts', count: draftCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setSelectedTab(tab.id as 'All' | 'Active' | 'Completed' | 'Draft'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTab === tab.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                selectedTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] max-w-xs flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              type="text"
              placeholder="Search event title, venue..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40 transition-all font-medium"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="appearance-none bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-3.5 pr-8 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:ring-3 focus:ring-orange-500/10 transition-all"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
          </div>

          {/* Grid / List Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Events Grid or List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <Loader2 className="animate-spin text-orange-500 mb-3" size={36} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Event Registry...</p>
        </div>
      ) : currentEvents.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map((event) => {
              const eventId = event._id || event.id || '';
              const ownerName = typeof event.owner === 'object' && event.owner !== null
                ? `${event.owner.firstName || ''} ${event.owner.lastName || ''}`.trim()
                : 'Eventeev Organizer';
              const imageUrl = event.thumbnailImage || event.image_url;

              return (
                <div
                  key={eventId}
                  className="bg-white rounded-3xl border border-slate-200/80 hover:border-orange-500/30 shadow-xs hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Thumbnail Banner */}
                  <div 
                    onClick={() => router.push(`/events/${eventId}`)}
                    className="relative h-44 w-full bg-slate-100 cursor-pointer overflow-hidden"
                  >
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 flex items-center justify-center text-white font-black text-lg">
                        Eventeev
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Badges on Banner */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${getCategoryStyles(event.category)}`}>
                        {event.category || 'Conference'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                        {event.status || 'Active'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 text-white text-[11px] font-semibold flex items-center gap-1.5 drop-shadow-sm">
                      <CalendarIcon size={12} />
                      <span>{formatDate(event.startDate, event.startTime)}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => router.push(`/events/${eventId}`)}
                        className="text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer tracking-tight"
                      >
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {event.description || "Official gathering and community event organized on the Eventeev platform."}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={13} className="text-orange-500 shrink-0" />
                        <span className="truncate">{event.location || 'Online / Virtual'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Organized by <strong className="text-slate-700">{ownerName}</strong></span>
                        <span className="font-bold text-orange-600">{event.type || 'Virtual'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => router.push(`/events/${eventId}`)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Eye size={13} />
                      <span>Event Details</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(eventId)}
                      disabled={actionLoading === eventId}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                      title="Delete event"
                    >
                      {actionLoading === eventId ? <Loader2 size={14} className="animate-spin text-rose-500" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Mode */
          <div className="space-y-3">
            {currentEvents.map((event) => {
              const eventId = event._id || event.id || '';
              const ownerName = typeof event.owner === 'object' && event.owner !== null
                ? `${event.owner.firstName || ''} ${event.owner.lastName || ''}`.trim()
                : 'Eventeev Organizer';
              const imageUrl = event.thumbnailImage || event.image_url;

              return (
                <div
                  key={eventId}
                  className="bg-white p-4 rounded-3xl border border-slate-200/80 hover:border-orange-500/30 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div 
                      onClick={() => router.push(`/events/${eventId}`)}
                      className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 cursor-pointer relative"
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">EV</div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${getCategoryStyles(event.category)}`}>
                          {event.category || 'Conference'}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-600">
                          {event.status || 'Active'}
                        </span>
                      </div>
                      <h3 
                        onClick={() => router.push(`/events/${eventId}`)}
                        className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors truncate cursor-pointer"
                      >
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{formatDate(event.startDate)}</span>
                        <span>•</span>
                        <span className="truncate max-w-xs">{event.location || 'Virtual'}</span>
                        <span>•</span>
                        <span>By {ownerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => router.push(`/events/${eventId}`)}
                      className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye size={13} />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(eventId)}
                      disabled={actionLoading === eventId}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                    >
                      {actionLoading === eventId ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center p-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200 mb-3">
            <CalendarIcon size={24} />
          </div>
          <h4 className="text-base font-bold text-slate-800">No events found matching your filter</h4>
          <p className="text-xs text-slate-400 mt-1">Try switching to &quot;All Events&quot; or clearing your search term.</p>
          <button
            onClick={() => { setSelectedTab('All'); setSearchTerm(''); setSelectedCategory('All Categories'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition-colors cursor-pointer shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && filteredEvents.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
          <p className="text-xs font-bold text-slate-400">
            Showing <strong className="text-slate-700">{indexOfFirstEvent + 1}</strong> to <strong className="text-slate-700">{Math.min(indexOfLastEvent, totalFilteredCount)}</strong> of <strong className="text-slate-700">{totalFilteredCount}</strong> events
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  page === currentPage
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
