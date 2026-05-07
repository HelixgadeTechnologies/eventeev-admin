'use client';

import { 
  Users, 
  Calendar, 
  Ticket, 
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';

const userGrowthData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 600 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 900 },
  { name: 'May', value: 1100 },
  { name: 'Jun', value: 1300 },
];

const eventCategoryData = [
  { name: 'Tech', value: 400 },
  { name: 'Music', value: 300 },
  { name: 'Art', value: 200 },
  { name: 'Sports', value: 278 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

const recentActivity = [
  { id: 1, type: 'user', title: 'New User Registration', description: 'Sarah Jenkins signed up', time: '2 mins ago', icon: Users, color: 'blue' },
  { id: 2, type: 'event', title: 'New Event Created', description: 'Tech Summit 2024 by Google', time: '15 mins ago', icon: Calendar, color: 'purple' },
  { id: 3, type: 'ticket', title: 'Ticket Sold', description: '3 tickets sold for Music Fest', time: '1 hour ago', icon: Ticket, color: 'green' },
  { id: 4, type: 'revenue', title: 'Payout Processed', description: '$1,200 sent to organizer', time: '3 hours ago', icon: DollarSign, color: 'orange' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            Download Report
          </button>
          <button className="bg-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
            + New Admin
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Users" 
          value="12,482" 
          icon={Users} 
          trend={{ value: 12, isUp: true }}
          color="blue"
        />
        <StatCard 
          label="Active Events" 
          value="842" 
          icon={Calendar} 
          trend={{ value: 5, isUp: true }}
          color="purple"
        />
        <StatCard 
          label="Total Attendees" 
          value="45,210" 
          icon={Ticket} 
          trend={{ value: 8, isUp: true }}
          color="green"
        />
        <StatCard 
          label="Potential Revenue" 
          value="$1.2M" 
          icon={DollarSign} 
          trend={{ value: 2, isUp: false }}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">User Growth</h3>
              <p className="text-slate-500 text-sm font-medium">Monthly registration overview</p>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs cursor-pointer hover:underline">
              View details <ArrowUpRight size={14} />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
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
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Distribution */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Event Distribution</h3>
          <p className="text-slate-500 text-sm font-medium mb-8">By category</p>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {eventCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {eventCategoryData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          <button className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wider">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentActivity.map((activity) => (
            <motion.div 
              key={activity.id}
              whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
              className="p-4 rounded-2xl border border-slate-100 flex gap-4 transition-all"
            >
              <div className={`p-3 rounded-xl h-fit ${
                activity.color === 'blue' ? 'text-blue-600 bg-blue-50' :
                activity.color === 'purple' ? 'text-purple-600 bg-purple-50' :
                activity.color === 'green' ? 'text-green-600 bg-green-50' :
                'text-orange-600 bg-orange-50'
              }`}>
                <activity.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 line-clamp-1">{activity.title}</p>
                <p className="text-xs text-slate-500 font-medium mb-1">{activity.description}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

