import { useQuery } from '@tanstack/react-query';
import { jsonrepair } from 'jsonrepair';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';

export function useFetchSessionAnalysis(botId: string, sessionId: string, rest?: any) {
  const { toast } = useToast();
  const params: any = useParams();
  const fetchSessionAnalysis = () => {
    let updatedEndpoints =
      endpoints.analyzeSession.replace(':id', botId || params?.id) + '?session_id=' + sessionId;

    return http().get(updatedEndpoints);
  };

  return useQuery(['fetch', 'session-analysis', botId, sessionId], fetchSessionAnalysis, {
    enabled: !!botId && !!sessionId,
    onError: (error: { error?: string }) => {
      toast({
        variant: 'destructive',
        title: `${error?.error || 'Error occured while fetching session analysis'}`,
        description: 'Please try again later.',
      });
    },

    select: useCallback((data: any) => onSelect(data), []),
    ...rest,
  });
}

const onSelect = (data: string) => {
  try {
    const newData = jsonrepair(data);
    return JSON.parse(newData);
  } catch (e) {
    return data;
  }
};
