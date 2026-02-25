import LoginCard from "./LoginCard";

import Footer from "@/components/common/CommonFooter";
import CommonNavbar from "@/components/common/CommonNavbar";

export default function LoginLayout() {
  const features = [
    { label: "Vetted Experts" },
    { label: "Secure Payment" },
    { label: "Quality Guarantee" },
  ];

  const links = [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Cookie Policy", to: "/cookies" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CommonNavbar
        title="HomeEase"
        rightButton={{ label: "Sign Up", to: "/register", variant: "primary" }}
        showUserControls={false} 
      />

      <main className="flex flex-col items-center px-6 py-10 flex-grow">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-8 shadow-sm">
          <span className="w-2 h-2 bg-warning rounded-full"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Premium Home Services
          </span>
        </div>

        <LoginCard />
      </main>

      <Footer
        features={features}
        links={links}           // ✅ added links here
        showDivider
        backdropBlur={false}
        iconColor="text-warning"
      />
    </div>
  );
}