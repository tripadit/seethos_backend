import http from '@/utils/http';

import { YearlyEmailStats } from '../types/marketingAnalytics';

const URL = {
  marketing: '/account/email-stats/',
  byCampaignType: '/email-campaign/all-stats/',
};

export const getMarketingAnalyticsApi = async (): Promise<YearlyEmailStats[]> => {
  const data = await http().post(URL.marketing, {});
  return data?.data;
};
