import { Loader2, MailIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageHeader } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CONFIG } from '@/global/config';
import EnableDisableAutoReply from '@/pages/leadGeneration/components/EnableDisableReply';
import { useGetLeadsBySequenceCampaignId } from '@/pages/leadGeneration/hooks/leadGeneration';

import { CreateSequenceCampaignForm } from '../components/createCampaign/sequenceCampaignForm';
import CampaignStats from '../components/IndividualCampaignStats';
import {
  useFetchSequenceByCampaignId,
  useFetchSequenceCampaignById,
} from '../hooks/campaignManagement';
import { CampaignType } from '../types/campaingn';
import emailCampaigLeadsColumns from './columns';

const ViewSequenceCampaign = () => {
  const convertDelayToUnit = (delay: number, unit: 'minutes' | 'hours' | 'days'): number => {
    if (unit === 'minutes') return delay / 60;
    if (unit === 'hours') return delay / 3600;
    if (unit === 'days') return delay / (24 * 3600);
    return delay; // Default case, should not be reached
  };
  const params = useParams<{ id: string }>();

  const { isLoading, data } = useFetchSequenceCampaignById(params.id);
  const emailCampaign = data;

  const [search, setSearch] = useState<string>('');

  const { data: initialEmailSequence } = useFetchSequenceByCampaignId(params.id);

  const emailSequence = initialEmailSequence?.data?.map((seq, index) => {
    let send_interval = seq.send_interval;
    if (index !== 0) {
      send_interval = send_interval - initialEmailSequence!.data[index - 1].send_interval;
    }
    return {
      ...seq,
      delayUnit:
        seq.send_interval % 86400 === 0
          ? 'days'
          : seq.send_interval % 3600 === 0
            ? 'hours'
            : 'minutes',
      delay:
        seq.send_interval % 86400 === 0
          ? convertDelayToUnit(send_interval, 'days')
          : seq.send_interval % 3600 === 0
            ? convertDelayToUnit(send_interval, 'hours')
            : convertDelayToUnit(send_interval, 'minutes'),
    };
  });

  const [pagination, setPagination] = useState({ pageSize: 10, pageIndex: 1 });

  const { data: leadsByEmailCampaign, isLoading: isLoadingLeads } = useGetLeadsBySequenceCampaignId(
    emailCampaign?.id,
    !!emailCampaign?.id && !emailCampaign?.leadgen_id,
    pagination,
    search,
  );

  return (
    <div className="mb-20">
      <PageHeader title="View Campaign">
        {CONFIG.ENABLE_AUTO_REPLY && emailCampaign && (
          <EnableDisableAutoReply campaign={emailCampaign} isSequenceCampaign />
        )}
      </PageHeader>
      <CampaignStats id={emailCampaign?.id} type={CampaignType.SEQUENCE} />
      {isLoading && (
        <div className="flex gap-4 flex-col items-center">
          <Loader2 className="animate-spin w-8 h-8" />
          <p>Loading...</p>
        </div>
      )}

      <div className="flex gap-10">
        {!isLoading && <CreateSequenceCampaignForm campaign={data} isViewMode gridCount={1} />}
        {emailSequence && (
          <ScrollArea className="h-email-sample w-full shadow-qrCard rounded-lg border-gray-200 border p-6">
            <form>
              {emailSequence?.map((sequence: any, index: number) => (
                <div key={index} className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-lg border p-2">
                      <MailIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium ">Email {index + 1}</h3>
                  </div>
                  <div className="grid grid-cols-5 mb-6">
                    <label className="col-span-1 font-medium">Subject</label>
                    <Input
                      disabled
                      className="col-span-4"
                      type="text"
                      name="subject"
                      value={sequence.subject}
                    />
                  </div>
                  <div className="grid grid-cols-5 mb-6">
                    <label className="col-span-1 font-medium">Body</label>
                    <ScrollArea className="min-h-40 overflow-y-auto col-span-4 p-2 border border-gray-200 rounded-lg">
                      <div
                        className=" outline-none"
                        dangerouslySetInnerHTML={{ __html: sequence.body }}
                      />
                    </ScrollArea>
                  </div>
                  <div className="grid grid-cols-5 gap-6">
                    <label className="col-span-1 font-medium">Delay</label>
                    <div className="col-span-1">
                      <Input type="number" disabled name="delay" value={sequence.delay} />
                    </div>
                    <div className="col-span-1">
                      {index !== 0}
                      <Select disabled name="delayUnit" value={sequence.delayUnit}>
                        <SelectTrigger className="w-full">
                          <span>
                            {sequence.delayUnit === 'hours'
                              ? 'Hours'
                              : sequence.delayUnit === 'days'
                                ? 'Days'
                                : 'Minutes'}
                          </span>{' '}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutes</SelectItem>

                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="my-10" />
                </div>
              ))}
            </form>
          </ScrollArea>
        )}
      </div>

      {emailCampaign && (
        <>
          <TableTemplate
            title={
              <div className="flex justify-between  w-full">
                <div>Leads List</div>
              </div>
            }
            onSearch={(value) => {
              setSearch(value);
            }}
            isLoading={isLoadingLeads}
            columns={emailCampaigLeadsColumns(true)}
            isHideDownloadCSV
            data={leadsByEmailCampaign?.data || []}
            defaultPagination={pagination}
            onPaginationChange={setPagination}
            totalCount={leadsByEmailCampaign?.count || 0}
            buildCSVData={() => {
              return [];
            }}
          />
        </>
      )}
    </div>
  );
};

export default ViewSequenceCampaign;
