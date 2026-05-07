'use client';

import { useState } from 'react';
import { 
  UserCheck, 
  Users, 
  Search, 
  MoreHorizontal,
  Mail,
  Calendar,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const waitlistUsers = [
  { id: 1, name: 'David Miller', email: 'd.miller@gmail.com', signUpDate: 'Apr 12, 2024', status: 'Pending' },
  { id: 2, name: 'Elena Rodriguez', email: 'elena.r@yahoo.com', signUpDate: 'Apr 13, 2024', status: 'Pending' },
  { id: 3, name: 'James Wilson', email: 'james.wilson@outlook.com', signUpDate: 'Apr 15, 2024', status: 'Pending' },
  { id: 4, name: 'Sophia Chen', email: 's.chen@techcorp.io', signUpDate: 'Apr 18, 2024', status: 'Pending' },
  { id: 5, name: 'Marcus Thorne', email: 'marcus@startup.ly', signUpDate: 'Apr 20, 2024', status: 'Pending' },
  { id: 6, name: 'Isabella Ross', email: 'i.ross@design.com', signUpDate: 'Apr 22, 2024', status: 'Pending' },
];

export default function WaitlistManagementPage() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSelectAll = () => {
    if (selectedUsers.length === waitlistUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(waitlistUsers.map(u => u.id));
    }
  };

  const toggleSelectUser = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Waitlist Management</h1>
          <p className="text-text-muted">Approve users for platform access.</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {selectedUsers.length > 0 && (
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-xl shadow-green-500/20 transition-all flex items-center gap-2"
              >
                <Users size={18} />
                Bulk Approve ({selectedUsers.length})
              </motion.button>
            )}
          </AnimatePresence>
          <button className="glass border-white/10 px-6 py-3 rounded-2xl text-sm font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2">
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
          <div key={i} className="glass p-6 rounded-3xl flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${
              stat.color === 'orange' ? 'bg-orange-400/10 text-orange-400' :
              stat.color === 'green' ? 'bg-green-400/10 text-green-400' :
              'bg-blue-400/10 text-blue-400'
            }`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search waitlist..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm text-white"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.length === waitlistUsers.length}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary transition-all cursor-pointer"
                  />
                </th>
                <th className="px-8 py-6 text-xs font-bold text-text-muted uppercase tracking-widest">User</th>
                <th className="px-8 py-6 text-xs font-bold text-text-muted uppercase tracking-widest text-center">Sign-up Date</th>
                <th className="px-8 py-6 text-xs font-bold text-text-muted uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-xs font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {waitlistUsers.map((user) => (
                <motion.tr 
                  key={user.id}
                  className={`hover:bg-white/5 transition-colors group ${selectedUsers.includes(user.id) ? 'bg-primary/5' : ''}`}
                >
                  <td className="px-8 py-5">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary transition-all cursor-pointer"
                    />
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user.name}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-text-muted">
                      <Calendar size={14} />
                      {user.signUpDate}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight text-orange-400 bg-orange-400/10 border border-orange-400/20">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                        <UserCheck size={14} />
                        Approve
                      </button>
                      <button className="p-2 rounded-xl hover:bg-white/10 text-text-muted hover:text-white transition-all">
                        <MoreHorizontal size={18} />
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
