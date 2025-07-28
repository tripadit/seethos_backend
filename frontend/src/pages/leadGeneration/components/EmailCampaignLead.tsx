import { useParams } from 'react-router-dom';

import { useGetEmailCampaignLeadById } from '../hooks/leadGeneration';
import LeadDetails from './LeadDetails';

export default function EmailCampaignLead() {
  const params = useParams();
  const id: string = params.id || '';
  const { data } = useGetEmailCampaignLeadById(id);
  if (!data) return null;
  return <LeadDetails lead={data} />;
}
