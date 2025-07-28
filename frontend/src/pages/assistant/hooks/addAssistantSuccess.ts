import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getAssistantByIdApi } from '../api/addAssistantSuccess';

export const useFetchAssistantById = ({ id }: { id: string }) => {
  const params = useParams();
  return useQuery({
    queryKey: ['ADD_ASSISTANT_SUCCESS_GET_ASSISTANT_BY_ID', { id: id ?? params.id }],
    queryFn: getAssistantByIdApi,
    enabled: Boolean(params.id) || Boolean(id),
  });
};
