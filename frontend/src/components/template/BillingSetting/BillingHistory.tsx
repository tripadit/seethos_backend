import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/molecules';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { IInvoice, useFetchPaymentHistory } from '@/hooks/api';
import { convertDateStringToFormattedDate } from '@/lib/utils';

export const BillingHistory = () => {
  const { data, isLoading } = useFetchPaymentHistory();
  const columns: ColumnDef<IInvoice>[] = [
    {
      accessorKey: 'created',
      header: () => <div className=" font-bold text-gray-600 whitespace-nowrap">Date Created</div>,
      cell: ({ row }) => {
        const timestamp: number = row.getValue('created');
        const date = new Date(timestamp * 1000);
        return (
          <div className="font-medium text-gray-500">
            {convertDateStringToFormattedDate(date.toLocaleDateString())}
          </div>
        );
      },
    },

    {
      accessorKey: 'amount_paid',
      header: () => <div className=" font-bold text-gray-600">Amount</div>,
      cell: ({ row }) => {
        const item: IInvoice = row.original;
        const currency = item.currency === 'usd' ? '$' : item.currency;
        return (
          <div className="font-medium text-gray-700 text-right">
            {currency}
            {(item.amount_paid / 100).toFixed(3)}
          </div>
        );
      },
    },
    {
      accessorKey: 'number',
      header: () => <div className=" font-bold text-gray-600">Invoice</div>,
      cell: ({ row }) => (
        <div className="font-medium text-purple-600">{row.getValue('number')}</div>
      ),
    },

    {
      accessorKey: 'status',
      header: () => <div className=" font-bold text-gray-600">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue('status');
        const variant =
          status === 'paid' ? 'successDark' : status === 'due' ? 'warning' : 'destructiveDark';
        return (
          <Badge variant={variant} className="capitalize rounded-md px-8 py-2">
            {row.getValue('status')}
          </Badge>
        );
      },
    },

    {
      accessorKey: 'action',
      header: () => <div className=""></div>,
      cell: ({ row }) => {
        const item: IInvoice = row.original;
        return (
          <div className="flex gap-5">
            <Button
              variant={'outline'}
              onClick={() => {
                window.open(item.hosted_invoice_url, '_blank');
              }}
            >
              View
            </Button>
            <Button
              variant={'outline'}
              className="whitespace-nowrap"
              onClick={() => {
                window.open(item.invoice_pdf, '_blank');
              }}
            >
              Download PDF
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Card className="p-10 gap-5 flex flex-col">
      <CardTitle className="text-gray-700 text-base">Billing History</CardTitle>
      <div className="h-[1px] bg-gray-200 w-full"></div>
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} />
    </Card>
  );
};
