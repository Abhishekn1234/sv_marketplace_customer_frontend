import CommonFaq from "@/components/common/CommonFaq";
import BookingDetailBreadCrumb from "./components/BookingDetailBreadCrumb";

import BookingDetailHeader from "./components/BookingDetailHeader";
import { useLanguage } from "@/features/context/LanguageContext";
// import useDisableBackButton from "@/components/common/usePreventBackNavigation";

export default function BookingDetailPage(){
    const {isRTLOrder}=useLanguage();
        // useDisableBackButton();
    return(
        <>
                <div
        dir={isRTLOrder ? "rtl" : "ltr"}
        className={isRTLOrder ? "text-right" : "text-left"}
        >
        <BookingDetailBreadCrumb />
        <BookingDetailHeader />
        </div>
        <CommonFaq/>
       
        </>
    )
}