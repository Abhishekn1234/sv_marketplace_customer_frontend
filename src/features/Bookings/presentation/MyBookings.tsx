import { useState } from "react";
import BookingHistoryContents from "./components/BookingHistoryContents";
import BookingHistoryFilter from "./components/BookingHistoryFilter";
import BookingHistoryHeader from "./components/BookingHistoryHeader";

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState<string>("All");

  return (
    <>
      <BookingHistoryHeader />
      <BookingHistoryFilter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <BookingHistoryContents activeTab={activeTab} />
    </>
  );
}

