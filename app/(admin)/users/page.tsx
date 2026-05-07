'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  ShieldCheck, 
  Ban, 
  ArrowUpDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const users = [
  { id: 1, name: 'Alex Jordan', email: 'alex@example.com', role: 'Admin', joined: 'Oct 24, 2023', status: 'Active', avatar: 'AJ' },
  { id: 2, name: 'Sarah Wilson', email: 'sarah.w@google.com', role: 'User', joined: 'Nov 12, 2023', status: 'Active', avatar: 'SW' },
  { id: 3, name: 'Michael Chen', email: 'm.chen@tech.io', role: 'User', joined: 'Dec 05, 2023', status: 'Blocked', avatar: 'MC' },
  { id: 4, name: 'Emma Davis', email: 'emma.d@startup.com', role: 'User', joined: 'Jan 15, 2024', status: 'Active', avatar: 'ED' },
  { id: 5, name: 'Robert Brown', email: 'robert@corp.com', role: 'Admin', joined: 'Feb 20, 2024', status: 'Active', avatar: 'RB' },
  { id: 6, name: 'Jessica Lee', email: 'jess.lee@web.com', role: 'User', joined: 'Mar 10, 2024', status: 'Inactive', avatar: 'JL' },
];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-text-muted">Moderate users and control platform access.</p>
        </div>
        <button className="bg-gradient-primary px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 w-fit">
          <UserPlus size={18} />
          Add Admin
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm text-white"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-5 pr-12 outline-none focus:border-primary/50 text-sm text-white cursor-pointer transition-all"
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>User</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
          </div>
          <button className="glass p-3.5 rounded-2xl text-text-muted hover:text-white transition-all">
            <ArrowUpDown size={20} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                      user.role === 'Admin' ? 'text-purple-600 bg-purple-50 border border-purple-100' : 'text-blue-600 bg-blue-50 border border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-slate-500 font-medium">{user.joined}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 
                        user.status === 'Blocked' ? 'bg-red-500' : 'bg-slate-300'
                      }`} />
                      <span className="text-sm font-semibold text-slate-700">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-blue-600 transition-all border border-transparent hover:border-slate-100">
                        <ShieldCheck size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-slate-100">
                        <Ban size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
