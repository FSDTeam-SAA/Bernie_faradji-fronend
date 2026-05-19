"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: number[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, -1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          -1,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          -1,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          -1,
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-end mt-4 gap-2">
      {/* Previous Button */}
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        variant="outline"
        className="w-10 h-10 p-0 rounded-md"
      >
        &lt;
      </Button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, idx) =>
        page === -1 ? (
          <span
            key={idx}
            className="w-10 h-10 flex items-center justify-center text-gray-400"
          >
            ...
          </span>
        ) : (
          <Button
            key={idx}
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 p-0 rounded-md transition-all duration-200 ${
              page === currentPage
                ? "bg-[#1D2B4F] text-white hover:bg-[#1D2B4F]"
                : ""
            }`}
          >
            {page}
          </Button>
        )
      )}

      {/* Next Button */}
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        variant="outline"
        className="w-10 h-10 p-0 rounded-md"
      >
        &gt;
      </Button>
    </div>
  );
};