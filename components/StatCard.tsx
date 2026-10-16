'use client';

import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number | string;
    isUp: boolean;
    label?: string;
  };
  color?: 'orange' | 'emerald' | 'blue' | 'purple' | 'slate';
  badge?: string;
  onClick?: () => void;
}

export default function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  subtitle,
  trend, 
  color = 'orange',
  badge,
  onClick 
}: StatCardProps) {
  const colorThemes = {
    orange: {
      iconBg: 'bg-orange-50 text-orange-600 border-orange-200/70',
      bar: 'bg-gradient-to-r from-orange-500 to-amber-500',
      badge: 'bg-orange-100/70 text-orange-700 border-orange-200/60',
      accent: 'group-hover:border-orange-500/30'
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
      bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      badge: 'bg-emerald-100/70 text-emerald-700 border-emerald-200/60',
      accent: 'group-hover:border-emerald-500/30'
    },
    blue: {
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200/70',
      bar: 'bg-gradient-to-r from-sky-500 to-blue-500',
      badge: 'bg-sky-100/70 text-sky-700 border-sky-200/60',
      accent: 'group-hover:border-sky-500/30'
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200/70',
      bar: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      badge: 'bg-purple-100/70 text-purple-700 border-purple-200/60',
      accent: 'group-hover:border-purple-500/30'
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      bar: 'bg-gradient-to-r from-slate-600 to-slate-800',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      accent: 'group-hover:border-slate-400'
    }
  };

  const theme = colorThemes[color] || colorThemes.orange;

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={`bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''} ${theme.accent}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl border ${theme.iconBg} shadow-xs`}>
          <Icon size={22} />
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
              {badge}
            </span>
          )}
          {trend && (
            <div className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full ${
              trend.isUp 
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60' 
                : 'text-rose-700 bg-rose-50 border border-rose-200/60'
            }`}>
              {trend.isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1.5">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight font-mono">{value}</h3>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{subtitle}</p>
        )}
      </div>

      <div className="mt-5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '75%' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${theme.bar}`}
        />
      </div>
    </motion.div>
  );
}
