import { useParams } from 'react-router-dom';

import { useGetLeadById } from '../hooks/leadGeneration';
import LeadDetails from './LeadDetails';

export default function LeadgenLeadDetails() {
  const params = useParams();

  const id: string = params.id || '';

  const { data } = useGetLeadById(id);
  if (!data) return null;

  return <LeadDetails lead={data} />;
}
