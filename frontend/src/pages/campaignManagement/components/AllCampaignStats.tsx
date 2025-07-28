import { useGetAllEmailCampaignStats } from '../hooks/campaignManagement';
import { CampaignType } from '../types/campaingn';
import EmailCampaignStatsGrid from './EmailCampaignStatsGrid';

export default function AllCampaignStats(props: { type: CampaignType }) {
  const { type } = props;

  const { data: emailCampaignStats, isLoading } = useGetAllEmailCampaignStats(type);

  return <EmailCampaignStatsGrid stats={emailCampaignStats} isLoading={isLoading} />;
}
