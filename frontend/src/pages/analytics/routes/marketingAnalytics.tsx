import { PageHeader } from '@/components/molecules';
import AnalyticsByCampaignType from '@/pages/analytics/components/marketingAnalytics/AnalyticsByCampaignType.tsx';

const MarketingAnalytics = () => {
  return (
    <>
      <PageHeader title="Marketing Analytics">
        <></>
      </PageHeader>
      <div className="w-full max-w-[1300px] my-4 flex flex-col gap-6 flex-1">
        <div>
          <AnalyticsByCampaignType />
        </div>
      </div>
    </>
  );
};

export default MarketingAnalytics;
