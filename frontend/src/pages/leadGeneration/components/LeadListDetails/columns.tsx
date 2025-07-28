import { ColumnDef } from '@tanstack/react-table';
import { EyeIcon, Pen, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DeleteIcon } from '@/assets/icons';
import { DeleteLeadDialog } from '@/components/dialog/DeleteLeadDialog';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { CTooltip } from '@/components/molecules';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';

import { useResendEmailToLead } from '../../hooks/leadGeneration';
import { ILead } from './LeadListDetails';

const columns: (isInCampaign: boolean) => ColumnDef<ILead>[] = (isInCampaign) => {
  return [
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
                {row.original.primary_email.toString()}{' '}
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
    ...(isInCampaign
      ? [
          {
            accessorKey: 'status',
            header: () => <div>Email Status</div>,
            cell: ({ row }: any) => {
              if (row?.original?.status === 'UNSENT')
                return <Badge variant="warning-light">Pending</Badge>;
              if (row?.original?.status === 'ERROR') return <LeadEmailErrorStatus row={row} />;
              return <Badge variant="success">Delivered</Badge>;
            },
          },
        ]
      : []),

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
        return <ActionsComponent row={row} />;
      },
    },
  ];
};

export const LeadEmailErrorStatus = ({ row }: any) => {
  const resendEmailToLead = useResendEmailToLead();

  const resendEmail = async (leadId: string) => {
    await resendEmailToLead.mutateAsync(leadId);
  };

  return (
    <div className="flex gap-2 items-center">
      <Badge variant="destructive">Error</Badge>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <RefreshCcw
              size={16}
              onClick={() => {
                resendEmail(row?.original?.id.toString());
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white">Resend email</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const ActionsComponent = ({ row, isSequenceCampaign }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();

  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center font-medium">
      <CTooltip text="View Lead List">
        <Button
          className="px-4 py-1"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            if (row.original.leadGen) navigate(routes.leadDetails.replace(':id', row.original.id));
            else {
              if (isSequenceCampaign) {
                navigate(routes.leadDetails.replace(':id', row.original.id));
              } else navigate(routes.emailCampaignLead.replace(':id', row.original.id));
            }
          }}
        >
          <EyeIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
        </Button>
      </CTooltip>
      {row.original.leadGen && (
        <>
          <CTooltip text="Edit">
            <Button
              className="px-4 py-1"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                if (row.original.leadGen)
                  navigate(routes.leadDetails.replace(':id', row.original.id) + '?edit=true');
                else
                  navigate(routes.emailCampaignLead.replace(':id', row.original.id) + '?edit=true');
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
                  toggleDialog();
                });
              }}
            >
              <DeleteIcon className="cursor-pointer" />
            </Button>
          </CTooltip>
        </>
      )}
      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}
      {isOpen && (
        <DeleteLeadDialog leadId={row?.original?.id} isOpen={isOpen} toggleDialog={toggleDialog} />
      )}
    </div>
  );
};

export default columns;
