import { useState } from "react";
import BookingHistoryContents from "./components/BookingHistoryContents";
import BookingHistoryFilter from "./components/BookingHistoryFilter";
import BookingHistoryHeader from "./components/BookingHistoryHeader";
import PageContainer from "@/components/common/PageContainer";
import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import LoginRequired from "@/components/common/LoginRequired";

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState<string>("All");
 const {isRTLOrder,t}=useLanguage();
 const {accessToken}=useAuthStore();

  if (!accessToken) {
    return (
      <PageContainer className="py-6 sm:py-8 lg:py-10">
        <LoginRequired
          title={t.loginRequired.bookinghistorytitle}
          description={t.loginRequired.bookinghistorydescription}
        />
      </PageContainer>
    );
  }
  return (
    <PageContainer className="py-6 sm:py-8 lg:py-10">
      <div className="space-y-6">
        <div dir={isRTLOrder?"rtl":""}>
        <BookingHistoryHeader />
         </div>
        <BookingHistoryFilter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <BookingHistoryContents activeTab={activeTab} />
      </div>
    </PageContainer>
  );
}
