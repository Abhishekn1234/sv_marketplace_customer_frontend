import PageContainer from "@/components/common/PageContainer";
import JobProgressContents from "./components/JobProgressContents";
import JobProgressHeader from "./components/JobProgressHeader";


export default function JobProgressPage() {
    return(
        <>
        <PageContainer>
             <JobProgressHeader/>
        <JobProgressContents/>
        </PageContainer>
       
        </>
    )
}