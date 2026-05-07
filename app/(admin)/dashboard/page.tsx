'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Ticket, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatsResponse {
  users: {
    total: number;
    admins: number;
  };
  events: {
    total: number;
  };
  attendees: {
    total: number;
  };
  revenue: {
    potential: number;
  };
}

const userGrowthData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1200 },
];

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<StatsResponse>('/admin/stats');
        setStats(data);
      } catch (err: any) {
        console.error("Fetch Stats Error:", err);
        setError(err.message || "Failed to load platform stats.");
        if (err.message.includes('401')) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Compiling Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Row: Live Stats from /admin/stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-lg font-bold text-slate-900 mb-4">Total Users</p>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter">
              {stats?.users?.total?.toLocaleString() || '0'}
            </h2>
            <div className="flex items-center text-green-500 font-bold text-lg">
              <ArrowUp size={24} />
              <span>12%</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium mb-12">Growth includes {stats?.users?.admins || 0} platform admins</p>
          <a href="/users" className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-2">
            View all users <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Active Events */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-lg font-bold text-slate-900 mb-4">Active Events</p>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter">
              {stats?.events?.total?.toLocaleString() || '0'}
            </h2>
            <div className="flex items-center text-green-500 font-bold text-lg">
              <ArrowUp size={24} />
              <span>5%</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium mb-12">Live events currently accepting registrations</p>
          <a href="/events" className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-2">
            Manage events <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Total Attendees */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-lg font-bold text-slate-900 mb-4">Total Attendees</p>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter">
              {stats?.attendees?.total ? (stats.attendees.total / 1000).toFixed(1) + 'K' : '0'}
            </h2>
            <div className="flex items-center text-green-500 font-bold text-lg">
              <ArrowUp size={24} />
              <span>8%</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium mb-12">Verified ticket holders across the platform</p>
          <a href="#" className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-2">
            Attendance report <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Platform Growth</h3>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900">
              Monthly <ChevronDown size={14} className="inline ml-1" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
                <XAxis dataKey="name" stroke="#d4d4d4" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#d4d4d4" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                />
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Potential Revenue Highlight */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <TrendingUp className="text-orange-500 opacity-5" size={140} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Potential Revenue</p>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
              ${stats?.revenue?.potential ? (stats.revenue.potential / 1000000).toFixed(1) + 'M' : '0.0'}
            </h2>
            <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
              <ArrowUpRight size={18} />
              <span>12.5% increase</span>
            </div>
          </div>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Cap</span>
              <span className="text-sm font-bold text-slate-900">$2.4M</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 w-[65%]" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Estimated projection for current fiscal quarter.</p>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Admins</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats?.users?.admins || 0}</h3>
          </div>
        </div>

        <div className="md:col-span-3 bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center justify-around">
           {['Waitlist', 'Payouts', 'Moderation', 'Logs'].map((item) => (
             <div key={item} className="flex flex-col items-center gap-2 cursor-pointer group">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all border border-transparent group-hover:border-orange-100">
                 <Clock size={20} />
               </div>
               <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">{item}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
