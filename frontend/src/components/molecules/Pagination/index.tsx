import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IPagination {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<IPagination> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (totalPages > 6 && currentPage > 3) {
      if (endPage === totalPages) {
        startPage = endPage - 4;
      } else {
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <ul className="pagination flex gap-4">
      {currentPage > 1 && (
        <Button variant="ghost" onClick={() => onPageChange(currentPage - 1)}>
          &laquo;
        </Button>
      )}

      {currentPage > 3 && totalPages > 6 && <Button variant="ghost">&hellip;</Button>}

      {getPageNumbers().map((page) => (
        <Button
          variant="ghost"
          key={page}
          className={cn({ 'bg-primary-50 text-primary-600': page === currentPage })}
        >
          <a onClick={() => onPageChange(page)}>{page}</a>
        </Button>
      ))}

      {totalPages > 6 && currentPage < totalPages - 2 && (
        <Button variant="ghost">
          <span>&hellip;</span>
        </Button>
      )}

      {/* {currentPage < totalPages && (
        <Button variant='ghost'>
          <a onClick={() => onPageChange(currentPage + 1)}>&raquo;</a>
        </Button>
      )} */}
    </ul>
  );
};
