import { useGetEmailCampaignStats } from '../hooks/campaignManagement';
import { CampaignType } from '../types/campaingn';
import EmailCampaignStatsGrid from './EmailCampaignStatsGrid';

export default function CampaignStats(props: { id?: number; type?: CampaignType }) {
  const { id, type } = props;

  const { data: emailCampaignStats, isLoading } = useGetEmailCampaignStats(id, type);

  return <EmailCampaignStatsGrid stats={emailCampaignStats} isLoading={isLoading} />;
}
