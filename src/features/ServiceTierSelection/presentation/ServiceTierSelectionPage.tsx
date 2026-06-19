
import { useLanguage } from "@/features/context/LanguageContext";
import ServiceTierSelectionBreadCrumb from "./components/ServiceTierSelectionBreadCrumb";
import ServiceTierSelectionContent from "./components/ServiceTierSelectionContent";

import ServiceTierSelectionTitleDescription from "./components/ServiceTierSelectionTitleDescription";

import CommonFaq from "@/components/common/CommonFaq";




export default function ServiceTierSelectionPage() {
  const{isRTLOrder}=useLanguage();
  return (
   <>
   <div dir={isRTLOrder?"rtl":""}>
   <ServiceTierSelectionBreadCrumb/>
   <ServiceTierSelectionTitleDescription/>
   <ServiceTierSelectionContent/>
   <CommonFaq/>
   </div>

   </>
  );
}