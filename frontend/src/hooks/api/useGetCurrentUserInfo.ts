import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/global/endpoints';
import { appQuery } from '@/utils/constant/appQuery';
import http from '@/utils/http';
export interface IGetCurrentUserInfo {
  address?: string;
  city?: string;
  country?: string;
  date_joined: string;
  email: string;
  full_name: string;
  id: string;
  is_active: boolean;
  is_subscription_active: boolean;
  is_subscription_cancel: boolean;
  is_subscription_pause: boolean;
  is_verified: boolean;
  first_time_login: boolean;
  phone: null;
  state: null;
  company_sector?: string;
  subscription_pause_date: null;
  subscription_type: string;
  timezone: null;
  token: {
    refresh: string;
    access: string;
  };
  updated_at: string;
  zip_code: null;
  subscription_period: string;
  company_logo: string;
  company_name: string;
  is_demo?: boolean;
  ideal_customer_profile?: string;
  is_ghl_connected?: boolean;
}
interface IGetCurrentUserInfoResponse {
  data: IGetCurrentUserInfo;
}
export function useGetCurrentUserInfo(
  rest?: any,
): UseQueryResult<IGetCurrentUserInfoResponse, any> {
  const fetchMe = () => {
    const updatedEndpoints = endpoints.auth.me;
    return http().get(updatedEndpoints);
  };
  return useQuery({
    queryKey: [appQuery.getUserProfile],
    queryFn: fetchMe,
    ...rest,
  });
}
