import { DownloadIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useParams } from 'react-router-dom';

import { PageHeader } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/global/config';
import EnableDisableAutoReply from '@/pages/leadGeneration/components/EnableDisableReply';
import columns from '@/pages/leadGeneration/components/LeadListDetails/columns';
import { ILead } from '@/pages/leadGeneration/components/LeadListDetails/LeadListDetails';
import {
  useGetLeadsByEmailCampaignId,
  useGetLeadsByListId,
  useLazyGetLeadsByListId,
  useLazyLeadsByEmailCampaignId,
} from '@/pages/leadGeneration/hooks/leadGeneration';

import { CreateCampaignForm } from '../components/createCampaign/form';
import CampaignStats from '../components/IndividualCampaignStats';
import { useFetchCampaignById } from '../hooks/campaignManagement';
import { CampaignType } from '../types/campaingn';
import emailCampaigLeadsColumns from './columns';

const ViewCampaign = () => {
  const params = useParams<{ id: string }>();
  const { isLoading, data } = useFetchCampaignById(params.id);
  const emailCampaign = data;
  const [search, setSearch] = useState<string>('');

  const [pagination, setPagination] = useState({ pageSize: 10, pageIndex: 1 });

  const {
    data: leadsResponse,
    isLoading: isLoadingLeads,
    refetch,
  } = useGetLeadsByListId(
    emailCampaign?.leadgen_id,
    !emailCampaign?.leadgen_id,
    pagination,
    search,
  );

  useEffect(() => {
    if (emailCampaign?.leadgen_id) refetch();
    else if (emailCampaign?.id) {
      refetchCampaignLeads();
    }
  }, [pagination.pageIndex, pagination.pageSize, search]);

  const [allLeads, setAllLeads] = useState<ILead[]>([]);

  const getAllLeads = useLazyGetLeadsByListId();

  const {
    data: leadsByEmailCampaign,
    isLoading: isEmailCampaignLeadsLoading,
    refetch: refetchCampaignLeads,
  } = useGetLeadsByEmailCampaignId(
    emailCampaign?.id,
    !!emailCampaign?.id && !emailCampaign?.leadgen_id,
    pagination,
    search,
  );

  const getAllLeadsByEmailCampaign = useLazyLeadsByEmailCampaignId();

  useEffect(() => {
    if (!emailCampaign?.leadgen_id && emailCampaign?.id)
      getAllLeadsByEmailCampaign.mutateAsync(emailCampaign?.id).then((response) => {
        setAllLeads(response.data);
      });
  }, [emailCampaign?.id]);

  useEffect(() => {
    if (emailCampaign?.leadgen_id)
      getAllLeads.mutateAsync(emailCampaign?.leadgen_id).then((response) => {
        setAllLeads(response.data);
      });
  }, [emailCampaign?.leadgen_id]);

  const buildCSVData = () => {
    if (emailCampaign?.leadgen_id) {
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
    } else {
      const results = [['Name', 'Email', 'Company Name']];
      allLeads?.forEach((lead: any) => {
        results.push([lead.name, lead.email, lead.company_name]);
      });

      return results;
    }
  };

  return (
    <div className="mb-20">
      <PageHeader title="View Campaign">
        {CONFIG.ENABLE_AUTO_REPLY && emailCampaign && (
          <EnableDisableAutoReply campaign={emailCampaign} />
        )}
      </PageHeader>

      <CampaignStats id={emailCampaign?.id} type={CampaignType.EMAIL} />

      {isLoading && (
        <div className="flex gap-4 flex-col items-center">
          <Loader2 className="animate-spin w-8 h-8" />
          <p>Loading...</p>
        </div>
      )}
      {!isLoading && <CreateCampaignForm campaign={data} isViewMode />}

      {emailCampaign && (
        <>
          <TableTemplate
            title={
              <div className="flex justify-between  w-full">
                <div>Leads List </div>

                {allLeads && allLeads?.length > 0 && (
                  <CSVLink data={buildCSVData()} filename="leads.csv">
                    <Button variant="purple" icon={<DownloadIcon className="h-5 w-5" />}>
                      {' '}
                      Download Leads
                    </Button>
                  </CSVLink>
                )}
              </div>
            }
            onSearch={(value) => {
              setSearch(value);
            }}
            isLoading={emailCampaign?.leadgen_id ? isLoadingLeads : isEmailCampaignLeadsLoading}
            columns={emailCampaign?.leadgen_id ? columns(true) : emailCampaigLeadsColumns(false)}
            isHideDownloadCSV
            data={
              emailCampaign?.leadgen_id ? leadsResponse?.data || [] : leadsByEmailCampaign?.data
            }
            defaultPagination={pagination}
            onPaginationChange={setPagination}
            totalCount={leadsResponse?.count || 0}
            buildCSVData={() => {
              return [];
            }}
          />
        </>
      )}
    </div>
  );
};

export default ViewCampaign;
