import { ColumnDef } from '@tanstack/react-table';
import { CopyIcon } from 'lucide-react';

import { DataTable } from '@/components/molecules';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { useGetDomainById } from '../../hooks/hooks';

const CopyText = ({ text }: { text: string }) => {
  const { toast } = useToast();

  return (
    <CopyIcon
      className="cursor-pointer"
      size={12}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        toast({ title: 'Copied to clipboard', variant: 'success' });
      }}
    />
  );
};

const columns: ColumnDef<{ name: string; type: string; value: string; status: string }>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex gap-2">
          <div className=" max-w-[80px] truncate ">{row.original.name}</div>
          <CopyText text={row.original.name} />
        </div>
      );
    },
  },
  {
    header: 'Type',
    accessorKey: 'type',
    cell: ({ row }: { row: any }) => {
      return (
        <div>
          <div>{row.original.type}</div>
        </div>
      );
    },
  },
  {
    header: 'Value',
    accessorKey: 'value',
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex gap-2">
          <div className=" max-w-[80px] truncate ">{row.original.value}</div>
          <CopyText text={row.original.value} />
        </div>
      );
    },
  },
];

export default function StepTwoComponent({ onNext, domain }: { onNext: () => void; domain?: any }) {
  const domainData = useGetDomainById(domain.id, !domain?.mx_verified || !domain?.domain_verified);

  const doMain = domainData?.data || domain;

  const transformDomainToTableData = (domain: any) => {
    const data: any = [];
    Object.entries(domain.dkim_key).forEach(([key, value]) => {
      data.push({ name: key, type: 'CNAME', value });
    });
    data.push({ name: domain.domain, type: 'MX', value: domain.mx_records });
    data.push({ name: domain.domain, type: 'TXT', value: domain.txt_records });
    return data;
  };
  return (
    <div>
      <div className="mb-2">Configure DNS</div>
      <div className="text-gray-600 text-xs mb-4">Add these DNS records to your domain</div>
      <DataTable data={transformDomainToTableData(domain)} columns={columns} />
      <div className="w-full items-center flex  justify-between">
        {!doMain?.isLoading && (
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={doMain?.domain_verified ? 'success' : 'warning'}
              className="text-xs min-w-fit"
            >
              {doMain?.domain_verified ? 'Domain Verified' : 'Domain Verification Pending'}
            </Badge>
            <Badge
              variant={doMain?.domain_verified ? 'success' : 'warning'}
              className="text-xs min-w-fit"
            >
              {doMain?.domain_verified ? 'MX Verified' : 'MX Verification Pending'}
            </Badge>
          </div>
        )}
        <Button
          variant="purple"
          isLoading={domainData?.isFetching}
          onClick={() => {
            if (doMain?.domain_verified && doMain?.mx_verified) {
              onNext();
            } else {
              domainData?.refetch();
            }
          }}
        >
          {doMain?.domain_verified && doMain?.mx_verified ? 'Done' : 'Verify'}
        </Button>
      </div>
    </div>
  );
}
