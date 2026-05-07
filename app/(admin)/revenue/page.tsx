'use client';

import { useState } from 'react';
import { 
  Download, 
  Search, 
  ArrowUpRight,
  TrendingUp,
  Ticket,
  Briefcase,
  FileText,
  Calendar
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

const revenueData = [
  { name: 'Mon', total: 4500 },
  { name: 'Tue', total: 5200 },
  { name: 'Wed', total: 4800 },
  { name: 'Thu', total: 6100 },
  { name: 'Fri', total: 5900 },
  { name: 'Sat', total: 8200 },
  { name: 'Sun', total: 7500 },
];

const eventRevenue = [
  { id: 1, title: 'Global Tech Summit 2024', tickets: 1250, revenue: 125000, status: 'Completed' },
  { id: 2, title: 'Neon Nights Music Festival', tickets: 5000, revenue: 450000, status: 'Ongoing' },
  { id: 3, title: 'Modern Art Expo', tickets: 840, revenue: 42000, status: 'Ongoing' },
  { id: 4, title: 'Wellness & Yoga Retreat', tickets: 120, revenue: 60000, status: 'Upcoming' },
  { id: 5, title: 'Startup Pitch Night', tickets: 450, revenue: 9000, status: 'Completed' },
];

export default function RevenueAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Revenue Analytics</h1>
          <p className="text-text-muted">Track platform earnings and financial health.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass border-white/10 px-6 py-3 rounded-2xl text-sm font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2">
            <FileText size={18} />
            Monthly Report
          </button>
          <button className="bg-primary hover:bg-primary-hover px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <TrendingUp className="text-primary opacity-20" size={120} />
          </div>
          <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Total Platform Revenue</p>
          <div className="flex items-end gap-4 mb-8">
            <h2 className="text-6xl font-black text-white tracking-tighter">$1,245,800</h2>
            <div className="flex items-center gap-1 text-green-400 font-bold mb-2">
              <ArrowUpRight size={20} />
              <span>12.5%</span>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-green-400/10 text-green-400">
                <Ticket size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Verified Tickets</p>
                <h3 className="text-3xl font-bold text-white">42,850</h3>
              </div>
            </div>
            <p className="text-sm text-text-muted">Total tickets validated across all events this year.</p>
          </div>

          <div className="glass p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-purple-400/10 text-purple-400">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Organizer Payouts</p>
                <h3 className="text-3xl font-bold text-white">$980K</h3>
              </div>
            </div>
            <p className="text-sm text-text-muted">Total funds disbursed to event organizers.</p>
          </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Event Revenue Breakdown</h3>
          <div className="relative group w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/50 text-sm text-white transition-all"
            />
          </div>
        </div>

        <div className="glass rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-xs font-bold text-text-muted uppercase tracking-widest">Event Title</th>
                <th className="px-8 py-6 text-xs font-bold text-text-muted uppercase tracking-widest text-center">Tickets Sold</th>
                <th className="px-8 py-6 text-xs font-bold text-text-muted uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-xs font-bold text-text-muted uppercase tracking-widest text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {eventRevenue.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Calendar size={16} />
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm text-white font-medium">{event.tickets.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                      event.status === 'Completed' ? 'text-green-400 bg-green-400/10' :
                      event.status === 'Ongoing' ? 'text-blue-400 bg-blue-400/10' :
                      'text-orange-400 bg-orange-400/10'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-sm font-bold text-white">${event.revenue.toLocaleString()}</span>
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
