import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { DeleteIcon } from '@/assets/icons';
import { CustomDialog } from '@/components/dialog';
import { CTooltip } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';

import { CAMPAIGNSTATUS } from '../../constant/campaignManagement';
import {
  useDeleteSequenceCampaign,
  useGetSequenceCampaignList,
} from '../../hooks/campaignManagement';
import { ICampaingnList } from '../../types/campaingn';

export const SequenceCampaignListTable = () => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [currentRecord, setCurrenRecord] = React.useState<number>();

  const navigate = useNavigate();
  const { isLoading, data } = useGetSequenceCampaignList();
  const deleteCampaign = useDeleteSequenceCampaign();

  const columns: ColumnDef<ICampaingnList>[] = [
    {
      accessorKey: 'id',
      header: () => <div className="">Campaign Name</div>,
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row?.original?.name}

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
        </div>
      ),
    },
    {
      accessorKey: 'reply_email',
      header: () => <div className="">CC Email</div>,
    },
    {
      accessorKey: 'status',
      header: () => <div className="">Status</div>,
      cell: ({ row }) => {
        const status: string = row.getValue('status');
        return (
          <Badge
            variant={
              status == CAMPAIGNSTATUS.ACTIVE
                ? 'success'
                : status == CAMPAIGNSTATUS.DRAFT
                  ? 'warning'
                  : 'successDark'
            }
            className="uppercase"
          >
            {status}
          </Badge>
        );
      },
    },

    {
      accessorKey: 'action',
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const id: number = row.getValue('id');
        return (
          <div className="flex justify-center items-center font-medium">
            <CTooltip text="View Campaign">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={() => {
                  if (row?.original?.status === 'Draft') {
                    navigate(routes.reviewSequenceCampaign.replace(':id', id.toString()));
                  } else navigate(routes.sequenceCampaignDetail.replace(':id', id.toString()));
                }}
              >
                <Eye className="w-5 h-5 text-gray-500 cursor-pointer" />
              </Button>
            </CTooltip>

            <CTooltip text="Delete Campaign">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setCurrenRecord(id);
                  setOpenModal(true);
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

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteSenderEmail = async () => {
    await deleteCampaign.mutateAsync(currentRecord as number);
    handleCloseModal();
  };

  return (
    <>
      <TableTemplate
        title="Campaign List"
        onSearch={() => {}}
        isLoading={isLoading}
        columns={columns}
        handleRowClick={(row) => {
          if (row?.original?.status === 'Draft') {
            navigate(routes.reviewSequenceCampaign.replace(':id', row?.original?.id.toString()));
          } else
            navigate(routes.sequenceCampaignDetail.replace(':id', row?.original?.id.toString()));
        }}
        data={data?.data || []}
        isHideDownloadCSV
      />
      <CustomDialog
        title="Are you sure?"
        body="Are you sure you want to delete this campaign?"
        isOpen={openModal}
        onClose={handleCloseModal}
        actions={
          <>
            <Button variant="secondary" className="mt-5" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              isLoading={deleteCampaign.isLoading}
              variant="purple"
              className="mt-5"
              onClick={handleDeleteSenderEmail}
            >
              Confirm
            </Button>
          </>
        }
      ></CustomDialog>
    </>
  );
};
