import { useEffect, useState } from 'react';

import MultipleSelector from '@/components/ui/multiselect.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { useGetAnalyticsByCampaignTypeAndIds } from '@/pages/analytics/hooks/marketingAnalytics.ts';
import EmailCampaignStatsGrid from '@/pages/campaignManagement/components/EmailCampaignStatsGrid.tsx';
import {
  useCompaignMangementList,
  useGetSequenceCampaignList,
} from '@/pages/campaignManagement/hooks/campaignManagement.tsx';

export default function AnalyticsByCampaignType() {
  const [campaignType, setCampaignType] = useState('Sequence');

  const [selectedCampaigns, setSelectedCampaigns] = useState<Array<any>>([]);

  const { data: aiCampaignList } = useCompaignMangementList();

  const selectedCampaignIds = selectedCampaigns.map((campaign) => campaign.value);

  const { data, isLoading } = useGetAnalyticsByCampaignTypeAndIds({
    campaign_type: campaignType,
    campaign_ids: selectedCampaignIds,
  });

  useEffect(() => {
    setSelectedCampaigns([]);
  }, [campaignType]);

  const { data: sequenceCampaignList } = useGetSequenceCampaignList();

  const getCampaignOptions = () => {
    const data = campaignType === 'ai' ? aiCampaignList?.data : sequenceCampaignList?.data;
    if (!data || data?.length === 0) {
      return [];
    }

    return data?.map((campaign) => {
      return {
        label: campaign.name || 'Subject: ' + (campaign.subject || ''),
        value: campaign.id.toString(),
      };
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-20 items-center justify-between">
        <div className="flex gap-6 items-center">
          <div>Campaign Type</div>
          <div>
            <Select
              value={campaignType}
              onValueChange={(value) => {
                setCampaignType(value);
              }}
            >
              <SelectTrigger className="w-60">
                <SelectValue className="mr-2">
                  {campaignType === 'ai' ? 'AI Campaign' : 'Sequence Campaign'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'ai'}>AI Campaign</SelectItem>
                <SelectItem value={'Sequence'}>Sequence Campaign</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-5 items-center flex-1">
          <div className="min-w-fit">Filter Campaigns</div>
          <MultipleSelector
            value={selectedCampaigns}
            options={getCampaignOptions()}
            onChange={(options) => {
              setSelectedCampaigns(options);
            }}
            placeholder="Select campaigns to filtered stats"
          />
        </div>
      </div>
      <EmailCampaignStatsGrid stats={data} isLoading={isLoading} />
    </div>
  );
}
