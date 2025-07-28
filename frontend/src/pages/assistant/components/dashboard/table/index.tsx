import { ColumnDef, Row } from '@tanstack/react-table';
import { DownloadIcon, Eye, Pen, RocketIcon } from 'lucide-react';
import { useState } from 'react';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';

import { DeleteIcon } from '@/assets/icons';
import { DeleteBotDialog } from '@/components/dialog';
import { CTooltip } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CONFIG } from '@/global/config.ts';
import { useDeleteBot, useFetchBotInfo, useFetchChatBot } from '@/hooks/api';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { cn, convertDateStringToFormattedDate, getValueOrDefault } from '@/lib/utils';
import { SessionType } from '@/pages/assistant/types/dashbaord';
import { routes } from '@/routes/routes';

export const DashboardTable = () => {
  const [search, setSearch] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [isUpgradeOpen, setIsUpgradeOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  // const { data: conversionData, isLoading: isConversionLoading } = useFetchConversion();

  const { data: chatBotDetail, isLoading, refetch: refetchBotList } = useFetchChatBot(search);
  const { refetch: refetchBotInfo } = useFetchBotInfo();
  const { status, mutate: deleteFn } = useDeleteBot();
  // const { data: personalInfo, isLoading: isFetching, refetch } = useGetCurrentUserInfo();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleDialog = () => {
    setSelected('');
    setIsOpen(!isOpen);
  };

  const { checkAccount } = useCheckAccount();

  const getToolTipText = (status: string) => {
    if (status === 'UNTRAINED') {
      return 'Agent is untrained. Please train the agent before launching.';
    } else if (status === 'TRAINING') {
      return 'Agent is training. Please wait for the agent to finish training before launching.';
    } else if (status === 'TRAINED') {
      return 'Launch Agent';
    }
    return 'Launch Agent';
  };

  const columns: ColumnDef<SessionType>[] = [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected()}
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       onClick={(e) => e.stopPropagation()}
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'name',
      header: () => <div className="">Agent Name</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 font-medium text-gray-500">
            {row.original.avatar ? (
              <img className="w-6 h-6 rounded-full" src={row.original.avatar} alt="agent-avatar" />
            ) : (
              ''
            )}
            <div>
              <p className="max-w-[100px] truncate">
                {getValueOrDefault(row.getValue('name'), '-')}
              </p>
              {row.original.traning_status == 'UNTRAINED' && <p className="text-[10px]">(DRAFT)</p>}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'agent_role',
      header: () => <div className="">Agent Role</div>,
      cell: ({ row }) => (
        <div className="font-medium text-gray-500">
          {row.getValue('agent_role') === ''
            ? '-'
            : getValueOrDefault(row.getValue('agent_role')?.toString()?.split('_').join(' '), '-')}
        </div>
      ),
    },
    {
      accessorKey: 'id',
      header: () => <div className="">Agent Id</div>,
    },

    {
      accessorKey: 'created_at',
      header: () => <div className="">Date Created</div>,
      cell: ({ row }) => (
        <div className="font-medium text-gray-500">
          {convertDateStringToFormattedDate(row.getValue('created_at'))}
        </div>
      ),
    },
    {
      accessorKey: 'session',
      header: () => <div className="">Sessions</div>,
      cell: ({ row }) => (
        <div className="font-medium text-gray-500">
          {getValueOrDefault(row.getValue('session'), 0)}
        </div>
      ),
    },
    {
      accessorKey: 'conversion',
      header: () => <div className="">CTA Clicks</div>,
      cell: ({ row }) => (
        <div className="font-medium text-gray-500">{row.getValue('conversion')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <div className="">Status</div>,
      cell: ({ row }) => (
        <Badge
          variant={row.getValue('status') === true ? 'success' : 'destructive'}
          className="capitalize"
        >
          {row.getValue('status') === true ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'traning_status',
      header: () => <div className="">Traning Status</div>,
      cell: ({ row }) => {
        return (
          <Badge
            variant={
              row.getValue('traning_status') === 'TRAINING'
                ? 'warning'
                : row.getValue('traning_status') === 'UNTRAINED'
                  ? 'destructive'
                  : 'success'
            }
            className="capitalize"
          >
            {row.getValue('traning_status')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'company_name',
      header: () => <div className="">Company Name</div>,
      cell: ({ row }) => (
        <div className="font-medium text-gray-500">{row.getValue('company_name')}</div>
      ),
    },

    {
      accessorKey: 'action',
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center font-medium">
            <CTooltip text={getToolTipText(row.original.traning_status as string)}>
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  row.original.traning_status === 'TRAINED' &&
                    window.open(
                      `https://${row.original.bot_id}.${CONFIG.BOT_DOMAIN}/home`,
                      '_blank',
                    );
                }}
              >
                <RocketIcon
                  className={cn('w-5 h-5 text-gray-300 cursor-pointer', {
                    'text-gray-500': row.original.traning_status === 'TRAINED',
                  })}
                />
              </Button>
            </CTooltip>
            <CTooltip text="View Lead List">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    routes.assistantDetail
                      .replace(':id', row.getValue('id'))
                      .replace(':tabType', 'analytics'),
                  );
                }}
              >
                <Eye className="w-5 h-5 text-gray-500 cursor-pointer" />
              </Button>
            </CTooltip>
            <CTooltip text="Download CSV">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <CSVLink data={buildIndividualCSVData(row)} filename="duality.csv">
                  <DownloadIcon className=" text-gray-500" />
                </CSVLink>
              </Button>
            </CTooltip>
            <CTooltip text="Edit Agent">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  checkAccount(() => {
                    navigate(
                      routes.assistantDetail
                        .replace(':id', row.getValue('id'))
                        .replace(':tabType', 'analytics'),
                    );
                  });
                }}
              >
                <Pen className="w-5 h-5 text-gray-500 cursor-pointer" />
              </Button>
            </CTooltip>
            <CTooltip text="Delete Agent">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  checkAccount(() => {
                    setSelected(row.getValue('id'));
                    setIsOpen(true);
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

  const handleDeleteRow = () => {
    if (selected) {
      deleteFn(selected, {
        onSuccess: () => {
          setSelected('');
          toast({
            variant: 'success',
            title: 'Agent deleted successfully.',
          });
          refetchBotList();
          refetchBotInfo();
          toggleDialog();
        },
      });
    }
  };

  const handleRowClick = (row: any) => {
    navigate(
      routes.assistantDetail.replace(':id', row.getValue('id')).replace(':tabType', 'analytics'),
    );
  };

  const buildCSVData = () => {
    const results: any = [
      ['Agent Name', 'Agent ID', 'Date Created', 'Sessions', 'CTA Click', 'Status', 'Company Name'],
    ];
    (chatBotDetail?.data ?? [])!.forEach((el: SessionType) => {
      results.push([
        el.name,
        el.id,
        convertDateStringToFormattedDate(el.created_at),
        el.session,
        el.conversion,
        el.status ? 'Active' : 'InActive',
        el.company_name,
      ]);
    });
    return results ?? [[]];
  };

  const buildIndividualCSVData = (row: Row<SessionType>) => {
    const results: any = [
      ['Agent Name', 'Agent ID', 'Date Created', 'Sessions', 'CTA Click', 'Status', 'Company Name'],
    ];
    results.push([
      row.getValue('name'),
      row.getValue('id'),
      convertDateStringToFormattedDate(row.getValue('created_at')),
      row.getValue('session'),
      row.getValue('conversion'),
      row.getValue('status') ? 'Active' : 'InActive',
      row.getValue('company_name'),
    ]);
    return results ?? [[]];
  };

  return (
    <>
      <TableTemplate
        title="Agents List"
        onSearch={(value: string) => setSearch(value)}
        isLoading={isLoading}
        columns={columns}
        handleRowClick={handleRowClick}
        data={chatBotDetail?.data || []}
        buildCSVData={buildCSVData}
      />
      <DeleteBotDialog
        isOpen={isOpen}
        onClose={toggleDialog}
        actions={
          <>
            <Button variant="ghost" onClick={toggleDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRow}
              isLoading={status === 'loading' ? true : false}
            >
              Delete
            </Button>
          </>
        }
      />
    </>
  );
};
