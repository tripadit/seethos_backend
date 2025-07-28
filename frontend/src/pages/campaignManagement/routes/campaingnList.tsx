import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AddIcon } from '@/assets/icons';
import { CTooltip, PageHeader } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SelectAssistantDialog from '@/pages/assistant/components/selectAssistant/dialog';
import { routes } from '@/routes/routes';

import AllCampaignStats from '../components/AllCampaignStats';
import { SequenceCampaignListTable } from '../components/campaignList/sequenceCampaignList';
import { CampaignListTable } from '../components/campaignList/table';
import { CampaignType } from '../types/campaingn';

const CampaingnList = () => {
  const [selectAssistantOpen, setSelectAssistantOpen] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState<CampaignType>(() => {
    // Load the initial value from local storage
    const savedCampaign = localStorage.getItem('selectedCampaign');
    return savedCampaign ? JSON.parse(savedCampaign) : 'AI Campaign';
  });

  useEffect(() => {
    // Save the current value to local storage whenever it changes
    localStorage.setItem('selectedCampaign', JSON.stringify(selectedCampaign));
  }, [selectedCampaign]);

  const navigate = useNavigate();
  return (
    <div className="mb-20">
      <PageHeader title="Campaign Management">
        <div className="flex items-center gap-2">
          <CTooltip text="Create Campaign">
            <Button
              className="capitalize bg-purple-500 text-white gap-3"
              onClick={() => {
                setSelectAssistantOpen(true);
                // navigate(routes.campaignCreate);
              }}
            >
              <AddIcon /> <p>New Campaign</p>
            </Button>
          </CTooltip>
        </div>
      </PageHeader>

      <div className="flex justify-center items-center w-fit gap-4 mb-6">
        <span className="font-medium">Dashboard:</span>
        <Select
          value={selectedCampaign}
          onValueChange={(value) => {
            setSelectedCampaign(value as CampaignType);
          }}
        >
          <SelectTrigger className="w-60">
            <SelectValue className="mr-2">{selectedCampaign}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CampaignType.EMAIL}>AI Campaign</SelectItem>
            <SelectItem value={CampaignType.SEQUENCE}>Sequence Campaign</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AllCampaignStats type={selectedCampaign} />

      {selectedCampaign === CampaignType.EMAIL ? (
        <CampaignListTable />
      ) : (
        <SequenceCampaignListTable />
      )}
      {selectAssistantOpen && (
        <SelectAssistantDialog
          title="Assistant selection for campaign"
          description="Select an assistant for this campaign to get started."
          onSelectAssistant={(id: number) => {
            if (selectedCampaign === CampaignType.EMAIL) {
              navigate(routes.campaignCreate + `?assistant_id=${id}`);
            } else {
              navigate(routes.createSequencecampaign + `?assistant_id=${id}`);
            }
          }}
          onCreateAssistant={() => {
            if (selectedCampaign === CampaignType.EMAIL) {
              navigate(routes.addAssistance + `?callbackUrl=${routes.campaignCreate}`);
            } else {
              navigate(routes.addAssistance + `?callbackUrl=${routes.createSequencecampaign}`);
            }
          }}
          onClose={() => {
            setSelectAssistantOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default CampaingnList;
