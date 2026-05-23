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
  AlertCircle,
  CheckCircle2,
  X,
  Settings,
  Bell,
  ChevronDown,
  SlidersHorizontal,
  Ticket as TicketIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Event {
  id?: number | string;
  _id?: number | string;
  title: string;
  description: string;
  organizer_name?: string;
  owner?: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  startDate?: string;
  start_date?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
  tickets_sold?: number;
  total_revenue?: number;
  revenue?: string | number;
  image_url?: string;
  status?: string;
}

export default function EventManagementPageRedesigned() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Custom interactive states matching the mockup UI
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedTab, setSelectedTab] = useState<'Active' | 'Draft' | 'Past'>('Active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [selectedTime, setSelectedTime] = useState('This Month');
  const [eventsPerPage, setEventsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<{ events: Event[] }>('/admin/events');
      setEvents(data.events || []);
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

  useEffect(() => {
    fetchEvents();
  }, [router]);

  const handleDeleteEvent = async (id: string | number) => {
    if (!confirm("Are you sure you want to force delete this event? This action cannot be undone.")) return;
    
    try {
      setActionLoading(`delete-${id}`);
      await api.delete(`/admin/events/${id}`);
      setSuccess("Event successfully removed from the platform.");
      fetchEvents();
    } catch (err: any) {
      setError(err.message || "Failed to delete event.");
    } finally {
      setActionLoading(null);
    }
  };

  // Helper: Format Date and Time
  const formatDate = (dateString: string | undefined, startTime: string | undefined) => {
    if (!dateString) return 'TBA';
    try {
      const d = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
      const dateFormatted = d.toLocaleDateString('en-US', options);
      return `${dateFormatted} — ${startTime || '12:00 PM'}`;
    } catch {
      return dateString;
    }
  };

  // Helper: Determine Category Badge Styles
  const getCategoryStyles = (category: string | undefined) => {
    const cat = (category || 'other').toLowerCase();
    if (cat.includes('outdoor') || cat.includes('sport') || cat.includes('watch party')) {
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100/50';
    } else if (cat.includes('food') || cat.includes('culinary')) {
      return 'bg-rose-50 text-rose-600 border border-rose-100/50';
    } else if (cat.includes('music') || cat.includes('concert')) {
      return 'bg-violet-50 text-violet-600 border border-violet-100/50';
    } else if (cat.includes('fashion') || cat.includes('runway') || cat.includes('conference')) {
      return 'bg-purple-50 text-purple-600 border border-purple-100/50';
    } else if (cat.includes('art') || cat.includes('design') || cat.includes('expo')) {
      return 'bg-pink-50 text-pink-600 border border-pink-100/50';
    } else if (cat.includes('tech') || cat.includes('software')) {
      return 'bg-blue-50 text-blue-600 border border-blue-100/50';
    }
    return 'bg-slate-50 text-slate-600 border border-slate-200/50';
  };

  // Helper: Calculate mock progress and price tags exactly matching the mockup theme
  const getProgressAndPrice = (event: Event) => {
    const totalCap = 150;
    const sold = event.tickets_sold || 0;
    const percent = Math.min(100, Math.round((sold / totalCap) * 100)) || 35;
    const left = Math.max(0, totalCap - sold);
    
    // Assign clean mock pricing matching the mockup's aesthetic values ($20, $30, $40, $45, $60, $80)
    let price = '$40';
    const cat = (event.category || '').toLowerCase();
    if (cat.includes('outdoor')) price = '$40';
    else if (cat.includes('food')) price = '$45';
    else if (cat.includes('music')) price = '$60';
    else if (cat.includes('fashion')) price = '$30';
    else if (cat.includes('art')) price = '$20';
    else if (cat.includes('tech')) price = '$80';

    return { percent, left, price };
  };

  const getGradient = (id: number | string | undefined) => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-orange-400 to-red-500',
      'from-emerald-400 to-cyan-500',
      'from-rose-400 to-red-600',
      'from-amber-400 to-orange-500'
    ];
    if (id === undefined || id === null) return `bg-gradient-to-br ${gradients[0]}`;
    const index = typeof id === 'number' ? id % gradients.length : id.toString().length % gradients.length;
    return `bg-gradient-to-br ${gradients[index]}`;
  };

  // Extract Categories dynamically for the dropdown filter
  const categories = ['All Category', ...Array.from(new Set((events || []).map(e => e.category).filter(Boolean)))];

  // Filtering Logic
  const filteredEvents = (events || []).filter(event => {
    // 1. Search term filter
    const title = event.title || "";
    let ownerName = "";
    if (typeof event.owner === 'object' && event.owner !== null) {
      ownerName = `${event.owner.firstName || ''} ${event.owner.lastName || ''}`.trim();
    } else {
      ownerName = (event.organizer_name || event.owner || "").toString();
    }
    const location = event.location || "";
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          location.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Category filter
    const matchesCategory = selectedCategory === 'All Category' || event.category === selectedCategory;

    // 3. Status tab filter
    const status = (event.status || 'Published').toLowerCase();
    let matchesTab = false;
    if (selectedTab === 'Active') {
      matchesTab = status === 'published' || status === 'ongoing' || status === 'active';
    } else if (selectedTab === 'Draft') {
      matchesTab = status === 'draft';
    } else if (selectedTab === 'Past') {
      matchesTab = status === 'completed' || status === 'past';
    }

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Pagination calculations
  const totalFilteredCount = filteredEvents.length;
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(totalFilteredCount / eventsPerPage) || 1;

  // Counts for each tab
  const activeCount = events.filter(e => ['published', 'ongoing', 'active'].includes((e.status || 'Published').toLowerCase())).length;
  const draftCount = events.filter(e => (e.status || '').toLowerCase() === 'draft').length;
  const pastCount = events.filter(e => ['completed', 'past'].includes((e.status || '').toLowerCase())).length;

  return (
    <div className="space-y-6 animate-fade-in relative font-sans text-slate-800 pb-20">
      {/* Notifications Alert */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
            }`}
          >
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{error || success}</span>
            <button onClick={() => { setError(null); setSuccess(null); }} className="ml-4 hover:opacity-70">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar Matching Mockup Design */}
      <div className="flex items-center justify-between pb-4">
        {/* Left: Breadcrumbs & Page Header */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
            <span>Dashboard</span>
            <span className="text-[10px]">/</span>
            <span className="text-primary font-black">Events</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Events</h1>
        </div>

        {/* Right: Mockup Utilities (Alert, Settings, Profile Card) */}
        <div className="flex items-center gap-5">
          {/* Notifications */}
          <button className="relative w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center text-white hover:bg-slate-900 transition-all cursor-pointer shadow-md">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950" />
          </button>
          {/* Settings */}
          <button className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-all cursor-pointer">
            <Settings size={20} />
          </button>
          {/* Profile Card */}
          <div className="h-10 w-[1px] bg-slate-200 mx-1" />
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">Alex Jordan</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 text-primary border border-orange-200 flex items-center justify-center font-black text-sm group-hover:border-primary transition-all">
              AJ
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Search & Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        {/* Left: Tab selectors for Active, Draft, Past */}
        <div className="flex items-center bg-slate-50 border border-slate-100 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => { setSelectedTab('Active'); setCurrentPage(1); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer ${selectedTab === 'Active' ? 'bg-primary text-white shadow-lg shadow-orange-500/25' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Active <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${selectedTab === 'Active' ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-600'}`}>{activeCount}</span>
          </button>
          <button 
            onClick={() => { setSelectedTab('Draft'); setCurrentPage(1); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer ${selectedTab === 'Draft' ? 'bg-primary text-white shadow-lg shadow-orange-500/25' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Draft <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${selectedTab === 'Draft' ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-600'}`}>{draftCount}</span>
          </button>
          <button 
            onClick={() => { setSelectedTab('Past'); setCurrentPage(1); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer ${selectedTab === 'Past' ? 'bg-primary text-white shadow-lg shadow-orange-500/25' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Past <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${selectedTab === 'Past' ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-600'}`}>{pastCount}</span>
          </button>
        </div>

        {/* Right: Search, category filter, calendar filter, and view toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Pill Search */}
          <div className="relative flex-1 min-w-[200px] lg:max-w-xs group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search event, location, etc..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-100 rounded-full py-2.5 pl-11 pr-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 text-xs font-medium text-slate-800 transition-all shadow-inner"
            />
          </div>

          {/* Filter Trigger Box */}
          <button className="bg-slate-950 hover:bg-slate-900 p-2.5 rounded-xl text-white transition-all cursor-pointer shadow-md">
            <SlidersHorizontal size={16} />
          </button>

          {/* Category Dropdown */}
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="appearance-none bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-4 pr-10 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 text-xs font-bold text-slate-700 cursor-pointer transition-all shadow-sm"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat === 'All Category' ? 'All Category' : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative">
            <select 
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-4 pr-10 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 text-xs font-bold text-slate-700 cursor-pointer transition-all shadow-sm"
            >
              <option>This Month</option>
              <option>All Time</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>

          {/* View Mode Toggle Toggles */}
          <div className="flex items-center bg-slate-50 border border-slate-100 p-1 rounded-xl shadow-inner">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Redesigned Layout List/Grid Container */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
          <Loader2 className="animate-spin text-primary mb-4" size={48} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compiling Live Registry...</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
          {currentEvents.length > 0 ? (
            currentEvents.map((event) => {
              const { percent, left, price } = getProgressAndPrice(event);
              const ownerName = typeof event.owner === 'object' && event.owner !== null
                ? `${event.owner.firstName} ${event.owner.lastName}`
                : (event.organizer_name || event.owner || 'Platform Admin');

              return (
                <motion.div 
                  key={event.id || event._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}
                  className={`bg-white overflow-hidden group border border-slate-100 hover:border-primary/20 transition-all duration-300 shadow-sm ${
                    viewMode === 'list' 
                      ? 'flex flex-col lg:flex-row items-center justify-between p-5 rounded-[2rem] gap-6 w-full' 
                      : 'rounded-[2.5rem]'
                  }`}
                >
                  {/* Event Thumbnail */}
                  <div 
                    onClick={() => router.push(`/events/${event.id || event._id}`)}
                    className={`cursor-pointer ${
                      viewMode === 'list' ? 'h-36 w-56 shrink-0 rounded-2xl' : 'h-48 w-full'
                    } ${event.image_url ? '' : getGradient(event.id || event._id)} relative overflow-hidden`}
                  >
                    {event.image_url ? (
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    )}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[9px] font-black text-slate-800 uppercase tracking-widest shadow-sm">
                      Eventeev
                    </div>
                  </div>

                  {/* Redesigned Text & Description Columns */}
                  <div className={`flex-1 min-w-0 ${viewMode === 'list' ? '' : 'p-6 pb-2'}`}>
                    <div className="flex flex-col gap-1.5">
                      {/* Category Pill */}
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit shadow-sm ${getCategoryStyles(event.category)}`}>
                        {event.category || 'Event'}
                      </span>
                      {/* Title */}
                      <h3 
                        onClick={() => router.push(`/events/${event.id || event._id}`)}
                        className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1 cursor-pointer tracking-tight"
                      >
                        {event.title}
                      </h3>
                      {/* Description / Subtext Excerpt */}
                      <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed mb-1 pr-4">
                        {event.description || "Join this premium event organized on Eventeev. Manage tickets, details, and schedules instantly."}
                      </p>
                      {/* Owner subtag */}
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        BY <span className="text-slate-700 font-black">{ownerName}</span>
                      </span>
                    </div>
                  </div>

                  {/* Metadata Icons Stack (Vertical in list, horizontal in grid) */}
                  <div className={`flex flex-col gap-2.5 min-w-[220px] ${viewMode === 'list' ? '' : 'px-6 pb-4'}`}>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <div className="w-7 h-7 rounded-lg bg-orange-50/50 flex items-center justify-center text-primary">
                        <MapPin size={14} />
                      </div>
                      <span className="truncate max-w-[200px]" title={event.location}>{event.location || 'Online / Virtual'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <div className="w-7 h-7 rounded-lg bg-orange-50/50 flex items-center justify-center text-primary">
                        <CalendarIcon size={14} />
                      </div>
                      <span>{formatDate(event.startDate || event.start_date || event.date, event.startTime)}</span>
                    </div>
                  </div>

                  {/* Check-in Ticket Sold Progress Bar Column */}
                  <div className={`flex flex-col gap-1.5 w-40 shrink-0 ${viewMode === 'list' ? '' : 'px-6 pb-4'}`}>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>{percent}% Ticket Sold</span>
                    </div>
                  </div>

                  {/* Ticket Container Square Box */}
                  <div className={`flex flex-col items-center justify-center w-24 h-20 bg-slate-50 border border-slate-100/50 rounded-2xl shrink-0 ${viewMode === 'list' ? '' : 'hidden'}`}>
                    <div className="p-1.5 bg-orange-50 text-primary rounded-xl mb-1 border border-orange-100/50">
                      <TicketIcon size={16} />
                    </div>
                    <span className="text-sm font-black text-slate-900 leading-none">{left}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tickets Left</span>
                  </div>

                  {/* High Fidelity Price Tag Box */}
                  <div className={`flex items-center justify-center w-24 h-20 bg-purple-50 border border-purple-100/50 rounded-2xl shrink-0 ${viewMode === 'list' ? '' : 'hidden'}`}>
                    <span className="text-2xl font-black text-purple-600">{price}</span>
                  </div>

                  {/* Actions (Details/Delete Button) for Grid View */}
                  {viewMode === 'grid' && (
                    <div className="p-6 pt-2 flex items-center gap-3 border-t border-slate-50 bg-slate-50/50">
                      <button 
                        onClick={() => router.push(`/events/${event.id || event._id}`)}
                        className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl transition-all text-xs border border-slate-100 shadow-sm cursor-pointer"
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event.id || event._id!)}
                        disabled={actionLoading === `delete-${event.id || event._id}`}
                        className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100 cursor-pointer"
                      >
                        {actionLoading === `delete-${event.id || event._id}` ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  )}

                  {/* Mini floating delete icon in list view */}
                  {viewMode === 'list' && (
                    <button 
                      onClick={() => handleDeleteEvent(event.id || event._id!)}
                      disabled={actionLoading === `delete-${event.id || event._id}`}
                      className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100 cursor-pointer shadow-sm ml-auto lg:ml-0 self-end lg:self-center"
                    >
                      {actionLoading === `delete-${event.id || event._id}` ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                    </button>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-primary flex items-center justify-center border border-orange-100 mb-4 animate-bounce">
                <AlertCircle size={28} />
              </div>
              <p className="text-slate-400 font-black text-lg">No events found matching your filter criteria.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('All Category'); }} className="mt-3 text-sm text-primary font-black hover:underline cursor-pointer">Clear active filters</button>
            </div>
          )}
        </div>
      )}

      {/* Redesigned Pagination Footer Section */}
      {!isLoading && filteredEvents.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100 mt-8">
          {/* Left: Showing items count selection */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>Showing</span>
            <div className="relative">
              <select 
                value={eventsPerPage}
                onChange={(e) => { setEventsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="appearance-none bg-white border border-slate-200 rounded-xl py-2 pl-3 pr-8 outline-none text-xs font-black text-slate-700 cursor-pointer"
              >
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
            </div>
            <span>out of {totalFilteredCount} events</span>
          </div>

          {/* Right: Premium pagination navigator */}
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-black text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${page === currentPage ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                {page}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-black text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
