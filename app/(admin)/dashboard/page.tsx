'use client';

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
  ArrowDown
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
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

const eventCategoryData = [
  { name: 'Tech', value: 400 },
  { name: 'Music', value: 300 },
  { name: 'Arts', value: 300 },
  { name: 'Sports', value: 200 },
];

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

const recentActivity = [
  { id: 1, title: 'New Event Created', desc: 'Global Tech Summit 2024 has been published.', time: '2 mins ago', icon: Calendar, color: 'orange' },
  { id: 2, title: 'User Verification', desc: 'Elena Rodriguez verified her organizer account.', time: '15 mins ago', icon: CheckCircle2, color: 'green' },
  { id: 3, title: 'Payout Processed', desc: 'Revenue payout for Neon Nights processed successfully.', time: '1 hour ago', icon: DollarSign, color: 'blue' },
  { id: 4, title: 'Waitlist Alert', desc: '50 new users are waiting for approval.', time: '3 hours ago', icon: Clock, color: 'purple' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Row: Reverting to old stats in new design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-lg font-bold text-slate-900 mb-4">Total Users</p>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter">12,482</h2>
            <div className="flex items-center text-green-500 font-bold text-lg">
              <ArrowUp size={24} />
              <span>12%</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium mb-12">Increase in registrations compared to last week</p>
          <a href="/users" className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-2">
            View all users <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Active Events */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-lg font-bold text-slate-900 mb-4">Active Events</p>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter">842</h2>
            <div className="flex items-center text-green-500 font-bold text-lg">
              <ArrowUp size={24} />
              <span>5%</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium mb-12">Total events currently live on the platform</p>
          <a href="/events" className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-2">
            Manage events <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Total Attendees */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-lg font-bold text-slate-900 mb-4">Total Attendees</p>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter">45.2K</h2>
            <div className="flex items-center text-green-500 font-bold text-lg">
              <ArrowUp size={24} />
              <span>8%</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium mb-12">Ticket holders across all active events</p>
          <a href="#" className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-2">
            Attendance report <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity (Replacing Customers) */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900">
              Filter by <span className="text-slate-900">All</span> <ChevronDown size={14} />
            </div>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <motion.div 
                key={activity.id}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border",
                    activity.color === 'orange' ? "bg-orange-50 text-orange-600 border-orange-100" :
                    activity.color === 'green' ? "bg-green-50 text-green-600 border-green-100" :
                    activity.color === 'blue' ? "bg-blue-50 text-blue-600 border-blue-100" :
                    "bg-purple-50 text-purple-600 border-purple-100"
                  )}>
                    <activity.icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{activity.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{activity.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <a href="#" className="inline-block mt-8 text-sm font-bold text-orange-600 hover:underline">
            View activity log →
          </a>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">User Growth</h3>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900">
              Monthly <ChevronDown size={14} className="inline ml-1" />
            </div>
          </div>
          <div className="h-[250px] w-full">
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
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Potential Revenue */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Potential Revenue</h3>
          <p className="text-xs text-slate-400 font-bold mb-4">Projected for Q2</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-900">$1.2M</h4>
            <span className="text-red-500 font-bold text-xs flex items-center">
              <ArrowDown size={12} /> 2%
            </span>
          </div>
        </div>

        {/* Event Distribution */}
        <div className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Event Categories</h3>
            <div className="space-y-3">
              {eventCategoryData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between pr-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[150px] w-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {eventCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Links</h3>
          <div className="flex flex-wrap gap-2">
            {['Reports', 'Waitlist', 'Payouts', 'Moderation'].map((link) => (
              <div key={link} className="px-3 py-2 bg-orange-50 text-orange-600 text-[10px] font-black rounded-full uppercase tracking-widest cursor-pointer hover:bg-orange-100 transition-colors">
                {link}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

