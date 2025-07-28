import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SearchNotFound } from '@/assets/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  handleRowClick?: (row: Row<TData>) => void;
  totalCount?: number;
  defaultPagination?: { pageIndex: number; pageSize: number };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  isFetchingMore?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  handleRowClick,
  totalCount,
  defaultPagination,
  onPaginationChange,
  isFetchingMore,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState(
    defaultPagination || {
      pageIndex: 1,
      pageSize: 20,
    },
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    pageCount: totalCount ? Math.ceil((totalCount || 0) / pagination.pageSize) + 1 : undefined,
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    onPaginationChange && onPaginationChange(pagination);
  }, [pagination]);

  return (
    <div className="pb-2">
      <div className="rounded-md border ">
        {!isLoading && (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="bg-[#F9FAFB] border-x border-gray-200" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={cn({ 'cursor-pointer': handleRowClick })}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick?.(row);
                      }}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="text-[#667085] text-xs" key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {isFetchingMore && (
                    <TableRow
                      key={'loading'}
                      className={cn({ 'cursor-pointer': handleRowClick })}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {table
                        .getRowModel()
                        .rows[0].getVisibleCells()
                        .map((cell) => (
                          <TableCell className="text-[#667085] text-xs" key={cell.id}>
                            <Skeleton className="bg-gray-200 w-full h-5" />
                          </TableCell>
                        ))}
                    </TableRow>
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex mb-6 justify-center">
                      <SearchNotFound />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-700">No data found!</h4>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        {isLoading && (
          <div className="flex flex-col items-center justify-center">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="p-12 flex flex-col items-center gap-2">
              <Loader2 className="animate-spin" />
              <p>Loading...</p>
            </div>
          </div>
        )}
      </div>
      {!!totalCount && totalCount > 10 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex gap-2 items-center">
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPagination({ pageIndex: 1, pageSize: parseInt(value, 10) });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((item) => (
                  <SelectItem key={item} value={item.toString()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm font-medium text-[#344054]">
              {(pagination.pageIndex - 1) * pagination.pageSize + 1} -{' '}
              {totalCount < pagination.pageIndex * pagination.pageSize
                ? totalCount
                : pagination.pageIndex * pagination.pageSize}{' '}
              of {totalCount} results
            </span>
          </div>
          <div className="flex gap-2">
            <PaginationPages
              currentPage={table.getState().pagination.pageIndex}
              totalPages={table.getPageCount() - 1}
              onPageChange={(pageNumber) => table.setPageIndex(pageNumber)}
            />
          </div>
          <div />
        </div>
      )}
    </div>
  );
}

interface IPaginationPagesProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const PaginationPages = ({ currentPage, totalPages, onPageChange }: IPaginationPagesProps) => {
  return (
    <>
      {getPaginationArray(currentPage, totalPages).map((item) => (
        <PageItem
          key={item.toString()}
          pageNumber={item}
          active={currentPage.toString() === item.toString()}
          onClick={(pageNumber) => {
            onPageChange(pageNumber);
          }}
        />
      ))}{' '}
    </>
  );
};

const PageItem = ({
  pageNumber,
  active,
  onClick,
}: {
  pageNumber: number | string;
  active: boolean;
  onClick: (pageNumber: number) => void;
}) => {
  return (
    <div
      onClick={() => {
        if (typeof pageNumber === 'string') return;
        onClick(pageNumber);
      }}
      className={cn(
        'rounded p-2  h-10 w-10 flex items-center   justify-center',
        active ? 'bg-purple-50 text-purple-600' : 'text-[#667085]',
        typeof pageNumber === 'string'
          ? 'text-gray-500'
          : 'hover:bg-purple-50 cursor-pointer hover:text-purple-600 active:bg-pruple-200',
      )}
    >
      {pageNumber}
    </div>
  );
};

function getPaginationArray(currentPage: number, totalPages: number) {
  const paginationNumbers = [];
  const paginationRange = 1;

  const addPageNumbers = (start: number, end: number) => {
    for (let i = start; i <= end; i++) {
      paginationNumbers.push(i);
    }
  };

  addPageNumbers(1, Math.min(2, totalPages));

  if (currentPage > 4) {
    paginationNumbers.push('...');
  }
  const start = Math.max(currentPage - paginationRange, 3);
  const end = Math.min(currentPage + paginationRange, totalPages - 2);
  addPageNumbers(start, end);

  if (currentPage < totalPages - 3) {
    paginationNumbers.push('...');
  }

  addPageNumbers(Math.max(totalPages - 1, 3), totalPages);

  return paginationNumbers;
}
