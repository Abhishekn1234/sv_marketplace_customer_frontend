import PageContainer from "@/components/common/PageContainer";
import NotificationCards from "./components/NotificationCards";

export default function NotificationsPage() {
  return (
    <PageContainer className="w-full px-0 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <NotificationCards />
      </div>
    </PageContainer>
  );
}