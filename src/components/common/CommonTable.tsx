"use client";

import { type ReactNode, useState, useMemo } from "react";
import Button from "../input/Button";

type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
};

type CommonTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  emptyText?: string;
  pageSize?: number;
};

export default function CommonTable<T>({
  data,
  columns,
  emptyText = "No data found",
  pageSize = 5,
}: CommonTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  // Slice data for current page
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      
      {/* Table */}
      <div className="w-full overflow-x-auto border rounded-xl">
        <table className="w-full text-sm text-left">
          
          {/* Header */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 py-3">
                      {col.render
                        ? col.render(row)
                        : (row[col.accessor as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > pageSize && (
        <div className="flex items-center justify-between mt-4 px-2">
          
          {/* Info */}
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-2">
            
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 border rounded-md text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Next
            </Button>

          </div>
        </div>
      )}
    </div>
  );
}