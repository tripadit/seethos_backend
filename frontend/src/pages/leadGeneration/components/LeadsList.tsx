import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { EyeIcon, Pen } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DeleteIcon } from '@/assets/icons';
import { DeleteLeadDialog } from '@/components/dialog/DeleteLeadDialog';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { CTooltip, PageHeader } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';

import { useGetLeads } from '../hooks/leadGeneration';
import { ILead } from './LeadListDetails/LeadListDetails';

interface LeadsListProps {
  // Define the props for your component here
}

const LeadsList: React.FC<LeadsListProps> = () => {
  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();
  const [selected, setSelected] = useState();
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();

  const { data, isLoading } = useGetLeads(pagination);

  const columns: ColumnDef<ILead>[] = [
    {
      accessorKey: 'name',
      header: () => <div>Name</div>,
      cell: ({ row }) => {
        return <div>{row?.original?.name?.toString()}</div>;
      },
    },
    {
      accessorKey: 'email',
      header: () => <div>Email</div>,
      cell: ({ row }: any) => {
        return (
          <div>
            {row?.original?.email && row.original.email.length > 0 && (
              <div className="flex gap-2">
                {row.original.email[0].toString()}{' '}
                {row?.original?.is_last_email_seen !== null && (
                  <div className="relative">
                    <div
                      className={cn(
                        'h-2.5 absolute -left-2 -top-2 w-2.5 rounded-full',
                        row?.original?.is_last_email_seen ? 'bg-green-600' : 'bg-red-600',
                      )}
                    ></div>
                  </div>
                )}
                {!row?.original?.is_subscribed && (
                  <Badge className="ml-2" variant="warning">
                    Unsubscribed
                  </Badge>
                )}{' '}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'phone_number',
      header: () => <div>Phone Number</div>,
      cell: ({ row }: any) => {
        return (
          <div>
            {row?.original?.phone_number && row.original.phone_number.length > 0 && (
              <div>{row.original.phone_number[0].toString()}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'company_name',
      header: () => <div>Company Name</div>,
      cell: ({ row }: any) => {
        return <div>{row?.original?.company_name?.toString()}</div>;
      },
    },
    {
      accessorKey: 'position',
      header: () => <div>Position</div>,
      cell: ({ row }) => {
        return <div className="min-w-[200px]">{row?.original?.position?.toString()}</div>;
      },
    },

    {
      accessorKey: 'status',
      header: () => <div>Email Status</div>,
      cell: ({ row }) => {
        return row?.original?.status === 'UNSENT' ? (
          <Badge variant="warning-light">Pending</Badge>
        ) : (
          <Badge variant="success">Delivered</Badge>
        );
      },
    },
    {
      accessorKey: 'summary',
      header: () => <div>Summary</div>,
      cell: ({ row }: any) => {
        return (
          <div className="max-h-[80px] overflow-hidden truncate max-w-[200px]">
            {row?.original?.summary?.toString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'action',
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }: any) => {
        return (
          <div className="flex justify-center items-center font-medium">
            <CTooltip text="View Lead">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(routes.leadDetails.replace(':id', row.original.id));
                }}
              >
                <EyeIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
              </Button>
            </CTooltip>
            <CTooltip text="Edit">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(routes.leadDetails.replace(':id', row.original.id) + '?edit=true');
                }}
              >
                <Pen className="h-5 w-5 text-gray-500" />
              </Button>
            </CTooltip>
            <CTooltip text="Delete List">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  checkAccount(() => {
                    setSelected(row.original?.id);
                    toggleDialog();
                  });
                }}
              >
                <DeleteIcon className="cursor-pointer" />
              </Button>
            </CTooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader title="Leads List"></PageHeader>
      <TableTemplate
        title={''}
        onSearch={() => {}}
        isLoading={isLoading}
        columns={columns}
        isHideDownloadCSV
        hideSearch
        data={data?.data || []}
        buildCSVData={() => {
          return [];
        }}
        defaultPagination={pagination}
        onPaginationChange={setPagination}
        totalCount={data?.count}
      />
      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}

      <DeleteLeadDialog leadId={selected} isOpen={isOpen} toggleDialog={toggleDialog} />
    </div>
  );
};

export default LeadsList;
