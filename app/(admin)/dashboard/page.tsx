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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Platform Overview</h1>
          <p className="text-text-muted">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-all">
            Download Report
          </button>
          <button className="bg-gradient-primary px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
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
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">User Growth</h3>
              <p className="text-text-muted text-sm">Monthly registration overview</p>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer hover:underline">
              View details <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Distribution */}
        <div className="glass p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-bold text-white mb-1">Event Distribution</h3>
          <p className="text-text-muted text-sm mb-8">By category</p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eventCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {eventCategoryData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-sm text-text-muted">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass p-8 rounded-[2.5rem]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <button className="text-sm text-primary font-bold hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentActivity.map((activity) => (
            <motion.div 
              key={activity.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4"
            >
              <div className={`p-3 rounded-xl h-fit ${
                activity.color === 'blue' ? 'text-blue-400 bg-blue-400/10' :
                activity.color === 'purple' ? 'text-purple-400 bg-purple-400/10' :
                activity.color === 'green' ? 'text-green-400 bg-green-400/10' :
                'text-orange-400 bg-orange-400/10'
              }`}>
                <activity.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white line-clamp-1">{activity.title}</p>
                <p className="text-xs text-text-muted mb-1">{activity.description}</p>
                <p className="text-[10px] font-bold text-primary/80 uppercase tracking-tight">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
