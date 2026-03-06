import PageContainer from "@/components/common/PageContainer";
import JobTrackingContent from "./components/JobTrackingContent";
import JobTrackingHeader from "./components/JobTrackingHeader";

export default function JobTrackingPage(){
    return(
       <>
       <PageContainer>
         <JobTrackingHeader/>
       <JobTrackingContent/>
       </PageContainer>
      
       </>
    )
}