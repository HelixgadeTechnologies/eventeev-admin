'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Mail, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Ticket
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

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
  image_url?: string;
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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [eventData, attendeesData] = await Promise.all([
          api.get<Event>(`/admin/events/${eventId}`),
          api.get<Attendee[]>(`/admin/events/${eventId}/attendees`)
        ]);
        setEvent(eventData);
        setAttendees(attendeesData);
      } catch (err: any) {
        console.error("Fetch Event Details Error:", err);
        setError(err.message || "Failed to load event details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) fetchData();
  }, [eventId]);

  const filteredAttendees = (attendees || []).filter(attendee => 
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Event Insights...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 border border-red-100">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Event Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-md">{error || "We couldn't retrieve the details for this event. It may have been removed."}</p>
        <button 
          onClick={() => router.push('/events')}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header & Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/events')}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{event.title}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                event.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {event.status}
              </span>
            </div>
            <p className="text-slate-500 font-medium">Event ID: {event._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            Edit Event
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center gap-2">
            <ExternalLink size={18} />
            View Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            {event.image_url && (
              <div className="h-64 w-full relative">
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-primary flex items-center justify-center border border-orange-100">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                      <p className="text-sm font-bold text-slate-900">
                        {new Date(event.startDate).toLocaleDateString()} @ {event.startTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-slate-900">{event.location}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                      <Ticket size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category & Type</p>
                      <p className="text-sm font-bold text-slate-900 capitalize">{event.category} • {event.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organizer</p>
                      <p className="text-sm font-bold text-slate-900">{event.owner.firstName} {event.owner.lastName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Description</h3>
                <p className="text-slate-500 leading-relaxed text-sm whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Attendees Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Registered Attendees</h3>
                <p className="text-slate-500 font-medium">Manage and monitor event participants.</p>
              </div>
              <div className="relative group min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search attendees..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm text-slate-900"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendee</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((attendee) => (
                      <tr key={attendee._id} className="hover:bg-orange-50/20 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-50 text-primary flex items-center justify-center font-bold text-sm border border-orange-100">
                              {attendee.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{attendee.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{attendee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            {attendee.orderId}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {attendee.isCheckedIn ? (
                              <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">
                                Verified
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-all">
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center text-slate-400 font-bold italic">
                        {searchTerm ? "No attendees match your search." : "No attendees have registered for this event yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Quick Actions */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Platform Performance</h3>
            
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Sales</span>
                  <DollarSign size={16} className="text-green-500" />
                </div>
                <h4 className="text-3xl font-black text-slate-900">${event.total_revenue?.toLocaleString() || '0'}</h4>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendees</span>
                  <Users size={16} className="text-blue-500" />
                </div>
                <h4 className="text-3xl font-black text-slate-900">{event.tickets_sold || 0}</h4>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500">Check-in Progress</span>
                <span className="text-xs font-black text-primary">
                  {attendees.length > 0 
                    ? Math.round((attendees.filter(a =\u003e a.isCheckedIn).length / attendees.length) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${attendees.length > 0 ? (attendees.filter(a =\u003e a.isCheckedIn).length / attendees.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
            <h3 className="text-lg font-bold mb-6">Event Organizer</h3>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold border border-white/10">
                {event.owner.firstName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{event.owner.firstName} {event.owner.lastName}</p>
                <p className="text-xs text-white/50">{event.owner.email}</p>
              </div>
            </div>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/10">
              <Mail size={18} />
              Contact Organizer
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100">
            <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-xs text-red-500/70 mb-6">Administrative actions for event oversight.</p>
            <button className="w-full bg-white hover:bg-red-600 hover:text-white text-red-600 font-bold py-4 rounded-2xl transition-all border border-red-200 hover:border-red-600 shadow-sm">
              Force Cancel Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
