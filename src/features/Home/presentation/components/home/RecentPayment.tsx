

export default function SecurePayment() {
  return (
    <div className="flex items-center gap-3.5 p-4 rounded-xl cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 bg-green-50 hover:bg-green-100 hover:shadow-lg">
      {/* Icon */}
      <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-110 bg-green-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5.5 h-5.5 text-green-600"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold uppercase tracking-wide mb-0.5 text-green-600">
          Secure Payment
        </div>
        <div className="text-sm text-gray-500">
          256-bit SSL Encrypted
        </div>
      </div>
    </div>
  );
}
