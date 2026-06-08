import PageContainer from "@/components/common/PageContainer";
import NotificationCards from "./components/NotificationCards";

export default function NotificationsPage() {
  return (
    <PageContainer className="py-4 sm:py-6 lg:py-8">
      <NotificationCards />
    </PageContainer>
  );
}

