import { useNavigate } from 'react-router-dom';

import { AddIcon } from '@/assets/icons';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { CTooltip, DashboardCard, PageHeader } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import {
  useFetchAvgConversion,
  useFetchBotInfo,
  // useFetchConversion,
  useFetchConversionActive,
  useFetchConversionSession,
  useFetchQueryCount,
} from '@/hooks/api';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { formatDuration } from '@/lib/utils';
import { routes } from '@/routes/routes';

import { UserAppOnBoarding } from '../components/dashboard/onBoarding';
import { DashboardTable } from '../components/dashboard/table';

// const PLANS: { [key in SubscriptionType]: string } = {
//   [SubscriptionType.LOW]: 'Essential Package',
//   [SubscriptionType.INTERMEDIATE]: 'Professional Package',
//   [SubscriptionType.ADVANCED]: 'Platinum Package',
//   [SubscriptionType.CUSTOM]: 'Enterprise Solution',
// };

const Dashboard = () => {
  const { data: sessionConversionData, isLoading: isSessionConversionLoading } =
    useFetchConversionSession();
  const { data: queryCountData, isLoading: isQueryCountLoading } = useFetchQueryCount();
  const { data: activeConversionData, isLoading: isActiveConversionLoading } =
    useFetchConversionActive();
  const { data: avgConversionData, isLoading: isAvgConversionLoading } = useFetchAvgConversion();
  const { data: chatBotInfo, isLoading: isInfoLoading } = useFetchBotInfo();
  const navigate = useNavigate();
  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();

  return (
    <div className="mb-20">
      <PageHeader title="Assistant">
        <div className="flex items-center gap-2">
          {/* {!isFetching && personalInfo && (
            <div className="flex items-center gap-1 mr-6 font-semibold">
              <p className="text-gray-500">Current:</p>
              <p className="text-[#00A0E9]">{`${
                personalInfo.data.subscription_type
                  ? getPlanValue(personalInfo.data.subscription_type as SubscriptionType)
                  : 'N/A'
              }`}</p>
            </div>
          )}
          <CTooltip text="Upgrade Plan">
            <Button
              className="capitalize text-white gap-3"
              variant="outline"
              onClick={toggleUpgradeDialog}
            >
              <UptrendIcon /> <p className="text-gray-700">Upgrade Plan</p>
            </Button>
          </CTooltip> */}
          <CTooltip text="Create Agent">
            <Button
              className="capitalize bg-purple-500 text-white gap-3"
              onClick={() => checkAccount(() => navigate(routes.addAssistance))}
            >
              <AddIcon /> <p>Add Assistant</p>
            </Button>
          </CTooltip>
        </div>
      </PageHeader>
      <div className="pb-2  flex w-[100%] overflow-hidden hover:overflow-auto  gap-6 my-4 ">
        <DashboardCard
          title="Active Assitant"
          isLoading={isInfoLoading || isActiveConversionLoading}
          count={chatBotInfo?.active_chatbot || 0}
          growth={activeConversionData?.last_month || 0}
          hasGrowthCount
        />
        <DashboardCard
          title="Sessions"
          isLoading={isInfoLoading || isSessionConversionLoading}
          count={chatBotInfo?.total_session || 0}
          growth={sessionConversionData?.last_month || 0}
          hasGrowthCount
        />
        <DashboardCard
          title="Total Conversation Duration"
          isLoading={isInfoLoading}
          count={
            chatBotInfo?.total_conversion_duration
              ? formatDuration(chatBotInfo?.total_conversion_duration)
              : formatDuration('0.0')
          }
          growth={avgConversionData?.last_month || 0}
          hasGrowthCount
        />
        <DashboardCard
          title="Avg time to Conversion"
          isLoading={isInfoLoading || isAvgConversionLoading}
          count={
            chatBotInfo?.time_to_conversion
              ? formatDuration(chatBotInfo?.time_to_conversion)
              : formatDuration('0.0')
          }
          growth={avgConversionData?.last_month || 0}
          hasGrowthCount
        />
        <DashboardCard
          title="Query Count"
          isLoading={isInfoLoading || isQueryCountLoading}
          count={chatBotInfo?.query_count || 0}
          growth={queryCountData?.last_month || 0}
          hasGrowthCount
        />
      </div>
      <DashboardTable />
      {/* Render the dialog conditionally */}
      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}
      <UserAppOnBoarding />
    </div>
  );
};
export default Dashboard;
