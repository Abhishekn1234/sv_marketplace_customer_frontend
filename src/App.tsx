import { ThemeProvider } from "./features/context/themeContext";
import { LanguageProvider } from "./features/context/LanguageContext";
import { ToastContainer } from "react-toastify";

import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { useAuthStore } from "./features/core/store/auth";
import { useRegisterDeviceToken } from "./features/Notifications/presentation/hooks/useRegisterDeviceToken";

import ScrollToTop from "./ScrollToTop";
import NotificationNavigation from "./NavigationNotification";
import AppRoutes from "./AppRoutes";
import { useIsMobile } from "./hooks/use-mobile";

function App() {
  const { accessToken, isLoggedIn } = useAuthStore();
  useRegisterDeviceToken(Boolean(isLoggedIn && accessToken));
  const isMobile = useIsMobile();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ScrollToTop />
        <NotificationNavigation />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="light"
          toastStyle={{
            width: isMobile ? "calc(100vw - 24px)" : "380px",
            maxWidth: "100%",
          }}
        />

        <AppRoutes />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
