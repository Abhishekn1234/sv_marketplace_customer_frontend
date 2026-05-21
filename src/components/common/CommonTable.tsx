"use client";

import { type ReactNode, useState, useMemo } from "react";
import Button from "../input/Button";

export type Column<T> = {
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
    <div
      className="
        overflow-hidden
        
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header */}
          <thead>
            <tr
              className="
                bg-gradient-to-r
                from-gray-50
                to-gray-100
                border-b
                border-gray-200
              "
            >
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="
                    px-5
                    py-4
                    text-left
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                    whitespace-nowrap
                  "
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="
                    py-10
                    text-center
                    text-sm
                    text-gray-400
                  "
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr
                  key={i}
                  className="
                    border-b
                    border-gray-100
                    transition-all
                    duration-200
                    hover:bg-blue-50/40
                  "
                >
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className="
                        px-5
                        py-4
                        text-sm
                        text-gray-700
                        align-middle
                      "
                    >
                      {col.render
                        ? col.render(row)
                        : (
                            row[
                              col.accessor as keyof T
                            ] as ReactNode
                          )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Pagination */}
    {data?.length > pageSize && (
      <div
        className="
          mt-5
          flex
          items-center
          justify-between
        "
      >
        {/* Info */}
        <div className="text-sm text-gray-500">
          Page{" "}
          <span className="font-semibold text-gray-800">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {totalPages}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Prev */}
          <Button
            onClick={() =>
              goToPage(currentPage - 1)
            }
            disabled={currentPage === 1}
            className="
              rounded-lg
              border
              border-gray-200
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-100
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Prev
          </Button>

          {/* Page Numbers */}
          {Array.from({
            length: totalPages,
          }).map((_, i) => (
            <Button
              key={i}
              onClick={() =>
                goToPage(i + 1)
              }
              className={`
                min-w-[38px]
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                transition-all
                duration-200
                ${
                  currentPage === i + 1
                    ? `
                      bg-blue-600
                      text-white
                      shadow-md
                    `
                    : `
                      border
                      border-gray-200
                      bg-white
                      text-gray-700
                      hover:bg-gray-100
                    `
                }
              `}
            >
              {i + 1}
            </Button>
          ))}

          {/* Next */}
          <Button
            onClick={() =>
              goToPage(currentPage + 1)
            }
            disabled={
              currentPage === totalPages
            }
            className="
              rounded-lg
              border
              border-gray-200
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-100
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Next
          </Button>
        </div>
      </div>
    )}
  </div>
);
}