import { PaginationState, Row } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import React from 'react';
import { CSVLink } from 'react-csv';

import { CTooltip, DataTable, SearchInput } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
interface ITableTemplateProps {
  title?: React.ReactNode;
  columns: any;
  data: any;
  isLoading?: boolean;
  handleRowClick?: (row: Row<any>) => void;
  onSearch: (searchTerm: string) => void;
  buildCSVData?: () => any[];
  isHideDownloadCSV?: boolean;
  hideSearch?: boolean;
  defaultPagination?: PaginationState;
  totalCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  isFetchingMore?: boolean;
}

export const TableTemplate = ({
  columns,
  data,
  title,
  isLoading,
  handleRowClick,
  onSearch,
  buildCSVData = () => [],
  isHideDownloadCSV = false,
  hideSearch,
  defaultPagination,
  totalCount,
  onPaginationChange,
  isFetchingMore,
}: ITableTemplateProps) => {
  return (
    <>
      <Card className="border-none shadow-table ">
        <>
          {title && (
            <>
              <div className="flex items-center w-full gap-4 px-6 py-4">
                <p className="w-full">{title}</p>
              </div>
              <Separator className="mb-4" />
            </>
          )}
          <div className=" flex items-center justify-between px-6 py-4">
            {!hideSearch && (
              <SearchInput
                className="w-96"
                onSearch={onSearch}
                disabled={!data || !data.length || isLoading}
              />
            )}
            {!isHideDownloadCSV && (
              <div className="flex items-center gap-3">
                <CTooltip text="Download CSV">
                  <Button variant="outline" disabled={!data || !data.length || isLoading}>
                    <CSVLink data={buildCSVData()} filename="duality.csv">
                      <Download className="text-gray-700" />
                    </CSVLink>
                  </Button>
                </CTooltip>
              </div>
            )}
          </div>
        </>
        <div className="mx-6">
          <DataTable
            columns={columns}
            isLoading={isLoading}
            handleRowClick={handleRowClick}
            data={data}
            defaultPagination={defaultPagination}
            totalCount={totalCount}
            onPaginationChange={onPaginationChange}
            isFetchingMore={isFetchingMore}
          />
        </div>
      </Card>
    </>
  );
};
