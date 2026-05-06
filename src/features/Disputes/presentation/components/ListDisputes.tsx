import { useState } from "react";
import CommonCard from "@/components/common/CommonCards";
import { useGetDispute } from "../hooks/useGetDispute";
import type { GetDisputesQueryParams } from "../../domain/entities/getdisputesparams";
import { Input } from "@/components/input";
import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

export default function ListDisputes() {
  const [filters, setFilters] = useState<GetDisputesQueryParams>({
    page: 1,
    limit: 10,
    sort: "createdAt:desc",
    search: "",
  });

  const { data, isLoading, isError } = useGetDispute(filters);

  if (isLoading) return <CommonSpinner/>;
  if (isError) return <p>Failed to load disputes</p>;

  return (
    <div className="space-y-4">
      {/* 🔹 Simple filter UI (you can enhance later) */}
      <div className="flex gap-3">
        <Input
          className="border p-2 rounded"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              search: e.target.value,
              page: 1, // reset page on search
            }))
          }
        />
      </div>

      {/* 🔹 List */}
      <div className="grid gap-3">
        {data?.data.map((item) => (
          <CommonCard key={item._id}>
            <div className="p-3 space-y-1">
              <h3 className="font-semibold">
                Reason: {item.reason}
              </h3>

              <p className="text-sm text-gray-600">
                {item.description}
              </p>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Status: {item.status}</span>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </CommonCard>
        ))}
      </div>

      {/* 🔹 Pagination */}
      <div className="flex gap-2 mt-4">
        <Button
          disabled={filters.page === 1}
          onClick={() =>
            setFilters((p) => ({ ...p, page: (p.page || 1) - 1 }))
          }
          className="px-3 py-1 border rounded"
        >
          Prev
        </Button>

        <Button
          disabled={!data?.pagination?.hasNextPage}
          onClick={() =>
            setFilters((p) => ({ ...p, page: (p.page || 1) + 1 }))
          }
          className="px-3 py-1 border rounded"
        >
          Next
        </Button>
      </div>
    </div>
  );
}