import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/features/context/LanguageContext";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { ChevronRightIcon, ColumnsIcon } from "@/components/icons";

export default function ServiceTierSelectionBreadCrumb() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, localize, lang } = useLanguage();

  const {
    services = [],
    loading: isPending,
    error,
  } = useServices({
    language: lang,
  });

  const service = useMemo(
    () => services.find((s: any) => s._id === id),
    [services, id]
  );

  if (isPending) {
    return <CommonSpinner />;
  }

  if (error) {
    return null;
  }

  return (
    <div className="w-full px-0 lg:px-8 py-6 mt-10">
      {/* Breadcrumb */}
      <nav className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 mb-6">
        <Button
          onClick={() => navigate(-1)}
          className="cursor-pointer text-black transition-colors hover:text-blue-600"
        >
          {t.servicetierselectionpage.steps.service}
        </Button>

        <ChevronRightIcon />

        <span className="font-semibold text-gray-900">
          {t.servicetierselectionpage.steps.selectTier}
        </span>

        <ChevronRightIcon />

        <span className="text-black">
          {t.servicetierselectionpage.steps.schedule}
        </span>
      </nav>

      {/* Service Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-3 rounded-full border-2 border-gray-200 bg-white px-4 py-2 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <ColumnsIcon />
          </div>

          <span className="text-sm font-bold text-gray-900">
            {service ? localize(service.name) : "Service"}
          </span>
        </div>
      </div>
    </div>
  );
}