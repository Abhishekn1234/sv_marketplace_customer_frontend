import { useParams } from "react-router-dom";

import { useLanguage } from "@/features/context/LanguageContext";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

export default function ServiceDetailHeader() {
  const { id } = useParams<{ id: string }>();
  const { localize, lang:language } = useLanguage();

  const {
    categories,
    loading,
    error,
  } = useServices({
    categoryId: id,
    
    language:language,
  });


  if (loading) {
    return <CommonSpinner  center />;
  }

  if (error) {
    return (
      <p className="text-red-500">
        Failed to load category.
      </p>
    );
  }

  const category = categories?.[0];

  if (!category) {
    return <p>Service not found</p>;
  }

  return (
    <div className="mb-8">
      <h1 className="mb-3 text-[42px] font-bold tracking-[-0.02em] text-gray-900">
        {localize(category.name)}
      </h1>

      <p className="max-w-[600px] text-lg font-medium leading-relaxed text-gray-500">
        {localize(category.description)}
      </p>
    </div>
  );
}