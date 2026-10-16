'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  ShieldCheck, 
  Ban, 
  Loader2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface User {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role: string;
  country?: string;
  avatar?: string;
  isVerified?: boolean;
  isWaitlisted?: boolean;
  status?: string;
  isBlocked?: boolean;
  createdAt?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  
  // Modal State
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ firstName: '', lastName: '', email: '', password: '' });

  const fetchUsers = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await api.get<{ users: User[] }>('/admin/users');
      setUsers(data.users || []);
    } catch (err: unknown) {
      console.error("Fetch Users Error:", err);
      const message = err instanceof Error ? err.message : "Failed to load user directory.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadUsers = async () => {
      try {
        const data = await api.get<{ users: User[] }>('/admin/users');
        if (!ignore) {
          setUsers(data.users || []);
        }
      } catch (err: unknown) {
        console.error("Fetch Users Error:", err);
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Failed to load user directory.";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();
    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusUpdate = async (id: string, currentStatus?: string, isBlocked?: boolean) => {
    const isCurrentlyActive = (currentStatus?.toLowerCase() === 'active' || isBlocked === false);
    const newStatus = isCurrentlyActive ? 'blocked' : 'active';
    
    try {
      setActionLoading(`status-${id}`);
      await api.request(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setSuccess(`User marked as ${newStatus}.`);
      setUsers(prev => prev.map(u => (u._id || u.id) === id ? { ...u, status: newStatus, isBlocked: newStatus === 'blocked' } : u));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update status.";
      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleUpdate = async (id: string, currentRole: string) => {
    const newRole = currentRole.toLowerCase() === 'admin' ? 'user' : 'admin';
    try {
      setActionLoading(`role-${id}`);
      await api.request(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole })
      });
      setSuccess(`User role transitioned to ${newRole.toUpperCase()}.`);
      setUsers(prev => prev.map(u => (u._id || u.id) === id ? { ...u, role: newRole } : u));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update role.";
      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.post('/admin/create', newAdmin);
      setSuccess("New administrator account provisioned successfully!");
      setIsAddAdminOpen(false);
      setNewAdmin({ firstName: '', lastName: '', email: '', password: '' });
      fetchUsers(true);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to provision administrator.";
      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || "";
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.country || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All Roles' || user.role.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const adminsCount = users.filter(u => u.role?.toLowerCase() === 'admin').length;
  const standardUsersCount = users.filter(u => u.role?.toLowerCase() !== 'admin').length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Notifications Toast */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-8 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-xs ${
              error ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{error || success}</span>
            <button onClick={() => { setError(null); setSuccess(null); }} className="ml-3 hover:opacity-70">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Directory</p>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-orange-600">Super Admins</p>
          <p className="text-2xl font-black text-orange-600 font-mono mt-1">{adminsCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Standard Users</p>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">{standardUsersCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Access Actions</p>
            <button
              onClick={() => setIsAddAdminOpen(true)}
              className="mt-1 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={13} />
              <span>Add Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Role Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input 
            type="text" 
            placeholder="Search by name, email, country..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-9 pr-4 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40 text-xs font-medium text-slate-900 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-3.5 pr-8 outline-none text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>User</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-orange-500 mb-3" size={36} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading User Directory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">User Profile</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Origin</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const userId = user._id || user.id || '';
                    const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.name || 'User');
                    const isAdmin = user.role?.toLowerCase() === 'admin';
                    const isBlocked = user.status?.toLowerCase() === 'blocked' || user.isBlocked === true;

                    return (
                      <tr key={userId} className="hover:bg-slate-50/60 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img src={user.avatar} alt={fullName} className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200" />
                            ) : (
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-2xs ${
                                isAdmin ? 'bg-gradient-to-tr from-orange-500 to-amber-500' : 'bg-gradient-to-tr from-slate-600 to-slate-800'
                              }`}>
                                {fullName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
                                <span>{fullName}</span>
                                {user.isVerified && (
                                  <span title="Verified Account" className="text-blue-500">
                                    <CheckCircle2 size={12} />
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isAdmin 
                              ? 'bg-orange-100 text-orange-700 border border-orange-200/70' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200/70'
                          }`}>
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                            <Globe size={13} className="text-slate-400" />
                            <span>{user.country || 'Global'}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                            isBlocked 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            {isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              disabled={actionLoading === `role-${userId}`}
                              onClick={() => handleRoleUpdate(userId, user.role)}
                              title={isAdmin ? "Demote to User" : "Promote to Admin"}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-xs font-bold transition-all cursor-pointer border border-transparent hover:border-orange-200 flex items-center gap-1"
                            >
                              {actionLoading === `role-${userId}` ? (
                                <Loader2 size={13} className="animate-spin text-orange-500" />
                              ) : (
                                <ShieldCheck size={13} />
                              )}
                              <span>{isAdmin ? 'Demote' : 'Make Admin'}</span>
                            </button>

                            <button 
                              disabled={actionLoading === `status-${userId}`}
                              onClick={() => handleStatusUpdate(userId, user.status, user.isBlocked)}
                              title={isBlocked ? "Unblock user" : "Block user"}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                                isBlocked 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                                  : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 border-transparent hover:border-rose-200'
                              }`}
                            >
                              {actionLoading === `status-${userId}` ? (
                                <Loader2 size={13} className="animate-spin text-rose-500" />
                              ) : (
                                <Ban size={13} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-xs text-slate-400 font-medium italic">
                      No users found matching your search.
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Provision Administrator</h3>
                  <p className="text-xs text-slate-400 font-medium">Grant elevated console privileges</p>
                </div>
                <button 
                  onClick={() => setIsAddAdminOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAdmin} className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">First Name</label>
                    <input 
                      required
                      type="text" 
                      value={newAdmin.firstName}
                      onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                      placeholder="Jane"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Last Name</label>
                    <input 
                      required
                      type="text" 
                      value={newAdmin.lastName}
                      onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="admin@eventeev.com"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Security Password</label>
                  <input 
                    required
                    type="password" 
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsAddAdminOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isLoading ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                    <span>Create Admin</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
