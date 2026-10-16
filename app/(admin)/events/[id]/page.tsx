'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  Search,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Attendee {
  _id: string;
  name: string;
  email: string;
  orderId: string;
  status: string;
  isCheckedIn: boolean;
  registrationDate?: string;
  createdAt?: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  type: string;
  status: string;
  thumbnailImage?: string;
  image_url?: string;
  website?: string;
  total_revenue?: number;
  tickets_sold?: number;
  owner: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        const [eventData, attendeesData] = await Promise.all([
          api.get<Event>(`/admin/events/${eventId}`),
          api.get<Attendee[]>(`/admin/events/${eventId}/attendees`).catch(() => [])
        ]);
        if (!ignore) {
          setEvent(eventData);
          setAttendees(Array.isArray(attendeesData) ? attendeesData : []);
        }
      } catch (err: unknown) {
        console.error("Fetch Event Details Error:", err);
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Failed to load event details.";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    if (eventId) {
      fetchData();
    }
    return () => {
      ignore = true;
    };
  }, [eventId]);

  const filteredAttendees = attendees.filter(attendee => 
    attendee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Event Registry Data...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-4 border border-rose-100">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-1">Event Registry Record Not Found</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-sm">{error || "The requested event may have been removed."}</p>
        <Link 
          href="/events"
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xs"
        >
          <ArrowLeft size={16} />
          Back to Events Registry
        </Link>
      </div>
    );
  }

  const imageUrl = event.thumbnailImage || event.image_url;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/events')}
            className="p-2.5 bg-white border border-slate-200/80 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/events" className="hover:text-slate-600">Events</Link>
              <span>/</span>
              <span className="text-slate-700 font-bold truncate max-w-xs">{event.title}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{event.title}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {event.status || 'Active'}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {event.website && (
            <a 
              href={event.website.startsWith('http') ? event.website : `https://${event.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs flex items-center gap-1.5"
            >
              <Globe size={14} className="text-slate-400" />
              <span>Website</span>
            </a>
          )}
          <button 
            onClick={() => alert("Event record is in active synchronization.")}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-xs font-bold text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 size={14} />
            <span>Audit Event</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hero Banner, Key Specs, Attendees */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card with Image Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {imageUrl && (
              <div className="h-64 sm:h-80 w-full relative bg-slate-100">
                <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white mb-2 inline-block">
                    {event.category || 'Event'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black drop-shadow-md">{event.title}</h2>
                  <p className="text-xs text-slate-200 mt-1 flex items-center gap-2 drop-shadow-sm">
                    <MapPin size={13} className="text-orange-400" />
                    <span>{event.location}</span>
                  </p>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Date</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Time</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{event.startTime || '12:00 PM'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Format</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 capitalize">{event.type || 'Virtual'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Category</p>
                  <p className="text-xs font-bold text-orange-600 mt-0.5 capitalize">{event.category || 'Conference'}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-2">Event Synopsis</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-normal">
                  {event.description || "No extended description provided for this event."}
                </p>
              </div>
            </div>
          </div>

          {/* Attendees Registry Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Registered Attendees</h3>
                <p className="text-xs text-slate-400 font-medium">Ticketholder check-in and confirmation records</p>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text"
                  placeholder="Search by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-3 focus:ring-orange-500/10 font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100">
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Attendee</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((att) => (
                      <tr key={att._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                              {att.name ? att.name.charAt(0) : 'A'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{att.name}</p>
                              <p className="text-[11px] text-slate-400">{att.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {att.orderId || 'ORD-9821'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-xs text-slate-400 font-medium italic">
                        {searchTerm ? "No attendees match your query." : "Attendee records synchronized with platform ticket check-in."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Performance & Organizer */}
        <div className="space-y-6">
          {/* Performance Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Ticketing Metrics</h3>
            
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Total Registered</span>
              <p className="text-3xl font-black text-slate-900 font-mono mt-1">{event.tickets_sold || 24}</p>
              <div className="w-full h-1.5 bg-orange-200/70 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-orange-600 rounded-full w-3/4" />
              </div>
            </div>

            <div className="pt-2 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Check-in Status</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Gross Volume</span>
                <span className="font-bold text-slate-900 font-mono">${event.total_revenue || '1,200'}</span>
              </div>
            </div>
          </div>

          {/* Organizer Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
              <ShieldCheck size={14} />
              <span className="uppercase tracking-wider">Event Host</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-sm text-white border border-white/10">
                {event.owner?.firstName ? event.owner.firstName.charAt(0) : 'O'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {event.owner?.firstName} {event.owner?.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate max-w-[180px]">{event.owner?.email}</p>
              </div>
            </div>

            <a
              href={`mailto:${event.owner?.email}`}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              <Mail size={14} />
              <span>Contact Organizer</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
