import { useLanguage } from "@/features/context/LanguageContext";

export const useNotificationFilters = () => {
  const { t } = useLanguage();

  return [
    { label: t.notificationpage.filters.All, value: undefined },
    {
      label: t.notificationpage.filters.Requested,
      value: "BOOKING_REQUEST",
    },
    {
      label: t.notificationpage.filters.Updates,
      value: "BOOKING_UPDATE",
    },
    {
      label: t.notificationpage.filters.Admin,
      value: "ADMIN_MESSAGE",
    },
  ];
};