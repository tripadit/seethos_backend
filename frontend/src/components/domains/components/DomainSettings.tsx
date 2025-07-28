import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

import { AddIcon } from '@/assets/icons';
import { CTooltip } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

import { useGetAllDomains } from '../hooks/hooks';
import AddDomainDialog from './AddDomainDialog';
import DeleteDomainAction from './DeleteDomainAction';
import DomainDetailsDialog from './DomainDetailsDialog';
interface IDomain {
  id: string;
  domain: string;
  dkim_key: string;
  txt_record: string;
  mx_record: string;
  domain_verified: boolean;
  mx_verified: boolean;
}

export default function DomainSettings() {
  const { data, isLoading } = useGetAllDomains();

  const [open, setOpen] = useState(false);

  const columns: ColumnDef<IDomain>[] = [
    {
      accessorKey: 'domain',
      header: 'Domain',
      cell: ({ row }) => <div className="font-medium">{row.original.domain}</div>,
    },
    {
      accessorKey: 'domain_verified',
      header: 'Domain Verified',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.domain_verified ? 'Yes' : 'No'}</div>
      ),
    },
    {
      accessorKey: 'mx_verified',
      header: 'MX Verified',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.mx_verified ? 'Yes' : 'No'}</div>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-center items-center font-medium">
          <CTooltip text="View Lead List">
            <DomainDetailsDialog domain={row.original} />
          </CTooltip>
          <CTooltip text="Delete List">
            <DeleteDomainAction id={row!.original!.id} />
          </CTooltip>
        </div>
      ),
    },
  ];

  return (
    <Card className="flex-1 p-10 flex flex-col gap-10">
      <CardTitle>Domain Settings</CardTitle>
      <CardContent className="px-0">
        <TableTemplate
          title={
            <div className="w-full flex justify-between items-center">
              <p>Domains</p>
              <div>
                <Button
                  className="capitalize bg-purple-500 text-white gap-3"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <AddIcon /> <p>Add Domain</p>
                </Button>
              </div>
            </div>
          }
          isLoading={isLoading}
          isHideDownloadCSV
          onSearch={() => {}}
          columns={columns}
          data={data?.data || []}
          hideSearch
        />
      </CardContent>

      <AddDomainDialog open={open} setOpen={setOpen} />
    </Card>
  );
}
