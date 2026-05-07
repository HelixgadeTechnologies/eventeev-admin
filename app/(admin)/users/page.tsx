'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  ShieldCheck, 
  Ban, 
  ArrowUpDown,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  joined_at?: string;
  status: string;
}

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<User[]>('/users');
        setUsers(data);
      } catch (err: any) {
        console.error("Fetch Users Error:", err);
        setError(err.message || "Failed to load users.");
        if (err.message.includes('401')) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All Roles' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Moderate users and control platform access.</p>
        </div>
        <button className="bg-gradient-primary px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-xl shadow-orange-500/20 hover:opacity-90 transition-all flex items-center gap-2 w-fit">
          <UserPlus size={18} />
          Add Admin
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm text-slate-900 shadow-sm"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none bg-white border border-slate-100 rounded-2xl py-3.5 pl-5 pr-12 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 text-sm text-slate-900 cursor-pointer transition-all shadow-sm"
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>User</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
          <button className="bg-white border border-slate-100 p-3.5 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <ArrowUpDown size={20} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => window.location.reload()} className="underline underline-offset-4">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Fetching Platform Users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-orange-50/30 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary font-bold text-sm border border-orange-100/50">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{user.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-1 rounded-md uppercase">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-500 font-medium">
                          {user.joined_at ? new Date(user.joined_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            user.status === 'Active' || user.status === 'active' ? 'bg-green-500' : 
                            user.status === 'Blocked' || user.status === 'blocked' ? 'bg-red-500' : 'bg-slate-300'
                          }`} />
                          <span className="text-sm font-bold text-slate-700 capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-primary transition-all">
                            <ShieldCheck size={18} />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-red-500 transition-all">
                            <Ban size={18} />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-900 transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                      No users found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
