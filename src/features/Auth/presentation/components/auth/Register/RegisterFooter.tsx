import React from 'react';

const RegisterFooter = () => {
  const features = [
    { label: 'Vetted Experts' },
    { label: 'Eco-Friendly' },
    { label: '24/7 Support' },
  ];

  return (
    <footer className="py-10 border-t border-gray-200 bg-white/50">
      <div className="flex justify-center items-center gap-12 mb-6 flex-wrap">
        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {feature.label}
              </span>
            </div>
            {index < features.length - 1 && (
              <div className="hidden sm:block w-px h-4 bg-gray-200"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 font-medium tracking-wider">
        © 2024 HomeEase Services Inc. All rights reserved.
      </p>
    </footer>
  );
};

export default RegisterFooter;
