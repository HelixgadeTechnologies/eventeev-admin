'use client';

import { useState, useEffect } from 'react';
import { 
  Download, 
  Search, 
  ArrowUpRight,
  TrendingUp,
  Ticket,
  Briefcase,
  FileText,
  Calendar,
  Loader2,
  AlertCircle,
  Eye
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface RevenueResponse {
  totalAmount: number;
  verifiedTickets: number;
}

interface Event {
  id: number | string;
  title: string;
  status?: string;
  tickets_sold?: number;
}

const chartData = [
  { name: 'Mon', total: 4500 },
  { name: 'Tue', total: 5200 },
  { name: 'Wed', total: 4800 },
  { name: 'Thu', total: 6100 },
  { name: 'Fri', total: 5900 },
  { name: 'Sat', total: 8200 },
  { name: 'Sun', total: 7500 },
];

export default function RevenueAnalyticsPage() {
  const router = useRouter();
  const [revenue, setRevenue] = useState<RevenueResponse | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [revenueRes, eventsRes] = await Promise.all([
          api.get<RevenueResponse>('/admin/revenue'),
          api.get<{ events: Event[] }>('/admin/events')
        ]);
        
        setRevenue(revenueRes);
        setEvents(eventsRes.events || []);
      } catch (err: any) {
        console.error("Fetch Revenue Error:", err);
        setError(err.message || "Failed to load financial data.");
        if (err.message.includes('401')) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredEvents = (events || []).filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Processing Financial Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Revenue Analytics</h1>
          <p className="text-slate-500 font-medium">Track platform earnings and financial health.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <FileText size={18} className="text-slate-400" />
            Monthly Report
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-xl shadow-orange-600/20 transition-all flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="flex-1">{error}</span>
          <button onClick={() => window.location.reload()} className="underline underline-offset-4">Retry</button>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <TrendingUp className="text-orange-600 opacity-5" size={140} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Platform Revenue</p>
          <div className="flex items-end gap-4 mb-8">
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter">
              ${revenue?.totalAmount?.toLocaleString() || '0'}
            </h2>
            <div className="flex items-center gap-1 text-green-600 font-bold mb-3">
              <ArrowUpRight size={20} />
              <span className="text-sm">12.5%</span>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{fill: '#fff7ed'}}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #fed7aa',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#f97316' : '#ffedd5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div whileHover={{ y: -4 }} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-green-50 text-green-600 border border-green-100">
                <Ticket size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Tickets</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {revenue?.verifiedTickets?.toLocaleString() || '0'}
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">Total tickets validated across all events this year.</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organizer Payouts</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                  $980K
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">Total funds disbursed to event organizers.</p>
          </motion.div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Event Revenue Breakdown</h3>
          <div className="relative group w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-orange-500/20 text-sm text-slate-900 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event Title</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Tickets Sold</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-orange-50/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-primary border border-orange-100">
                        <Calendar size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm text-slate-700 font-bold">{event.tickets_sold?.toLocaleString() || '0'}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                      event.status === 'Completed' || event.status === 'completed' ? 'text-green-600 bg-green-50 border border-green-100' :
                      event.status === 'Ongoing' || event.status === 'ongoing' ? 'text-blue-600 bg-blue-50 border border-blue-100' :
                      'text-orange-600 bg-orange-50 border border-orange-100'
                    }`}>
                      {event.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => router.push(`/revenue/event/${event.id}`)}
                      className="inline-flex items-center gap-2 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-100 hover:border-orange-100"
                    >
                      <Eye size={14} />
                      Breakdown
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
