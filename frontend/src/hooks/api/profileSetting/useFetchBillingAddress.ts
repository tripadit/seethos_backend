import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';
export interface IBillingAddress {
  id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  isDefault?: boolean;
  phone?: string;
}
interface IBillingAddressResponse {
  data: IBillingAddress[];
}
export const useFetchBillingAddress = (): UseQueryResult<IBillingAddressResponse, any> => {
  const getAllBillingAddress = () => {
    const url = endpoints.billingAddress.get;
    return http().get(url);
  };
  return useQuery({
    queryKey: ['get-all-billing-address'],
    queryFn: getAllBillingAddress,
  });
};
