
import ServiceTierSelectionBreadCrumb from "./components/ServiceTierSelectionBreadCrumb";
import ServiceTierSelectionContent from "./components/ServiceTierSelectionContent";

import ServiceTierSelectionTitleDescription from "./components/ServiceTierSelectionTitleDescription";

import CommonFaq from "@/components/common/CommonFaq";




export default function ServiceTierSelectionPage() {
  return (
   <>
   <div>
   <ServiceTierSelectionBreadCrumb/>
   <ServiceTierSelectionTitleDescription/>
   <ServiceTierSelectionContent/>
   <CommonFaq/>
   </div>

   </>
  );
}