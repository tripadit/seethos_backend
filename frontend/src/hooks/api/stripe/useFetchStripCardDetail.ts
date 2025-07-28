import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';
interface ICardDetails {
  card_brand: string;
  card_last4: string;
  expiration_month: number;
  expiration_year: number;
}
export const useFetchStripCardDetail = (rest?: any): UseQueryResult<ICardDetails, any> => {
  const fetchMe = () => {
    const url = endpoints.stripe.cardDetails;
    return http().get(url);
  };
  return useQuery({
    queryKey: ['get-card-details'],
    queryFn: fetchMe,
    ...rest,
  });
};
