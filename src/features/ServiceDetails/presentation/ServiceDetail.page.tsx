import { useState } from "react";
import ServiceDetailBreadcrumb from "./components/ServiceDetailBreadcrumb";
import ServiceDetailCards from "./components/ServiceDetailCards";
import ServiceDetailFilter from "./components/ServiceDetailFilter";
import ServiceDetailHeader from "./components/ServiceDetailHeader";

import CommonFaq from "@/components/common/CommonFaq";

import type{ SortKey, FilterKey } from "../domain/entities/filterkeys";

export default function ServiceDetailPage() {
  
const [activeFilter, setActiveFilter] =
    useState<FilterKey>("All Services");

  const [sortBy, setSortBy] =
    useState<SortKey>("Recommended");

  return (
    <>
      <ServiceDetailBreadcrumb />
      <ServiceDetailHeader />

      <ServiceDetailFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <ServiceDetailCards
        activeFilter={activeFilter}
        sortBy={sortBy}
       
      />

      <CommonFaq />
    </>
  );
}
