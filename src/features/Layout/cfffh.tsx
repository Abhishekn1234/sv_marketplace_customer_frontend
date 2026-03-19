// import { Outlet, useLocation } from "react-router-dom";
// import { useAuthStore } from "../core/store/auth";

// import BottomNav from "./BottomNav";
// import CommonNavbar from "@/components/common/CommonNavbar";
// import Footer from "@/components/common/CommonFooter";
// import ProgressStepper from "../../components/common/ProgressStepper";
// import LanguageModal from "../Languageandlocationselectingmodalafterlogin/presentation/components/LangaugeModal";
// import LocationModal from "../Languageandlocationselectingmodalafterlogin/presentation/components/LocationModal";

// interface Props {
//   children?: React.ReactNode;
// }

// export default function DashboardLayout({ children }: Props) {
//   const { pathname } = useLocation();
//   const { language, current_location } = useAuthStore();

//   const isLoginPage = pathname === "/login";
//   const isRegisterPage = pathname === "/register";
//   const isForgotPage = pathname === "/forgot-password";
//   const isVerificationPage = pathname === "/verification";

//   const isAuthPage =
//     isLoginPage ||
//     isRegisterPage ||
//     isForgotPage ||
//     isVerificationPage;

//   const isConfirmationPage = pathname.startsWith("/confirmation/");

//   // Show modals if missing language or location
//   const showLanguageModal = !language || language === "";
//   const showLocationModal =
//     !current_location || !current_location.addresses?.length;

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900 relative flex flex-col">
//       <CommonNavbar
//         showUserControls={!isAuthPage}
//         showHomeLinks={!isAuthPage}
//       />

//       {(isRegisterPage || showLanguageModal || showLocationModal) && (
//         <ProgressStepper />
//       )}

//       <main className="flex-1 mx-auto max-w-7xl px-4 py-6 pb-24 w-full relative">
//         {children || <Outlet />}

//         {/* Language modal shows first */}
//         {showLanguageModal && <LanguageModal />}

//         {/* Location modal shows only if language exists */}
//         {!showLanguageModal && showLocationModal && <LocationModal />}
//       </main>

//       {!isAuthPage && !isConfirmationPage && <BottomNav />}

//       <Footer backdropBlur={pathname.startsWith("/confirmation/")} />
//     </div>
//   );
// }