'use client';

export default function Logo({ 
  className = "", 
  light = false,
  showBadge = true 
}: { 
  className?: string; 
  light?: boolean;
  showBadge?: boolean;
}) {
  const textColor = light ? 'text-white' : 'text-slate-900';
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="flex items-baseline">
        <span className={`text-2xl font-black tracking-tight ${textColor}`}>E</span>
        <span className="relative inline-flex items-center justify-center mx-[-1px]">
          {/* Stylized Orange V */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="transform translate-y-[2px]"
          >
            <path 
              d="M8 15C8 15 12 32 20 32C28 32 35 12 35 12" 
              stroke="#f97316" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={`text-2xl font-black tracking-tight ${textColor} ml-[-2px]`}>
          enteev
        </span>
      </div>

      {showBadge && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-orange-100/80 text-orange-700 border border-orange-200/60 shadow-xs">
          Admin
        </span>
      )}
    </div>
  );
}
