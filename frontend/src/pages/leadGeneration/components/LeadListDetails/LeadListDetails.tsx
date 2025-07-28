import { zodResolver } from '@hookform/resolvers/zod';
import { DownloadIcon, Pen, PlusIcon, RefreshCcw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { CSVLink } from 'react-csv';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { SaveIcon } from '@/assets/icons';
import { SendAutomatedEmailDialog } from '@/components/dialog/SendAutomatedEmailDialog';
import { PageHeader } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useFetchCampaignById,
  useTestEmailCampaignEmail,
} from '@/pages/campaignManagement/hooks/campaignManagement';
import { routes } from '@/routes/routes';

import {
  useCreateCampaignForLeadList,
  useGetLeadListDetails,
  useGetLeadsByListId,
  useLazyGetLeadsByListId,
  useUpdateLeadListDetails,
} from '../../hooks/leadGeneration';
import { SendAutomatedEmailFormSchema, SendAutomatedEmailFormType } from '../CreateLead';
import columns from './columns';

interface LeadListProps {}

export interface ILead {
  name: string;
  primary_email: string;
  email: string;
  phone_number: string;
  company_name: string;
  position: string;
  location: string;
  summary: string;
  id: number;
  status?: string;
  campaign_id?: number;
  leadgen_id?: number;
  leadGen?: number;
  is_subscribed?: boolean;
  is_last_email_seen?: string;
}

