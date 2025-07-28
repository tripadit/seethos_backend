import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchLeadList(botId: string, search?: string) {
  const { toast } = useToast();
  const params: any = useParams();
  const fetchChatBot = () => {
    let updatedEndpoints = endpoints.getLeadList.replace(':id', botId || params?.id);
    // if (search || search !== '' || search !== undefined) {
    //   updatedEndpoints = updatedEndpoints ;
    // }
    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'lead', search], fetchChatBot, {
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Something went wrong!'}`,
        description: 'Please try again later.',
      });
    },

    select: useCallback((data: any[]) => onSelect(data), []),
  });
}

const onSelect = (data: string[]) => {
  const newLeadList = data.filter((el) => typeof el !== 'string');

  return newLeadList;
};
