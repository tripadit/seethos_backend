import { ColumnDef, PaginationState, Row } from '@tanstack/react-table';
import { DownloadIcon, Eye } from 'lucide-react';
import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';

import { AddIcon, DeleteIcon } from '@/assets/icons';
import { DeleteLeadListDialog } from '@/components/dialog/DeleteLeadListDialog';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { CTooltip, PageHeader } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { convertDateStringToFormattedDate } from '@/lib/utils';
import SelectAssistantDialog from '@/pages/assistant/components/selectAssistant/dialog';
import { routes } from '@/routes/routes';

import {
  useDeleteLeadList,
  useGetLeadLists,
  useLazyGetLeadsByListId,
} from '../hooks/leadGeneration';

const badgeVariants: Record<string, 'red' | 'light-blue' | 'dark-blue'> = {
  '0': 'red',
  '1': 'light-blue',
  '2': 'dark-blue',
};

interface Props {}

interface ILeadList {
  name: string;
  id: number;
  ICP: Array<string>;
  created_at: string;
  number_of_leads_generated: number;
  is_linkedIn: boolean;
  location: string;
}

const MutedTextWrapper = ({ children }: any) => {
  return <div className="font-medium text-gray-500">{children}</div>;
};

const LeadGenerationPage: React.FC<Props> = () => {
  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const [selectAssistantOpen, setSelectAssistantOpen] = useState(false);

  const [search, setSearch] = useState<string>('');

  const { data: leadLists, isLoading } = useGetLeadLists(pagination, search);

  const [data, setData] = useState<any>([]);

  const getLeads = useLazyGetLeadsByListId();

  const deleteList = useDeleteLeadList();

  const [selected, setSelected] = useState();
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  const deleteLeadList = async (id?: string) => {
    if (id) {
      await deleteList.mutateAsync(id);
    }
  };

  const downloadCSVData = async (row: Row<ILeadList>) => {
    const response = await getLeads.mutateAsync(row?.original?.id);
    if (response) {
      const result = [
        [
          'Name',
          'Primary Email',
          'Email',
          'Phone Number',
          'Company Name',
          'Position',
          'Location',
          'Summary',
        ],
      ];
      response?.data?.forEach((lead) => {
        result.push([
          lead.name,
          lead.primary_email,
          lead.email,
          lead.phone_number,
          lead.company_name,
          lead.position,
          lead.location,
          lead.summary,
        ]);
      });
      setData(result);
      setTimeout(() => {
        document.getElementById('download-csv-' + row?.original?.id)?.click();
      }, 200);
    }
  };
  const columns: ColumnDef<ILeadList>[] = [
    {
      accessorKey: 'name',
      header: () => <div>Name</div>,
      cell: ({ row }: any) => {
        return <MutedTextWrapper>{row?.original?.name}</MutedTextWrapper>;
      },
    },
    {
      accessorKey: 'ICP',
      header: () => <div>ICP Keywords</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            {row?.original?.ICP?.slice(0, 3).map((item: any, index: number) => (
              <Badge key={index} variant={badgeVariants[((index + row.index) % 3).toString()]}>
                {item}
              </Badge>
            ))}
            {row?.original?.ICP?.length > 3 && (
              <div className="px-2 py-1 bg-gray-100 font-semibold rounded-2xl text-xs font-medium text-charcoal">
                +{(row?.original?.ICP?.length - 3).toString()}{' '}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: () => <div className="">Date Created</div>,
      cell: ({ row }: any) => (
        <div className="font-medium text-gray-500">
          {convertDateStringToFormattedDate(row?.original?.created_at?.toString())}
        </div>
      ),
    },
    {
      accessorKey: 'number_of_leads_generated',
      header: () => <div>No. of Leads</div>,
      cell: ({ row }: any) => {
        return (
          <MutedTextWrapper>
            {row?.original?.number_of_leads_generated?.toString()}
          </MutedTextWrapper>
        );
      },
    },
    {
      accessorKey: 'is_linkedIn',
      header: () => <div>Targer Socials</div>,
      cell: ({ row }: any) => {
        return (
          <MutedTextWrapper>{row?.original?.is_linkedIn && <div>Linked In </div>}</MutedTextWrapper>
        );
      },
    },
    {
      accessorKey: 'location',
      header: () => <div>Location</div>,
      cell: ({ row }: any) => {
        return <MutedTextWrapper>{row?.original?.location}</MutedTextWrapper>;
      },
    },
    {
      accessorKey: 'action',
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center font-medium">
            <CTooltip text="View Lead List">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    routes.leadListDetails.replace(':id', row?.original?.id.toString() || ''),
                  );
                }}
              >
                <Eye className="w-5 h-5 text-gray-500 cursor-pointer" />
              </Button>
            </CTooltip>
            <CTooltip text="Download Leads as CSV">
              <Button
                className="px-4 py-1"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <CSVLink
                  id={'download-csv-' + row?.original?.id}
                  data={data}
                  filename={`lead-list-${row?.original?.id}.csv`}
                />
                <DownloadIcon
                  className=" text-gray-500"
                  onClick={() => {
                    downloadCSVData(row);
                  }}
                />
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
                    setSelected(row.getValue('id'));
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
    <div className="mb-20">
      <PageHeader title="Lead Generation">
        <div>
          <CTooltip text="Create Lead">
            <Button
              className="capitalize bg-purple-500 text-white gap-3"
              onClick={() =>
                checkAccount(() => {
                  setSelectAssistantOpen(true);
                })
              }
            >
              <AddIcon /> <p>Generate Lead</p>
            </Button>
          </CTooltip>
        </div>
      </PageHeader>

      <TableTemplate
        title="Lead Generation List"
        onSearch={setSearch}
        isLoading={isLoading}
        columns={columns}
        isHideDownloadCSV
        handleRowClick={(row: any) => {
          navigate('/dashboard/lead-generation/' + row?.original?.id);
        }}
        data={leadLists?.data || []}
        buildCSVData={() => {
          return [];
        }}
        totalCount={leadLists?.count}
        defaultPagination={pagination}
        onPaginationChange={setPagination}
      />

      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}

      <DeleteLeadListDialog
        isOpen={isOpen}
        onClose={toggleDialog}
        actions={
          <div className="flex gap-4">
            <Button variant="outline" onClick={toggleDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteLeadList(selected);
                toggleDialog();
              }}
            >
              Delete
            </Button>
          </div>
        }
      />
      {selectAssistantOpen && (
        <SelectAssistantDialog
          title="Assistant selection for leads generation"
          description="Select an assistant for this leads to get started."
          onSelectAssistant={(id: number) => {
            navigate(routes.createLead + `?assistant_id=${id}`);
          }}
          onCreateAssistant={() => {
            navigate(routes.addAssistance + `?callbackUrl=${routes.createLead}`);
          }}
          onClose={() => {
            setSelectAssistantOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default LeadGenerationPage;