const LeadListDetails: React.FC<LeadListProps> = () => {
  const params = useParams();
  const id: any = params.id;

  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');

  const [pagination, setPagination] = useState({ pageSize: 10, pageIndex: 1 });

  const [allLeads, setAllLeads] = useState<ILead[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  const { data: leadList } = useGetLeadListDetails(id);

  const testCampaignEmails = useTestEmailCampaignEmail();

  const { data: emailCampaign } = useFetchCampaignById(
    leadList?.campaign_id,
    !!leadList?.campaign_id,
  );

  const {
    data: leadsResponse,
    isLoading,
    refetch,
  } = useGetLeadsByListId(id, leadList?.status === 'COMPLETED', pagination, search);

  const getAllLeads = useLazyGetLeadsByListId();

  useEffect(() => {
    refetch();
  }, [pagination.pageIndex, pagination.pageSize, search]);

  useEffect(() => {
    getAllLeads.mutateAsync(id).then((response) => {
      setAllLeads(response.data);
    });
  }, [id]);

  const updateLeadList = useUpdateLeadListDetails();

  const [leadListName, setLeadListName] = useState('');
  const [editNameEnabled, setEditNameEnabled] = useState(false);

  const [showEmailPromptDialog, setShowEmailPromptDialog] = useState(false);

  const sendEmailForm = useForm<SendAutomatedEmailFormType>({
    resolver: zodResolver(SendAutomatedEmailFormSchema),
    defaultValues: {
      prompt: '',
      subject: '',
    },
    mode: 'all',
  });

  const createCampaign = useCreateCampaignForLeadList();

  const onContinue = async () => {
    const data = await createCampaign.mutateAsync({
      ...sendEmailForm.getValues(),
      leadgen_id: leadList.id,
      chatbot: leadList.chatbot,
    });
    await testCampaignEmails.mutateAsync(data.id);
    navigate(`/dashboard/campaign-review/${data.id}`);
  };

  useEffect(() => {
    if (leadList) {
      setLeadListName(leadList.name);
    }
  }, [leadList]);

  const saveLead = async () => {
    const response = await updateLeadList.mutateAsync({
      id,
      body: {
        name: leadListName || leadList.name,
      },
    });

    if (response) setEditNameEnabled(false);
  };

  const buildCSVData = () => {
    const results = [
      ['Name', 'Primary Email', 'Email', 'Phone Number', 'Company Name', 'Position', 'Summary'],
    ];
    allLeads?.forEach((lead: any) => {
      results.push([
        lead.name,
        lead.primary_email,
        lead.email,
        lead.phone_number,
        lead.company_name,
        lead.position,
        lead.summary,
      ]);
    });

    return results;
  };

  return (
    <div className="mb-20">
      <PageHeader
        title={
          <div className="flex items-center gap-2 ">
            {editNameEnabled ? (
              <>
                <ContentEditable
                  innerRef={ref}
                  className={cn('outline-none focus:outline-none min-w-[200px]')}
                  html={leadListName || 'Untitled'}
                  onChange={(event) => {
                    setLeadListName(event.currentTarget.textContent || '');
                  }}
                />
              </>
            ) : (
              <div className={cn('outline-none focus:outline-none')}>
                {leadListName || 'Untitled'}
              </div>
            )}

            {!editNameEnabled ? (
              <Pen
                className="h-5 w-5 text-gray-500 cursor-pointer"
                onClick={() => {
                  setEditNameEnabled(true);
                  setTimeout(() => {
                    ref.current?.focus();
                  }, 200);
                }}
              />
            ) : (
              <>
                <Button
                  isLoading={updateLeadList.isLoading}
                  variant={'purple'}
                  onClick={saveLead}
                  icon={<SaveIcon />}
                >
                  Save
                </Button>
                <Button
                  variant={'outline'}
                  onClick={() => {
                    setEditNameEnabled(false);
                    setLeadListName(leadList.name);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        }
      >
        <div className="flex items-center gap-2">
          {leadList && !leadList?.campaign_id && (
            <Button
              variant="outline"
              icon={<PlusIcon />}
              onClick={() => {
                setShowEmailPromptDialog(true);
              }}
            >
              Send Automated Email
            </Button>
          )}

          {leadList?.campaign_id && (
            <Button
              variant={'outline'}
              onClick={() => {
                if (emailCampaign?.status === 'Draft') {
                  navigate(routes.campaignReview.replace(':id', leadList?.campaign_id.toString()));
                } else
                  navigate(routes.campaignDetail.replace(':id', leadList?.campaign_id.toString()));
              }}
            >
              {' '}
              Go to Campaign
            </Button>
          )}

          {allLeads && allLeads?.length > 0 && (
            <CSVLink data={buildCSVData()} filename="leads.csv">
              <Button variant="purple" icon={<DownloadIcon className="h-5 w-5" />}>
                {' '}
                Download Leads
              </Button>
            </CSVLink>
          )}

          <RefreshCcw
            size={36}
            className={cn(
              'p-2 rounded-md cursor-pointer hover:bg-gray-100 active:bg-gray-200 ',
              leadList?.status !== 'COMPLETED' && 'animate-spin rounded-full',
            )}
            onClick={() => {
              refetch();
            }}
          />
        </div>
      </PageHeader>

      <TableTemplate
        title={
          <div className="flex justify-between  w-full">
            <div>
              Lead List{' '}
              <span className="text-gray-600 ml-4 text-sm">
                ({leadsResponse?.count || 0} /300 Generated)
              </span>
            </div>
            {leadList?.campaign_id && (
              <div className="text-purple-600 text-sm font-medium">
                {leadList.number_of_emails_sent} Emails sent
              </div>
            )}
          </div>
        }
        onSearch={(value) => {
          setSearch(value);
        }}
        isLoading={isLoading}
        columns={columns(leadList?.campaign_id)}
        isHideDownloadCSV
        data={leadsResponse?.data || []}
        defaultPagination={pagination}
        onPaginationChange={setPagination}
        totalCount={leadsResponse?.count || 0}
        buildCSVData={() => {
          return [];
        }}
        isFetchingMore={leadList?.status !== 'COMPLETED'}
      />
      {showEmailPromptDialog && (
        <SendAutomatedEmailDialog
          form={sendEmailForm}
          isOpen
          onContinue={() => {
            onContinue();
          }}
          onClose={() => setShowEmailPromptDialog(false)}
        />
      )}
    </div>
  );
};

export default LeadListDetails;
