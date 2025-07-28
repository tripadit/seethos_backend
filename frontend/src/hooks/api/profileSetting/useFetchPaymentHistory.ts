import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { endpoints } from '@/global/endpoints';
import http from '@/utils/http';
export interface IInvoice {
  id: string;
  account_name: string;
  account_tax_ids: null;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  amount_shipping: number;
  hosted_invoice_url: string;
  number: string;
  status: string;
  currency: string;
  invoice_pdf: string;
  created: number;
}
interface IInvoiceResponse {
  data: IInvoice[];
}
export const useFetchPaymentHistory = (): UseQueryResult<IInvoiceResponse, any> => {
  const getData = () => {
    const url = endpoints.stripe.paymentHistory;
    return http().get(url);
  };
  return useQuery({
    queryKey: ['get-payment-history'],
    queryFn: getData,
  });
};
