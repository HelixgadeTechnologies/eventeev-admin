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
  Loader2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  
  // Modal State
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<{ users: User[] }>('/admin/users');
      setUsers(data.users || []);
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

  useEffect(() => {
    fetchUsers();
  }, [router]);

  const handleStatusUpdate = async (id: string | number, currentStatus: string) => {
    const newStatus = (currentStatus.toLowerCase() === 'active' || currentStatus.toLowerCase() === 'active') ? 'blocked' : 'active';
    try {
      setActionLoading(`status-${id}`);
      await api.request(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setSuccess(`User status updated to ${newStatus}`);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleUpdate = async (id: string | number, currentRole: string) => {
    const newRole = currentRole.toLowerCase() === 'admin' ? 'user' : 'admin';
    try {
      setActionLoading(`role-${id}`);
      await api.request(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole })
      });
      setSuccess(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update role.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.post('/admin/create', newAdmin);
      setSuccess("New admin account created successfully.");
      setIsAddAdminOpen(false);
      setNewAdmin({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to create admin account.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All Roles' || user.role.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Notifications */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
            }`}
          >
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{error || success}</span>
            <button onClick={() => { setError(null); setSuccess(null); }} className="ml-4 hover:opacity-70">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Moderate users and control platform access.</p>
        </div>
        <button 
          onClick={() => setIsAddAdminOpen(true)}
          className="bg-orange-600 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center gap-2 w-fit"
        >
          <UserPlus size={18} />
          Add Admin
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all text-sm text-slate-900 shadow-sm"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none bg-white border border-slate-100 rounded-2xl py-3.5 pl-5 pr-12 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 text-sm text-slate-900 cursor-pointer transition-all shadow-sm"
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

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Refreshing User List...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Joined Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-orange-50/20 transition-colors group"
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
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                          user.role.toLowerCase() === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-sm text-slate-500 font-medium">
                          {user.joined_at ? new Date(user.joined_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            user.status.toLowerCase() === 'active' ? 'bg-green-500' : 
                            user.status.toLowerCase() === 'blocked' ? 'bg-red-500' : 'bg-slate-300'
                          }`} />
                          <span className="text-sm font-bold text-slate-700 capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            disabled={!!actionLoading}
                            onClick={() => handleRoleUpdate(user.id, user.role)}
                            title={user.role.toLowerCase() === 'admin' ? "Demote to User" : "Promote to Admin"}
                            className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all border border-slate-100 hover:border-orange-100"
                          >
                            {actionLoading === `role-${user.id}` ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                          </button>
                          <button 
                            disabled={!!actionLoading}
                            onClick={() => handleStatusUpdate(user.id, user.status)}
                            title={user.status.toLowerCase() === 'active' ? "Block User" : "Activate User"}
                            className={`p-2.5 rounded-xl transition-all border ${
                              user.status.toLowerCase() === 'active' 
                                ? 'bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 border-slate-100 hover:border-red-100' 
                                : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                            }`}
                          >
                            {actionLoading === `status-${user.id}` ? <Loader2 className="animate-spin" size={18} /> : <Ban size={18} />}
                          </button>
                          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
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

      {/* Add Admin Modal */}
      <AnimatePresence>
        {isAddAdminOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddAdminOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative z-10 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create Admin</h3>
                  <p className="text-sm text-slate-500 font-medium">Provision a new administrative account.</p>
                </div>
                <button onClick={() => setIsAddAdminOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    placeholder="Enter admin name..."
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    placeholder="admin@eventeev.com"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                  <input 
                    required
                    type="password" 
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Provision Account"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
