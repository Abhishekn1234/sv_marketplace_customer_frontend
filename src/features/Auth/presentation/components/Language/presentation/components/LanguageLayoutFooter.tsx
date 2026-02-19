export default function LanguageLayoutFooter() {
  return (
    <footer className="py-10 border-t border-[#E2E8F0] bg-white/50">
      <div className="max-w-7xl mx-auto px-6 font-['Plus_Jakarta_Sans']">
        {/* Features row */}
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-6 text-[#64748B] mb-6">
          {/* Vetted Experts */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#D4AF37] text-2xl">
              verified
            </span>
            <span className="text-xs font-bold tracking-widest uppercase">
              Vetted Experts
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-[#E2E8F0]" />

          {/* Premium Quality */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#D4AF37] text-2xl">
              workspace_premium
            </span>
            <span className="text-xs font-bold tracking-widest uppercase">
              Premium Quality
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-[#E2E8F0]" />

          {/* 24/7 Support */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#D4AF37] text-2xl">
              support_agent
            </span>
            <span className="text-xs font-bold tracking-widest uppercase">
              24/7 Support
            </span>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-[#94A3B8] text-xs font-medium tracking-wide text-center">
          © 2024 HomeEase Premium Services Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
