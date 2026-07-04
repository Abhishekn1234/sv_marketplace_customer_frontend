import { useMemo } from "react";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/features/context/LanguageContext";
import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import {  ChevronRightIcon, ColumnsIcon } from "@/components/icons";

export default function ServiceTierSelectionBreadCrumb() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: apiResponse, isPending } = useServiceCategory();
  const {t}=useLanguage();
 
  const services = useMemo(() => {
    return apiResponse?.flatMap((category: any) => category.services) ?? [];
  }, [apiResponse]);

  const serviceName =
    services.find((s: any) => s._id === id)?.name || "Service";

  if (isPending) {
    return <CommonSpinner/>
  }

  return (
    <div className="w-full px-0 lg:px-8 py-6 mt-10">
      {/* Breadcrumb */}
      <nav className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 mb-6">
        <Button
          onClick={() => navigate(-1)}
          className="hover:text-blue-600 transition-colors cursor-pointer text-black"
        >
          {t.servicetierselectionpage.steps.service}
        </Button>

        <ChevronRightIcon />

        <span className="text-gray-900 font-semibold">{t.servicetierselectionpage.steps.selectTier}</span>

        <ChevronRightIcon/>

        <span className="text-black">{t.servicetierselectionpage.steps.schedule}</span>
      </nav>

      {/* Service Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border-2 border-gray-200 rounded-full shadow-sm">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
           <ColumnsIcon/>
          </div>

          <span className="text-sm font-bold text-gray-900">
            {serviceName}
          </span>
        </div>
      </div>
    </div>
  );
}

