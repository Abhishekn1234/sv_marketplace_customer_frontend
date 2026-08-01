import { Link, useParams } from "react-router-dom";
import { ChevronRightIcon } from "@/components/icons";
import { useLanguage } from "@/features/context/LanguageContext";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";

export default function ServiceDetailBreadcrumb() {
  const { id } = useParams();
  const { t, localize, lang } = useLanguage();

  const { services = [] } = useServices({
    categoryId: id,
    language: lang,
  });

  const categoryName =
    services.length > 0
      ? localize(services[0].category?.name)
      : "";

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm font-medium">
      <Link
        to="/"
        className="text-gray-400 transition-colors hover:text-blue-600"
      >
        {t.servicedetailpage.breadcrumb.Home}
      </Link>

      <ChevronRightIcon />

      <span className="font-semibold text-gray-900">
        {categoryName}
      </span>
    </nav>
  );
}