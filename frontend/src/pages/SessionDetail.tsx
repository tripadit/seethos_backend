import { useNavigate, useParams } from 'react-router-dom';

import { SearchNotFound } from '@/assets/icons';
import { AssistantChatRow, PageHeader, UserChatRow } from '@/components/molecules';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouteQuery } from '@/hooks';
import { useFetchConversationAnalysis, useFetchSessionAnalysis } from '@/hooks/api';
import { useFetchSessionDetail } from '@/hooks/api/useFetchSessionDetailById';
import { formatDuration, formatTimestampToDayTime, toTitleCase } from '@/lib/utils';

const SessionDetailPage = () => {
  const sessionId = useRouteQuery('session_id');

  const params = useParams();
  const navigate = useNavigate();

  const { data: sessionDetail, isLoading: isDetailLoading } = useFetchSessionDetail(
    params?.id || '',
    sessionId as string,
    {},
  );
  const { data: conversationDetail, isLoading: isConvAnalysisLoading } =
    useFetchConversationAnalysis(params?.id || '', sessionId as string);
  const { data: sessionAnalysis, isLoading: isSessionAnalysisLoading } = useFetchSessionAnalysis(
    params?.id || '',
    sessionId as string,
  );

  function objectToHtml(obj: { [key: string]: any }) {
    try {
      const elements: JSX.Element[] = [];
      for (const [key, value] of Object.entries(obj)) {
        elements.push(
          <p className="text-gray-700 text-sm" key={key}>
            <span>{key}</span>: <strong>{value ? value : 'n/a'}</strong>
          </p>,
        );
      }
      return elements;
    } catch (error) {
      return <p>{JSON.stringify(obj)}</p>;
    }
  }

  return (
    <div>
      <>
        <PageHeader
          title="Conversation Info"
          isLoading={isDetailLoading}
          subTitle={'Session: ' + sessionId}
          isChildPage
          onBackPress={() =>
            navigate('/dashboard/assistant-detail/:id/sessions'.replace(':id', params.id as string))
          }
        >
          <div className="flex items-center gap-4">{/* <p>Bluu Iframe Page</p> */}</div>
        </PageHeader>
        <div className="grid grid-cols-[1fr_400px] gap-2">
          {/* Conversation Detail */}
          <Card className="px-4 py-2 overflow-auto max-h-[80vh] ">
            {!isDetailLoading &&
              !!sessionDetail?.session_info.length &&
              sessionDetail?.session_info.map((session: any, index: number) => (
                <div className="flex flex-col py-2 gap-3 ">
                  {index !== 0 && (
                    <UserChatRow
                      chat={session.user}
                      name="User"
                      time_stamp={formatTimestampToDayTime(session.timestamp)}
                    />
                  )}
                  <AssistantChatRow
                    chat={session.assistant}
                    time_stamp={formatTimestampToDayTime(session.timestamp)}
                  />
                </div>
              ))}
            {((sessionDetail &&
              sessionDetail?.session_info.length === 0 &&
              !sessionDetail?.session_info.length) ||
              (!sessionDetail && !isDetailLoading)) && (
              <div className="flex items-center flex-col gap-2 p-5">
                <SearchNotFound />
                <p className="text-gray-700">No conversation found</p>
              </div>
            )}
            {isDetailLoading && !sessionDetail && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-[48%]" />
                <Skeleton className="h-8 w-[48%] self-end" />
                <Skeleton className="h-8 w-[48%]" />
                <Skeleton className="h-8 w-[48%] self-end" />
                <Skeleton className="h-8 w-[48%]" />
                <Skeleton className="h-8 w-[48%] self-end" />
                <Skeleton className="h-8 w-[48%]" />
                <Skeleton className="h-8 w-[48%] self-end" />
              </div>
            )}
          </Card>

          <div className="flex flex-col gap-2.5">
            {/* Session Info */}
            <Card className="px-4 py-2 overflow-auto max-h-500 h-max">
              {isDetailLoading && (
                <div className="flex  h-full justify-center flex-col gap-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              )}
              {!isDetailLoading && !sessionDetail && (
                <div className="flex items-center justify-center flex-col gap-2 p-5">
                  <SearchNotFound className="w-20 h-20" />
                  <p className="text-gray-700">No conversation found</p>
                </div>
              )}
              {!isDetailLoading && (
                <div className="flex  flex-col gap-2 py-2">
                  <h2 className="text-md font-semibold mb-2">Session Info</h2>
                  {sessionDetail && (
                    <div className="flex flex-col gap-2">
                      {objectToHtml({
                        'Total time of conversation': sessionDetail?.total_time_of_conversation
                          ? formatDuration(sessionDetail?.total_time_of_conversation)
                          : formatDuration('0.0'),
                        Conversion: sessionDetail?.conversion
                          ? toTitleCase(sessionDetail?.conversion)
                          : 'n/a',
                        'Time to Conversion': sessionDetail?.conversion_duration
                          ? formatDuration(sessionDetail?.conversion_duration)
                          : formatDuration('0.0'),
                      })}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Session Data Collection */}
            <Card className="px-4 py-2 overflow-auto max-h-500 h-max">
              {isConvAnalysisLoading && (
                <div className="flex  h-full justify-center flex-col gap-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              )}
              {!isConvAnalysisLoading && !conversationDetail && (
                <div
                  className="flex items-                      {/* {displayKeyValuePairs(conversationDetail)} */}
                center justify-center flex-col gap-2 p-5"
                >
                  <SearchNotFound className="w-20 h-20" />
                  <p className="text-gray-700">No conversation found</p>
                </div>
              )}
              {!isConvAnalysisLoading && (
                <div className="flex  flex-col gap-2 py-2">
                  <h2 className="text-md font-semibold mb-2">Session Data Collection</h2>
                  {conversationDetail && (
                    <div className="flex flex-col gap-2">{objectToHtml(conversationDetail)}</div>
                  )}
                </div>
              )}
            </Card>

            {/* Session Analytics */}
            <Card className="px-4 py-2 overflow-auto max-h-500 h-max">
              {isSessionAnalysisLoading && (
                <div className="flex  h-full justify-center flex-col gap-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              )}
              {!isSessionAnalysisLoading && !sessionAnalysis && (
                <div className="flex items-center justify-center flex-col gap-2 p-5">
                  <SearchNotFound className="w-20 h-20" />
                  <p className="text-gray-700">No conversation found</p>
                </div>
              )}
              {!isSessionAnalysisLoading && (
                <div className="flex  flex-col gap-2 py-2">
                  <h2 className="text-md font-semibold mb-2">Session Analytics</h2>
                  {sessionAnalysis && (
                    <div className="flex flex-col gap-2">{objectToHtml(sessionAnalysis)}</div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </>
    </div>
  );
};

export default SessionDetailPage;
