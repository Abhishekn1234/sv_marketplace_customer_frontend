import JobProgressContents from "./components/JobProgressContents";
import JobProgressHeader from "./components/JobProgressHeader";
import JobProgressNavbar from "./components/JobProgressNavbar";

export default function JobProgressPage() {
    return(
        <>
        <JobProgressNavbar/>
        <JobProgressHeader/>
        <JobProgressContents/>
        </>
    )
}