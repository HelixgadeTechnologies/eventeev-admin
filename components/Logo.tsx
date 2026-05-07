'use client';

export default function Logo({ className = "", light = false }: { className?: string, light?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-[#ea580c] p-1.5 rounded-lg">
         <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
            <span className="text-[#ea580c] font-black text-[10px]">E</span>
         </div>
      </div>
      <span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        Eventeev
      </span>
    </div>
  );
}
