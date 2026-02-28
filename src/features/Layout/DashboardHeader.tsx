import { useLocation } from "react-router-dom";
import { useAuthStore } from "../core/store/auth";


import RegisterHeader from "./RegisterHeader";
import LoginHeader from "./LoginHeader";
import HomeHeader from "./HomeHeader";




export default function DashboardHeader() {
  const location = useLocation();
  const customerData = useAuthStore((s) => s.user);
  const user = customerData;

  const pathname = location.pathname;


  if (user) {
    return <HomeHeader />;
  }
  

 
  if (["/register", "/language", "/location"].includes(pathname)) {
    return <RegisterHeader />;
  }


  return <LoginHeader />;
}
