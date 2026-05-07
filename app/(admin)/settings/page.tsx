'use client';

import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Palette,
  Mail,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const sections = [
    {
      title: 'Account Settings',
      items: [
        { icon: User, label: 'Profile Information', desc: 'Update your photo and personal details.' },
        { icon: Mail, label: 'Email Address', desc: 'Change your primary account email.' },
        { icon: Lock, label: 'Security & Password', desc: 'Manage your password and 2FA settings.' },
      ]
    },
    {
      title: 'Platform Preferences',
      items: [
        { icon: Bell, label: 'Notifications', desc: 'Choose what alerts you want to receive.' },
        { icon: Globe, label: 'Language & Region', desc: 'Set your preferred language and time zone.' },
        { icon: Palette, label: 'Appearance', desc: 'Customize the dashboard theme and colors.' },
      ]
    },
    {
      title: 'Advanced',
      items: [
        { icon: Shield, label: 'Admin Permissions', desc: 'View and manage your access levels.' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-text-muted">Manage your account preferences and platform configurations.</p>
      </div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest ml-1">{section.title}</h3>
            <div className="glass rounded-[2rem] overflow-hidden divide-y divide-white/5">
              {section.items.map((item, itemIdx) => (
                <motion.div 
                  key={itemIdx}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                  className="flex items-center justify-between p-6 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/30 transition-all text-text-muted group-hover:text-primary">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-primary transition-colors">{item.label}</p>
                      <p className="text-sm text-text-muted">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-text-muted group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-10 flex items-center justify-end gap-4">
        <button className="px-6 py-3 rounded-2xl text-sm font-bold text-white hover:bg-white/5 transition-all">
          Cancel
        </button>
        <button className="bg-primary hover:bg-primary-hover px-8 py-3 rounded-2xl text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}
