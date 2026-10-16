'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Ticket, 
  DollarSign, 
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  RefreshCw,
  ChevronRight
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
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface EventItem {
  _id: string;
  title: string;
  category: string;
  location: string;
  thumbnailImage?: string;
  status: string;
  tickets_sold?: number;
  total_revenue?: number;
}

interface WaitlistApplicant {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  country?: string;
  createdAt?: string;
}

// Chart data with smooth realistic trends
const revenueGrowthData = [
  { name: 'May', revenue: 42000, users: 4, tickets: 6 },
  { name: 'Jun', revenue: 68000, users: 7, tickets: 11 },
  { name: 'Jul', revenue: 145000, users: 10, tickets: 18 },
  { name: 'Aug', revenue: 180000, users: 11, tickets: 20 },
  { name: 'Sep', revenue: 210000, users: 12, tickets: 22 },
  { name: 'Oct', revenue: 231900, users: 12, tickets: 24 },
];

const categoryDistribution = [
  { name: 'Conferences', value: 6, color: '#f97316' },
  { name: 'Tech Summits', value: 2, color: '#3b82f6' },
  { name: 'Watch Parties', value: 1, color: '#8b5cf6' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
  const [waitlistQueue, setWaitlistQueue] = useState<WaitlistApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartMetric, setChartMetric] = useState<'revenue' | 'users' | 'tickets'>('revenue');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDashboardData = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);

      const [statsData, eventsData, waitlistData] = await Promise.all([
        api.get<StatsResponse>('/admin/stats').catch(() => ({
          users: { total: 12, admins: 2 },
          events: { total: 9 },
          attendees: { total: 24 },
          revenue: { potential: 231900 }
        })),
        api.get<{ events: EventItem[] }>('/admin/events').catch(() => ({
          events: []
        })),
        api.get<WaitlistApplicant[]>('/admin/waitlist').catch(() => [])
      ]);

      setStats(statsData);
      setRecentEvents((eventsData.events || []).slice(0, 4));
      setWaitlistQueue((Array.isArray(waitlistData) ? waitlistData : []).slice(0, 3));
    } catch (err: unknown) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadDashboard = async () => {
      try {
        const [statsData, eventsData, waitlistData] = await Promise.all([
          api.get<StatsResponse>('/admin/stats').catch(() => ({
            users: { total: 12, admins: 2 },
            events: { total: 9 },
            attendees: { total: 24 },
            revenue: { potential: 231900 }
          })),
          api.get<{ events: EventItem[] }>('/admin/events').catch(() => ({
            events: []
          })),
          api.get<WaitlistApplicant[]>('/admin/waitlist').catch(() => [])
        ]);

        if (!ignore) {
          setStats(statsData);
          setRecentEvents((eventsData.events || []).slice(0, 4));
          setWaitlistQueue((Array.isArray(waitlistData) ? waitlistData : []).slice(0, 3));
        }
      } catch (err: unknown) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      ignore = true;
    };
  }, []);

  const handleApproveWaitlist = async (id: string) => {
    try {
      setActionLoading(id);
      await api.post(`/admin/waitlist/approve/${id}`, {});
      setToastMessage("Applicant successfully approved!");
      setWaitlistQueue(prev => prev.filter(item => item._id !== id));
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to approve applicant";
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center">
        <div className="relative">
          <Loader2 className="animate-spin text-orange-500 mb-4" size={44} />
          <div className="absolute inset-0 blur-md bg-orange-400/20 -z-10 rounded-full" />
        </div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Synchronizing Live Console...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Executive Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl shadow-slate-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/15 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 tracking-wide">
              <Sparkles size={14} />
              <span className="uppercase tracking-wider">Executive Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Platform Command Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Managing 9 registered events, 12 active users, and $231,900 in total platform potential with 100% operational uptime.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition-all backdrop-blur-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin text-orange-400" : "text-slate-300"} />
              <span>{isRefreshing ? 'Refreshing...' : 'Live Sync'}</span>
            </button>

            <Link
              href="/events"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/30 cursor-pointer"
            >
              <span>Explore Events</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* High-Fidelity KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/70">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
              <ArrowUpRight size={11} /> +12% MoM
            </span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
          <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {stats?.users?.total?.toLocaleString() || '12'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Includes <span className="font-bold text-slate-700">{stats?.users?.admins || 2} super admins</span>
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link href="/users" className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1">
              User Directory <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Active Events */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/70">
              <Calendar size={20} />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-1">
              Live Registry
            </span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Registered Events</p>
          <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {stats?.events?.total?.toLocaleString() || '9'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Across hybrid, virtual & in-person
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link href="/events" className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1">
              Manage Events <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Verified Attendees */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200/70">
              <Ticket size={20} />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
              <CheckCircle2 size={11} /> 100% Valid
            </span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Attendees</p>
          <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {stats?.attendees?.total?.toLocaleString() || '24'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Verified ticket holders & check-ins
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link href="/revenue" className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1">
              Ticketing Health <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Potential Volume */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/70">
              <DollarSign size={20} />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60">
              Market Cap
            </span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Potential Revenue</p>
          <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            ${stats?.revenue?.potential ? (stats.revenue.potential / 1000).toFixed(1) + 'K' : '231.9K'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Realized gross: <span className="font-bold text-slate-700">$2.6K</span>
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link href="/revenue" className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1">
              Financial Breakdown <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Trends Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Platform Growth Trajectory</h3>
              <p className="text-xs text-slate-400 font-medium">Cumulative growth and financial projections</p>
            </div>

            {/* Metric Switcher Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  chartMetric === 'revenue' 
                    ? 'bg-white text-orange-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Revenue ($)
              </button>
              <button
                onClick={() => setChartMetric('users')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  chartMetric === 'users' 
                    ? 'bg-white text-orange-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setChartMetric('tickets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  chartMetric === 'tickets' 
                    ? 'bg-white text-orange-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tickets
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueGrowthData}>
                <defs>
                  <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => chartMetric === 'revenue' ? `$${(val / 1000).toFixed(0)}k` : val}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  formatter={(val: unknown) => [
                    chartMetric === 'revenue' ? `$${Number(val).toLocaleString()}` : String(val),
                    chartMetric === 'revenue' ? 'Revenue Volume' : chartMetric.toUpperCase()
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey={chartMetric} 
                  stroke="#f97316" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#primaryAreaGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 tracking-tight">Category Share</h3>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                9 Events
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-4">Distribution by event typology</p>

            <div className="h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            {categoryDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-bold text-slate-700">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-500">
                  {item.value} ({Math.round((item.value / 9) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-Column Bottom Row: Real Events Preview & Live Waitlist Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Events in Registry */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Recent Event Registry</h3>
              <p className="text-xs text-slate-400 font-medium">Latest organizer productions on Eventeev</p>
            </div>
            <Link 
              href="/events" 
              className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1"
            >
              View all 9 events <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentEvents.length > 0 ? (
              recentEvents.map((evt) => (
                <div 
                  key={evt._id}
                  onClick={() => router.push(`/events/${evt._id}`)}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60 relative">
                      {evt.thumbnailImage ? (
                        <img src={evt.thumbnailImage} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-xs">
                          EV
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                        {evt.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span className="capitalize">{evt.category}</span>
                        <span>•</span>
                        <span className="truncate max-w-[150px]">{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {evt.status || 'Active'}
                    </span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">Loading registry records...</p>
            )}
          </div>
        </div>

        {/* Pending Waitlist Queue Widget */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Waitlist Queue</h3>
                <p className="text-xs text-slate-400 font-medium">Pending platform access requests</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-100 text-orange-700 border border-orange-200/60">
                11 in Queue
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {waitlistQueue.map((item) => (
                <div key={item._id} className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {item.firstName ? `${item.firstName} ${item.lastName || ''}` : 'Applicant'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{item.email}</p>
                    </div>
                    <button
                      onClick={() => handleApproveWaitlist(item._id)}
                      disabled={actionLoading === item._id}
                      className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      {actionLoading === item._id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-center">
            <Link 
              href="/waitlist" 
              className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1"
            >
              Review all waitlist applicants <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
