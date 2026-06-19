import CommonFaq from "@/components/common/CommonFaq";
import BookingDetailBreadCrumb from "./components/BookingDetailBreadCrumb";

import BookingDetailHeader from "./components/BookingDetailHeader";
import { useLanguage } from "@/features/context/LanguageContext";

export default function BookingDetailPage(){
    const {isRTLOrder}=useLanguage();
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