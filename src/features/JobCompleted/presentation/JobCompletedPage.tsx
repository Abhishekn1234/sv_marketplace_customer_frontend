
import SuccessSection from "./components/Successsection";
import JobCompletedSummary from "./components/JobCompletedSummary";
import JobCompletedProvider from "./components/JobCompletedProvider";
import JobCompletedActions from "./components/JobCompletedActions";


export default function JobCompletedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
    

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <SuccessSection />
        <JobCompletedSummary />
        <JobCompletedProvider />
        <JobCompletedActions />
      </div>
    </div>
  );
}
