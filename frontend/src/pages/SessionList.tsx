import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CTooltip, DashboardCard, PageHeader } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFetchSessionList } from '@/hooks/api';
import { useFetchBotProgression } from '@/hooks/useFetchBotProgression';
import { convertDateStringToFormattedDate, formatDuration, getValueOrDefault } from '@/lib/utils';
import { routes } from '@/routes/routes';

type Session = {
  _id: string;
  duration: string;
  conversion: string;
  status: 'active' | 'inactive';
  created_at: string;
};

const SessionList = ({ id }: { id?: string | null }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const { data: botProgressionData, isLoading: isProgressionLoading } = useFetchBotProgression(
    id as string,
  );

  const handleRowClick = (row: any) => {
    navigate(
      routes.sessionDetail.replace(':id', id || (params?.id as string)) +
        '?session_id=' +
        row.getValue('_id') +
        '&tabIndex=sessions',
    );
  };

  const columns: ColumnDef<Session>[] = [
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
      accessorKey: '_id',
      header: () => <div className="">Session Id</div>,
      cell: ({ row }) => <div className="font-medium">{row.getValue('_id')}</div>,
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
      accessorKey: 'duration',
      header: () => <div className="">Duration</div>,
      cell: ({ row }) => (
        <div className="font-medium">
          {formatDuration(getValueOrDefault(row.getValue('duration'), '-'))}
        </div>
      ),
    },
    {
      accessorKey: 'conversion',
      header: () => <div className="">CTA Clicks</div>,
      cell: ({ row }) => (
        <div className="font-medium">{getValueOrDefault(row.getValue('conversion'), '-')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <div className="">Status</div>,
      cell: ({ row }) => (
        <Badge variant="success" className="capitalize">
          {row.getValue('status')}
        </Badge>
      ),
    },
    {
      accessorKey: 'action',
      header: () => <div className="">Action</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-5 items font-medium">
            <CTooltip text="View Detail">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(routes.addBot + '?mode=edit' + '&id=' + row.getValue('id'));
                }}
              >
                <Eye
                  className="text-gray-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      routes.sessionDetail.replace(':id', id || (params?.id as string)) +
                        `?session_id=${row.getValue('_id')}`,
                    );
                  }}
                />
              </Button>
            </CTooltip>
            {/* <DeleteIcon className="cursor-pointer" onClick={() => { }} /> */}
          </div>
        );
      },
    },
  ];
  const { data: sessionsList, isLoading } = useFetchSessionList(id || params?.id || '', search);

  const buildCSVdata = () => {
    let results = [];
    const headers = ['Session Id', 'Date Created', 'Duration', 'CTA Clicks', 'Status'];
    results.push(headers);

    if (!isLoading && sessionsList) {
      sessionsList.forEach((session: any) => {
        const { _id: sessionId, created_at: dateCreated, duration, conversion, status } = session;
        const formattedDate = convertDateStringToFormattedDate(dateCreated);
        const formattedDuration = formatDuration(duration);
        const csvRow = [sessionId, formattedDate, formattedDuration, conversion, status];

        results.push(csvRow);
      });
    }

    return results.length ? results : [[]];
  };
  return (
    <div className="mb-20">
      <PageHeader
        title="Sessions"
        isLoading={isLoading}
        isChildPage
        onBackPress={() => navigate(routes.dashboard)}
      >
        <p></p>
      </PageHeader>
      <div className="scroller pb-2  flex w-[100%] overflow-hidden hover:overflow-auto  gap-6 my-4 ">
        <DashboardCard
          title="Active Sessions"
          isLoading={isProgressionLoading}
          count={botProgressionData?.active_session || 0}
          growth={botProgressionData?.active_session_prgression || 0}
          hasGrowthCount
        />
        <DashboardCard
          title="Total CTA Click"
          isLoading={isProgressionLoading}
          count={botProgressionData?.total_conversion || 0}
          growth={botProgressionData?.total_conversion_prgression || 0}
          hasGrowthCount
        />
        <DashboardCard
          title="Avg time to Conversion"
          isLoading={isProgressionLoading}
          count={
            botProgressionData?.avg_time_to_conversion
              ? formatDuration(botProgressionData?.avg_time_to_conversion)
              : formatDuration('0.0')
          }
          growth={botProgressionData?.avg_time_to_conversion_prgression || 0}
          hasGrowthCount
        />
        <DashboardCard
          title="Total Conversation Duration"
          isLoading={isProgressionLoading}
          count={
            botProgressionData?.total_duration
              ? formatDuration(botProgressionData?.total_duration)
              : formatDuration('0.0')
          }
          growth={botProgressionData?.total_duration_prgression || 0}
          hasGrowthCount
        />
      </div>
      <TableTemplate
        title="Session List"
        isLoading={isLoading}
        onSearch={(value: string) => setSearch(value)}
        columns={columns}
        handleRowClick={handleRowClick}
        buildCSVData={buildCSVdata}
        data={sessionsList || []}
      />
    </div>
  );
};

export default SessionList;
