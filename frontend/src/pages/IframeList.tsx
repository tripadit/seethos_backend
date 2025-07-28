import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CTooltip, PageHeader } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useFetchChatBot } from '@/hooks/api';
import { convertDateStringToFormattedDate } from '@/lib/utils';
import { routes } from '@/routes/routes';

type IFrame = {
  bot_id: string;
  chatbotId: string;
  iframeCode: string;
  created_at: string;
  status: boolean;
  id: string;
  name: string;
};

const IFrameList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const { data, isLoading } = useFetchChatBot(search);

  const columns: ColumnDef<IFrame>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'bot_id',
      header: () => <div className="">Chatbot Id</div>,
      cell: ({ row }) => <div className="font-medium">{row.getValue('bot_id')}</div>,
    },
    {
      accessorKey: 'name',
      header: () => <div className="">Agent Name</div>,
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'created_at',
      header: () => <div className="">Date Created</div>,
      cell: ({ row }) => (
        <div className="font-medium">
          {convertDateStringToFormattedDate(row.getValue('created_at'))}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <div className="">Status</div>,
      cell: ({ row }) => {
        const isActive = row.getValue('status');
        return (
          <Badge variant={isActive ? 'success' : 'destructive'} className="capitalize">
            {isActive ? 'Active' : 'InActive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: () => <div className="">Action</div>,
      cell: (cell) => {
        const data = cell.row.original;
        return (
          <div className="flex gap-5 items font-medium">
            <CTooltip text="View Iframe Detail">
              <Link to={routes.iframeDetail.replace(':id', data.id)}>
                <Eye className="text-gray-500 cursor-pointer" onClick={() => {}} />
              </Link>
            </CTooltip>
            {/* <CTooltip text='Delete Iframe'>
            <DeleteIcon className="cursor-pointer" onClick={() => {}} />
            </CTooltip> */}
          </div>
        );
      },
    },
  ];

  const handleRowClick = (row: any) => {
    navigate(routes.iframeDetail.replace(':id', row.original.id));
  };

  const buildCSVData = () => {
    const results: any = [['Chatbot Id', 'Agent Name', 'Date Created', 'Status']];
    (data?.data ?? [])!.forEach((el: IFrame) => {
      results.push([
        el.bot_id,
        el.name,
        convertDateStringToFormattedDate(el.created_at),
        el.status ? 'Active' : 'InActive',
      ]);
    });
    return results ?? [[]];
  };

  return (
    <div className="mb-20">
      <PageHeader title="Iframe Overview">
        <></>
      </PageHeader>
      <TableTemplate
        handleRowClick={handleRowClick}
        onSearch={(value: string) => setSearch(value)}
        isLoading={isLoading}
        title="Iframe List"
        columns={columns}
        data={data?.data ?? []}
        buildCSVData={buildCSVData}
      />
    </div>
  );
};

export default IFrameList;
