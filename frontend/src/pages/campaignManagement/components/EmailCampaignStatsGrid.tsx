import { DashboardCard } from '@/components/molecules';

export default function EmailCampaignStatsGrid({
  stats,
  isLoading,
}: {
  stats?: {
    send_count: number;
    recieved: number;
    bounce_count: number;
    click_count: number;
    complaint_count: number;
    delivery_count: number;
    open_count: number;
    success_rate: number;
  };
  isLoading: boolean;
}) {
  return (
    <div className="flex gap-6 my-6 flex-wrap">
      <DashboardCard
        showRightChartIcon
        showRightIcon
        title={'Sent Emails'}
        isLoading={isLoading}
        count={stats?.send_count || 0}
      />
      <DashboardCard
        showRightChartIcon
        showRightIcon
        title={'Received Emails'}
        isLoading={isLoading}
        count={stats?.recieved || 0}
      />
      <DashboardCard
        showRightChartIcon
        showRightIcon
        title={'Bounced'}
        isLoading={isLoading}
        count={stats?.bounce_count || 0}
      />
      <DashboardCard
        showRightChartIcon
        showRightIcon
        title={'Clicks'}
        isLoading={isLoading}
        count={stats?.click_count || 0}
      />
      <DashboardCard
        showRightChartIcon
        showRightIcon
        title={'Complaints'}
        isLoading={isLoading}
        count={stats?.complaint_count || 0}
      />

      <DashboardCard
        showRightChartIcon
        showRightIcon
        title={'Delivered'}
        isLoading={isLoading}
        count={stats?.delivery_count || 0}
      />
      <DashboardCard
        showRightChartIcon
        showRightIcon
        title={'Opened'}
        isLoading={isLoading}
        count={stats?.open_count || 0}
      />
      {/* <DashboardCard
        showRightChartIcon
        showRightIcon
        title={'Success Rate'}
        isLoading={isLoading}
        count={(stats?.success_rate || 0) + '%'}
      /> */}
    </div>
  );
}
