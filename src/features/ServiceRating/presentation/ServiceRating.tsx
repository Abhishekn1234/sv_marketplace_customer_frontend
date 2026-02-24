import JobProgressNavbar from "@/features/JobProgress/presentation/components/JobProgressNavbar";

import SuccessProviderCard from "./components/SuccessProviderCard";



export default function ServiceRating() {
  return (
    <div className="min-h-screen overflow-y-auto">
      <JobProgressNavbar />
      <SuccessProviderCard />
    </div>
  );
}
