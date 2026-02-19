import React from "react";

import PrivacyContent from "../presentation/components/PrivacyContent";


import CommonFaq from "@/components/common/CommonFaq";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="">
     
      <PrivacyContent />
     
      <CommonFaq />
    </div>
  );
};

export default PrivacyPolicyPage;
