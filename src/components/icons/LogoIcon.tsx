import React from 'react';

export function LogoIcon(_props: React.SVGProps<SVGSVGElement>) {
  return (
     <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
            <path d="M12 2.1L2 9.6v11.3h8.2v-6.5h3.6v6.5H22V9.6L12 2.1z" />
          </svg>
        </div>
  );
}