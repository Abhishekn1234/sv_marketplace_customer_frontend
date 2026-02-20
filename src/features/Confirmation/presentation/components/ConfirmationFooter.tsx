const ConfirmationFooter = () => {
  return (
    <footer className="px-6 sm:px-8 py-10 
                       border-t border-gray-200 
                       bg-white/50 backdrop-blur-sm">

      {/* Features */}
      <div className="flex flex-col sm:flex-row 
                      justify-center items-center 
                      gap-6 sm:gap-12 
                      mb-6">

        {/* Feature 1 */}
        <div className="flex items-center gap-2 
                        text-xs font-bold uppercase 
                        tracking-widest text-gray-500">
          <CheckIcon />
          <span>Vetted Experts</span>
        </div>

        <Divider />

        {/* Feature 2 */}
        <div className="flex items-center gap-2 
                        text-xs font-bold uppercase 
                        tracking-widest text-gray-500">
          <CheckIcon />
          <span>Service Guarantee</span>
        </div>

        <Divider />

        {/* Feature 3 */}
        <div className="flex items-center gap-2 
                        text-xs font-bold uppercase 
                        tracking-widest text-gray-500">
          <CheckIcon />
          <span>24/7 Support</span>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-xs 
                    text-gray-400 font-medium 
                    tracking-wide">
        © 2024 HomeEase Premium Services Inc. All rights reserved.
      </p>

    </footer>
  );
};

export default ConfirmationFooter;
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-5 h-5 text-amber-500"
  >
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const Divider = () => (
  <div className="hidden sm:block 
                  w-px h-4 
                  bg-gray-200" />
);
