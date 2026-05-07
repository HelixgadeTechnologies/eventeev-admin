'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: 'blue' | 'purple' | 'green' | 'orange';
}

export default function StatCard({ label, value, icon: Icon, trend, color }: StatCardProps) {
  const colors = {
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    green: 'text-green-400 bg-green-400/10 border-green-400/20',
    orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-3xl group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl border ${colors[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend.isUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
            {trend.isUp ? '+' : '-'}{trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-text-muted text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full rounded-full bg-gradient-to-r ${color === 'blue' ? 'from-blue-500 to-blue-400' : 'from-purple-500 to-purple-400'}`}
        />
      </div>
    </motion.div>
  );
}
