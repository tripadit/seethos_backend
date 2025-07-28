import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { toast } from '@/components/ui/use-toast';
import http from '@/utils/http';

import { getMarketingAnalyticsApi } from '../api/marketingAnalyrics';
import { query } from '../constant/query';
import { EmailStats, YearlyEmailStats } from '../types/marketingAnalytics';

export const useFetchMarketingAnalytics = () => {
  return useQuery<any>({
    queryFn: getMarketingAnalyticsApi,
    queryKey: [query.getMarketingAnalyticList],
    select: React.useCallback(
      (
        data: YearlyEmailStats,
      ): {
        data: YearlyEmailStats;
        current: EmailStats;
      } => {
        const currentYear = new Date().getFullYear();
        const current = data[currentYear];
        return { data, current: current };
      },
      [],
    ),
  });
};

export const useGetAnalyticsByCampaignTypeAndIds = (body: {
  campaign_type: string;
  campaign_ids?: Array<number>;
}) => {
  const getAnalyticsByCampaignTypeAndFiltered = async () => {
    return http().post('/email-campaign/all-stats/', body);
  };

  return useQuery(
    ['analytics', body.campaign_type, body.campaign_ids],
    getAnalyticsByCampaignTypeAndFiltered,
  );
};

export const useGetEmailStatsByDomain = (id: string) => {
  const getEmailStatsByDomain = () => {
    return http().get(`/domain/${id}/get_stats/`);
  };

  return useQuery(['emailStatsByDomain', id], getEmailStatsByDomain, {
    onError: () => {
      toast({
        variant: 'destructive',
        description: 'Could not fetch email stats by domain',
      });
    },
  });
};
