
import VerificationTab from "./components/VerificationTab";


import Footer from "@/components/common/CommonFooter";
import CommonNavbar from "@/components/common/CommonNavbar";

export default function VerificationPage(){
    return(
        <>
       <CommonNavbar rightButton={{ label: "Sign In", to: "/login", variant: "primary" }}/>
        <VerificationTab/>
       <Footer/>
        </>
    )
}