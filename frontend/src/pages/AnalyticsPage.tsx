import { useState } from 'react';

import { DashboardCard, PageHeader } from '@/components/molecules';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useFetchAvgConversion,
  useFetchBotInfo,
  useFetchChatBot,
  useFetchConversionActive,
  useFetchConversionSession,
  useFetchPeakHoursByBotId,
  useFetchQueryCount,
} from '@/hooks/api';
import { useFetchBotProgression } from '@/hooks/useFetchBotProgression';
import { formatDuration, getAbbreviation, getKeyWithHighestCount } from '@/lib/utils';

const AnalyticsPage = () => {
  const [botId, setBotId] = useState<string>('');
  const { data: sessionConversionData, isLoading: isSessionConversionLoading } =
    useFetchConversionSession();
  const { data: activeConversionData, isLoading: isActiveConversionLoading } =
    useFetchConversionActive();
  const { data: chatBotInfo, isLoading: isInfoLoading } = useFetchBotInfo();
  const { data: avgConversionData, isLoading: isAvgConversionLoading } = useFetchAvgConversion();
  const { data: chatBotDetail, isLoading } = useFetchChatBot('');
  const { data: queryCountData, isLoading: isQueryCountLoading } = useFetchQueryCount();
  const { data: botProgressionData, isLoading: isProgressionLoading } =
    useFetchBotProgression(botId);
  const { data: peakHoursData, isLoading: isPeakHourLoading } = useFetchPeakHoursByBotId(botId);

  const getPeakHoursData = () => {
    if (peakHoursData) {
      return getKeyWithHighestCount(peakHoursData);
    } else {
      return '00:00';
    }
  };

  return (
    <>
      <PageHeader title="Analytics" isLoading={isLoading}>
        <></>
      </PageHeader>
      <div className="scroller pb-2  flex w-[100%] overflow-hidden hover:overflow-auto  gap-6 my-4 ">
        <DashboardCard
          title="Total Active Assitant"
          isLoading={isInfoLoading || isActiveConversionLoading}
          count={chatBotInfo?.active_chatbot || 0}
          growth={activeConversionData?.last_month || 0}
          hasGrowthCount
        />
        <DashboardCard
          title="Total Sessions"
          isLoading={isInfoLoading || isSessionConversionLoading}
          count={chatBotInfo?.total_session || 0}
          growth={sessionConversionData?.last_month || 0}
          hasGrowthCount
        />
        <DashboardCard
          title="Avg time to Conversion"
          isLoading={isInfoLoading || isAvgConversionLoading}
          count={
            chatBotInfo?.time_to_conversion
              ? formatDuration(chatBotInfo?.time_to_conversion || 0)
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
      {isLoading && (
        <>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
        </>
      )}
      {!isLoading && (
        <Accordion type="single" collapsible>
          <div className="flex flex-col gap-2.5">
            {!!chatBotDetail?.data.length &&
              chatBotDetail?.data.map((data: any, idx: number) => (
                <div key={idx}>
                  <AccordionItem value={`item-${idx + 1}`}>
                    <AccordionTrigger onClick={() => setBotId(data.id)}>
                      <div className="flex gap-2 items-center">
                        <Avatar className="bg-purple-100">
                          <AvatarImage src={data.avatar} />
                          <AvatarFallback>{getAbbreviation(data.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-lg font-semibold">{data.name}</h2>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
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
                          count={botProgressionData?.total_conversion || 0}
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
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
          </div>
        </Accordion>
      )}
    </>
  );
};

export default AnalyticsPage;
