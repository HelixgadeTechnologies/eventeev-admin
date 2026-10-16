'use client';

import { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  X,
  Calendar, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Globe, 
  Download, 
  CheckCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface WaitlistEntry {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  country?: string;
  tZone?: string;
  isVerified?: boolean;
  role?: string;
  createdAt?: string;
  signUpDate?: string;
}

export default function WaitlistManagementPage() {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWaitlist = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await api.get<WaitlistEntry[]>('/admin/waitlist');
      setWaitlist(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error("Fetch Waitlist Error:", err);
      const message = err instanceof Error ? err.message : "Failed to load waitlist.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadWaitlist = async () => {
      try {
        const data = await api.get<WaitlistEntry[]>('/admin/waitlist');
        if (!ignore) {
          setWaitlist(Array.isArray(data) ? data : []);
        }
      } catch (err: unknown) {
        console.error("Fetch Waitlist Error:", err);
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Failed to load waitlist.";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadWaitlist();
    return () => {
      ignore = true;
    };
  }, []);

  const handleApproveUser = async (id: string) => {
    try {
      setActionLoading(`approve-${id}`);
      await api.post(`/admin/waitlist/approve/${id}`, {});
      setSuccess("Applicant approved! Platform invitation sent.");
      setWaitlist(prev => prev.filter(item => (item._id || item.id) !== id));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to approve applicant.";
      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveAll = async () => {
    if (!confirm(`Are you sure you want to approve all ${filteredWaitlist.length} applicants currently displayed?`)) return;

    try {
      setActionLoading('batch');
      for (const item of filteredWaitlist) {
        const id = item._id || item.id;
        if (id) {
          await api.post(`/admin/waitlist/approve/${id}`, {}).catch(() => {});
        }
      }
      setSuccess(`Approved ${filteredWaitlist.length} applicants.`);
      fetchWaitlist(true);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Batch approval failed.";
      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Country", "Requested Date"];
    const rows = filteredWaitlist.map(u => [
      `"${u.firstName || ''}"`,
      `"${u.lastName || ''}"`,
      `"${u.email}"`,
      `"${u.country || 'Global'}"`,
      `"${u.createdAt ? new Date(u.createdAt).toISOString() : ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eventeev_waitlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredWaitlist = waitlist.filter(entry => {
    const fullName = `${entry.firstName || ''} ${entry.lastName || ''}`.trim() || entry.name || "";
    const email = entry.email || "";
    const country = entry.country || "";
    
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           country.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/70">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Queue Total</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">{waitlist.length} Applicants</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/70">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Approved Platform Users</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">12 Members</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/70">
            <Globe size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Geographic Spread</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">Nigeria, US, ID</h3>
          </div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input 
            type="text" 
            placeholder="Search by name, email, or country..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            disabled={filteredWaitlist.length === 0}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Download size={14} className="text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleApproveAll}
            disabled={actionLoading === 'batch' || filteredWaitlist.length === 0}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {actionLoading === 'batch' ? <Loader2 size={13} className="animate-spin" /> : <CheckCheck size={14} />}
            <span>Approve All ({filteredWaitlist.length})</span>
          </button>
        </div>
      </div>

      {/* Waitlist Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-orange-500 mb-3" size={36} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching Waitlist Registry...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Application Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWaitlist.length > 0 ? (
                  filteredWaitlist.map((item) => {
                    const itemId = item._id || item.id || '';
                    const fullName = item.firstName ? `${item.firstName} ${item.lastName || ''}`.trim() : (item.name || 'Applicant');

                    return (
                      <tr key={itemId} className="hover:bg-slate-50/60 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs flex items-center justify-center border border-orange-200/60 shadow-2xs">
                              {fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                {fullName}
                              </p>
                              <p className="text-[11px] text-slate-400 font-medium">{item.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                            <Globe size={13} className="text-slate-400" />
                            <span>{item.country || 'Global'}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Calendar size={13} className="text-slate-400" />
                            <span>
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/60 inline-flex items-center gap-1">
                            <Clock size={11} />
                            Pending Review
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleApproveUser(itemId)}
                            disabled={actionLoading === `approve-${itemId}`}
                            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            {actionLoading === `approve-${itemId}` ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={13} />
                            )}
                            <span>Approve</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-xs text-slate-400 font-medium italic">
                      No applicants found in queue.
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
