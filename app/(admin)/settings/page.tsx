'use client';

import { useState } from 'react';
import { 
  User, 
  Lock, 
  CheckCircle2, 
  Save, 
  Server, 
  Sliders, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsTab = 'profile' | 'security' | 'platform' | 'system';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'Eventeev',
    email: 'admin@eventeev.com',
    role: 'Super Administrator',
    timeZone: 'Africa/Lagos (GMT+1)',
    language: 'English (US)'
  });

  const [platformConfig, setPlatformConfig] = useState({
    commissionFee: '5.0',
    currency: 'USD ($)',
    requireApproval: true,
    maintenanceMode: false,
    allowRegistration: true
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: '24 hours'
  });

  const handleSave = (section: string) => {
    setToastMessage(`${section} updated and saved successfully!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'security', label: 'Security & 2FA', icon: Lock },
    { id: 'platform', label: 'Platform Controls', icon: Sliders },
    { id: 'system', label: 'System & API', icon: Server },
  ];

  return (
    <div className="max-w-5xl space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200"
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs w-fit flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Admin Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Personal & Administrator Details</h3>
            <p className="text-xs text-slate-400 font-medium">Update profile credentials associated with administrative audit logs.</p>
          </div>

          {/* Profile Header Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-orange-500/20">
              AE
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{profile.firstName} {profile.lastName}</p>
              <p className="text-xs text-slate-400 font-medium">{profile.email}</p>
              <span className="inline-flex mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200/60">
                {profile.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">First Name</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Last Name</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Timezone</label>
              <input
                type="text"
                value={profile.timeZone}
                onChange={(e) => setProfile({ ...profile, timeZone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => handleSave('Profile')}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              <span>Save Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Authentication & Cryptography</h3>
            <p className="text-xs text-slate-400 font-medium">Protect console access with multi-factor tokens and session policies.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-slate-500">Require an authenticator code on unrecognized sign-ins.</p>
              </div>
              <button
                onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                className="text-orange-600 cursor-pointer"
              >
                {security.twoFactor ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-300" />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">New Secure Password</label>
                <input
                  type="password"
                  placeholder="Minimum 12 characters"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => handleSave('Security credentials')}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              <span>Update Password</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Platform Controls */}
      {activeTab === 'platform' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Platform Economics & Governance</h3>
            <p className="text-xs text-slate-400 font-medium">Configure transaction commissions, currency and system admission policies.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Platform Ticket Fee (%)</label>
              <input
                type="text"
                value={platformConfig.commissionFee}
                onChange={(e) => setPlatformConfig({ ...platformConfig, commissionFee: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Settlement Currency</label>
              <select
                value={platformConfig.currency}
                onChange={(e) => setPlatformConfig({ ...platformConfig, currency: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none cursor-pointer"
              >
                <option>USD ($)</option>
                <option>NGN (₦)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Waitlist Gatekeeper</p>
                <p className="text-[11px] text-slate-500">Require administrator approval before new signups can create events.</p>
              </div>
              <button
                onClick={() => setPlatformConfig({ ...platformConfig, requireApproval: !platformConfig.requireApproval })}
                className="text-orange-600 cursor-pointer"
              >
                {platformConfig.requireApproval ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-300" />}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Emergency Maintenance Mode</p>
                <p className="text-[11px] text-slate-500">Temporarily suspend ticket checkout for scheduled database migrations.</p>
              </div>
              <button
                onClick={() => setPlatformConfig({ ...platformConfig, maintenanceMode: !platformConfig.maintenanceMode })}
                className="text-orange-600 cursor-pointer"
              >
                {platformConfig.maintenanceMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-300" />}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => handleSave('Platform governance settings')}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              <span>Save Configurations</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: System & API */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-base font-black text-slate-900 tracking-tight">System Infrastructure & Microservices</h3>
            <p className="text-xs text-slate-400 font-medium">Live environment parameters, API gateway endpoints, and uptime telemetry.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Gateway API Endpoint</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1 break-all">https://eventeevapi.onrender.com/api</p>
              <span className="inline-flex mt-2 items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <CheckCircle2 size={11} /> Connected (HTTP 200)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Build Engine</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1">Next.js 16.2.4 (Turbopack + React 19)</p>
              <span className="inline-flex mt-2 items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                Production Optimized
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
