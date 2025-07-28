import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '@/components/molecules';
import { TableTemplate } from '@/components/template';
import { useFetchChatbot, useFetchLeadList } from '@/hooks/api';
import { getValueOrDefault, toTitleCase } from '@/lib/utils';
import { routes } from '@/routes/routes';

type ILeadList = {
  [x: string]: string;
};

const LeadList = ({ id }: { id?: string | null }) => {
  const params: any = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const { data: leadList, isLoading } = useFetchLeadList(id as string, search);
  const { data: botDetail, isLoading: isBotDetailLoading } = useFetchChatbot(
    id || (params?.id as string),
  );

  const getCols: string[] = useMemo(() => {
    if (botDetail && botDetail?.question) {
      const cols = botDetail?.question.split(',');
      if (cols.includes('')) {
        cols.splice(cols.indexOf(''), 1);
      }
      return cols.length > 12 ? cols.slice(0, 12) : cols;
    } else {
      return [];
    }
  }, [botDetail?.question]);

  const generateColumns = useMemo(() => {
    if (getCols.length) {
      return getCols.map((col: any) => ({
        accessorKey: col.toString(),
        header: () => <div className="">{toTitleCase(col)}</div>,
        cell: ({ row }: any) => (
          <div className="font-medium">
            {row.getValue(col) === '' ? '-' : getValueOrDefault(row.getValue(col), '-')}
          </div>
        ),
      }));
    } else {
      return [];
    }
  }, [getCols]);

  const columns: ColumnDef<ILeadList>[] = [...generateColumns];

  const buildCSVData = useCallback(() => {
    let results: any[] = [];

    if (getCols.length && leadList && !isLoading) {
      // Push the header row
      results.push(getCols);

      leadList.forEach((lead: any) => {
        const rowData: any[] = [];
        getCols.forEach((col: string) => {
          rowData.push(lead[col]);
        });
        results.push(rowData);
      });
    }

    return results.length ? results : [[]];
  }, [getCols, leadList]);

  return (
    <div className="mb-20">
      <PageHeader
        title="Data Collection"
        isChildPage
        isLoading={isLoading}
        onBackPress={() => navigate(routes.dashboard)}
      >
        <></>
      </PageHeader>
      <TableTemplate
        onSearch={(value: string) => setSearch(value)}
        isLoading={isLoading || isBotDetailLoading}
        // title="Data Collection"
        columns={columns}
        data={!!getCols.length && leadList ? leadList : []}
        buildCSVData={buildCSVData}
      />
    </div>
  );
};

export default LeadList;
