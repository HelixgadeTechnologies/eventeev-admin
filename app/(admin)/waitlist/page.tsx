'use client';

import { useState } from 'react';
import { 
  UserCheck, 
  Users, 
  Search, 
  X,
  Mail,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const waitlistUsers = [
  { id: 1, name: 'David Miller', email: 'd.miller@gmail.com', signUpDate: 'Apr 12, 2024', status: 'Pending', type: 'Attendee' },
  { id: 2, name: 'Elena Rodriguez', email: 'elena.r@yahoo.com', signUpDate: 'Apr 13, 2024', status: 'Pending', type: 'Organizer' },
  { id: 3, name: 'James Wilson', email: 'james.wilson@outlook.com', signUpDate: 'Apr 15, 2024', status: 'Pending', type: 'Attendee' },
  { id: 4, name: 'Sophia Chen', email: 's.chen@techcorp.io', signUpDate: 'Apr 18, 2024', status: 'Pending', type: 'Organizer' },
  { id: 5, name: 'Marcus Thorne', email: 'marcus@startup.ly', signUpDate: 'Apr 20, 2024', status: 'Pending', type: 'Attendee' },
  { id: 6, name: 'Isabella Ross', email: 'i.ross@design.com', signUpDate: 'Apr 22, 2024', status: 'Pending', type: 'Attendee' },
];

export default function WaitlistManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Waitlist Management</h1>
          <p className="text-slate-500 font-medium">Approve users for platform access.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            Export List
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Approvals', value: '1,248', icon: Clock, color: 'orange' },
          { label: 'Approved Today', value: '154', icon: CheckCircle2, color: 'green' },
          { label: 'Waitlist Growth', value: '+12%', icon: Users, color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className={`p-3 rounded-2xl ${
              stat.color === 'orange' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
              stat.color === 'green' ? 'bg-green-50 text-green-600 border border-green-100' :
              'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search waitlist by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm text-slate-900 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requested Date</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {waitlistUsers.map((item) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Calendar size={14} className="text-blue-600" />
                      {item.signUpDate}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                      item.type === 'Organizer' ? 'text-purple-600 bg-purple-50 border border-purple-100' : 'text-blue-600 bg-blue-50 border border-blue-100'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/10">
                        Approve
                      </button>
                      <button className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                        <X size={18} />
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
