import {AlertTraingleIcon, HomeIcon } from "@/components/icons";

import { useLanguage } from "@/features/context/LanguageContext";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    const { t } = useLanguage();
    
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="text-center max-w-md w-full">
                {/* Icon with subtle animation */}
                <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-orange-100 rounded-full blur-2xl opacity-50 animate-pulse" />
                    <AlertTraingleIcon
                        size={80}
                        className="relative text-orange-500 mx-auto"
                    />
                </div>

                {/* Main 404 with gradient */}
                <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent tracking-tight">
                    404
                </h1>

                {/* Title with better spacing */}
                <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    {t.common.NotFoundTitle || "Page Not Found"}
                </h2>

                {/* Description with improved readability */}
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300 max-w-sm mx-auto leading-relaxed">
                    {t.common.NotFoundDescription || "The page you are looking for doesn't exist or has been moved."}
                </p>

                {/* Decorative line */}
                <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto mt-6 rounded-full" />

                {/* Home button with hover effects */}
                <Link
                    to="/"
                    className="group inline-flex items-center gap-2.5 mt-8 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-3.5 text-white font-medium shadow-lg shadow-sky-600/20 hover:shadow-sky-600/40 hover:scale-[1.02] transition-all duration-300 active:scale-95"
                >
                    <HomeIcon size={18} className="group-hover:rotate-[-10deg] transition-transform duration-300" />
                    {t.common.GoToHome || "Go to Home"}
                </Link>

                {/* Optional: Helpful suggestion */}
                <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
                    {t.jobtrackingpage.sections.needHelp} <a href="/help" className="text-sky-600 hover:underline">{t.jobtrackingpage.sections.contactSupport}</a>
                </p>
            </div>
        </div>
    );
}