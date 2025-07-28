import { useNavigate } from 'react-router-dom';

import { DashboardCard, PageHeader } from '@/components/molecules';
import { useFetchPeakHoursByBotId } from '@/hooks/api';
import { useFetchBotProgression } from '@/hooks/useFetchBotProgression';
import { formatDuration, getKeyWithHighestCount } from '@/lib/utils';
import { routes } from '@/routes/routes';

interface IBotAnalyticsProps {
  botId: string;
}

const BotAnalytics = ({ botId }: IBotAnalyticsProps) => {
  const navigate = useNavigate();
  const { data: peakHoursData, isLoading: isPeakHourLoading } = useFetchPeakHoursByBotId(botId);
  const { data: botProgressionData, isLoading: isProgressionLoading } =
    useFetchBotProgression(botId);

  const getPeakHoursData = () => {
    if (peakHoursData) {
      return getKeyWithHighestCount(peakHoursData);
    } else {
      return '00:00';
    }
  };
  return (
    <div>
      <PageHeader
        title="Agent Analytics"
        isLoading={isProgressionLoading}
        isChildPage
        onBackPress={() => navigate(routes.dashboard)}
      >
        <></>
      </PageHeader>
      <div>
        <div className="grid grid-cols-3 gap-5">
          <DashboardCard
            title="Peak Interaction Time"
            isLoading={isPeakHourLoading}
            count={getPeakHoursData()}
          />
          <DashboardCard
            title="Query Count"
            isLoading={isProgressionLoading}
            count={botProgressionData?.query_count || 0}
            growth={botProgressionData?.query_count_prgression || 0}
            hasGrowthCount
          />
          <DashboardCard
            title="Active Sessions"
            isLoading={isProgressionLoading}
            count={botProgressionData?.active_session || 0}
            growth={botProgressionData?.active_session_prgression || 0}
            hasGrowthCount
          />
          <DashboardCard
            title="Total Duration"
            isLoading={isProgressionLoading}
            count={
              botProgressionData?.total_duration
                ? formatDuration(botProgressionData?.total_duration)
                : formatDuration('0.0')
            }
            growth={botProgressionData?.total_duration_prgression || 0}
            hasGrowthCount
          />
          <DashboardCard
            title="Sessions"
            isLoading={isProgressionLoading}
            count={botProgressionData?.total_session || 0}
            growth={botProgressionData?.total_session_prgression || 0}
            hasGrowthCount
          />

          <DashboardCard
            title="Avg time to Conversion"
            isLoading={isProgressionLoading}
            count={
              botProgressionData?.avg_time_to_conversion
                ? formatDuration(botProgressionData?.avg_time_to_conversion)
                : formatDuration('0.0')
            }
            growth={botProgressionData?.avg_time_to_conversion_prgression || 0}
            hasGrowthCount
          />
          <DashboardCard
            title="Total CTA Click"
            isLoading={isProgressionLoading}
            count={botProgressionData?.total_conversion}
            growth={botProgressionData?.total_conversion_prgression || 0}
            hasGrowthCount
          />
          <DashboardCard
            title="Avg Duration"
            isLoading={isProgressionLoading}
            count={
              botProgressionData?.avg_duration
                ? formatDuration(botProgressionData?.avg_duration)
                : formatDuration('0.0')
            }
            growth={botProgressionData?.avg_duration_prgression || 0}
            hasGrowthCount
          />
          <DashboardCard
            title="Total Visits"
            isLoading={isProgressionLoading}
            count={botProgressionData?.total_visit || 0}
            growth={botProgressionData?.total_visit_prgression || 0}
            hasGrowthCount
          />
        </div>
      </div>
    </div>
  );
};

export default BotAnalytics;
