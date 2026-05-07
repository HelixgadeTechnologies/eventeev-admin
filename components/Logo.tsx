'use client';

export default function Logo({ className = "", light = false }: { className?: string, light?: boolean }) {
  const textColor = light ? 'text-white' : 'text-black';
  
  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className="flex items-baseline">
        <span className={`text-3xl font-black tracking-tight ${textColor}`}>E</span>
        <span className="relative inline-flex items-center justify-center mx-[-1px]">
          {/* Stylized Orange V */}
          <svg 
            width="28" 
            height="28" 
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
        <span className={`text-3xl font-black tracking-tight ${textColor} ml-[-2px]`}>
          enteev
        </span>
      </div>
    </div>
  );
}
