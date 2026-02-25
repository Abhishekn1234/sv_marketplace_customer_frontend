import React from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  features?: { label: string }[];       // List of feature labels
  links?: { label: string; to: string }[]; // Optional links
  showDivider?: boolean;                // Show vertical divider between features
  backdropBlur?: boolean;               // Enable backdrop blur
  className?: string;                   // Additional custom styles
  iconColor?: string;                   // Color for icons
}

const Footer: React.FC<FooterProps> = ({
  features = [
    { label: "Vetted Experts" },
    { label: "Service Guarantee" },
    { label: "24/7 Support" },
  ],
  links = [],                // default empty
  showDivider = true,
  backdropBlur = false,
  className = "",
  iconColor = "text-amber-500",
}) => {
  const blurClass = backdropBlur ? "backdrop-blur-sm bg-white/50" : "bg-white/50";

  return (
    <footer className={`px-6 sm:px-8 py-10 border-t border-gray-200 ${blurClass} ${className}`}>
      
      {/* Optional Links */}
      {links.length > 0 && (
        <div className="flex justify-center gap-8 mb-6 flex-wrap">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="text-sm font-semibold text-gray-400 hover:text-primary-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Features */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 mb-6">
        {features.map((feature, idx) => (
          <React.Fragment key={feature.label}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              <CheckIcon color={iconColor} />
              <span>{feature.label}</span>
            </div>
            {showDivider && idx !== features.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>

      {/* Footer Text */}
      <p className="text-center text-xs text-gray-400 font-medium tracking-wide">
        © 2024 HOMEEASE SERVICES INC. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

// ✅ Subcomponents
const CheckIcon: React.FC<{ color?: string }> = ({ color = "text-amber-500" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`w-5 h-5 ${color}`}
  >
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Divider = () => <div className="hidden sm:block w-px h-4 bg-gray-200" />;