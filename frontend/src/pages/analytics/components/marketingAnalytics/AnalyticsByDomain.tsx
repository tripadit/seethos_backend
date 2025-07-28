import { DashboardCard } from '@/components/molecules';

import { useGetEmailStatsByDomain } from '../../hooks/marketingAnalytics';

export default function AnalyticsByDomain({ id, domain }: { id: string; domain: any }) {
  const { data, isLoading } = useGetEmailStatsByDomain(id);

  const getEmailStatsArray = () => {
    return data?.MetricDataResults?.map((item: any) => {
      const sum = item.Values.reduce((a: number, b: number) => a + b, 0);
      return {
        label: item.Label,
        count: (item.Id = 'success_rate' ? item.Values[0] || 0 : sum),
        growth:
          item?.Values?.length > 1 ? ((item.Values[0] - item.Values[1]) / item.Values[1]) * 100 : 0,
      };
    });
  };
  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold"> Domain: {domain.domain}</h1>
        <hr className="my-4" />
      </div>

      <div className="flex flex-wrap gap-6">
        {getEmailStatsArray()?.map((item: any, index: number) => (
          <DashboardCard
            showRightChartIcon
            showRightIcon
            key={index.toString()}
            title={item.label}
            isLoading={isLoading}
            count={item.count}
            growth={item.growth}
            fall={-item.growth}
            hasGrowthCount={item.growth >= 0}
            hasFallCount={item.growth < 0}
          />
        ))}
      </div>
    </div>
  );
}
