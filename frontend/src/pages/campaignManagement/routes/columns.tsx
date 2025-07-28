import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ActionsComponent,
  LeadEmailErrorStatus,
} from '@/pages/leadGeneration/components/LeadListDetails/columns';
import { ILead } from '@/pages/leadGeneration/components/LeadListDetails/LeadListDetails';

const emailCampaigLeadsColumns: (isSequenceCampaign: boolean) => ColumnDef<ILead>[] = (
  isSequenceCampaign: boolean,
) => [
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
            <div className="flex flex-wrap items-center gap-2">
              {row.original.primary_email.toString()}
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
              )}
            </div>
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
    accessorKey: 'status',
    header: () => <div>Email Status</div>,
    cell: ({ row }: any) => {
      if (row?.original?.status === 'UNSENT') return <Badge variant="warning-light">Pending</Badge>;
      if (row?.original?.status === 'ERROR') return <LeadEmailErrorStatus row={row} />;
      return <Badge variant="success">Delivered</Badge>;
    },
  },
  {
    accessorKey: 'action',
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }: any) => {
      return <ActionsComponent row={row} isSequenceCampaign={isSequenceCampaign} />;
    },
  },
];

export default emailCampaigLeadsColumns;
