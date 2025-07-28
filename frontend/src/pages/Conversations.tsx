import { Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SearchNotFound } from '@/assets/icons';
import { AssistantChatRow, PageHeader, UserChatRow } from '@/components/molecules';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchConversationAnalysis, useFetchSessionAnalysis } from '@/hooks/api';
import { useFetchSessionDetail } from '@/hooks/api/useFetchSessionDetailById';
import { useGetAllSessions } from '@/hooks/api/useGetAllSessions';
import { cn, formatDuration, formatTimestampToDayTime, toTitleCase } from '@/lib/utils';

const Conversations = () => {
  const [selected, setSelected] = useState<any>({
    chatbot_id: undefined,
    sessionId: undefined,
  });

  const { data: sessionList, isLoading } = useGetAllSessions();
  useEffect(() => {
    if (sessionList) {
      setSelected(sessionList[0]);
    }
  }, [sessionList]);

  const { data: sessionDetail, isLoading: isDetailLoading } = useFetchSessionDetail(
    selected?.chatbot_id || '',
    (selected?._id as string) || '',
    {},
  );
  const { data: conversationDetail, isLoading: isConvAnalysisLoading } =
    useFetchConversationAnalysis(selected?.chatbot_id || '', (selected?._id as string) || '');
  const { data: sessionAnalysis, isLoading: isSessionAnalysisLoading } = useFetchSessionAnalysis(
    selected?.chatbot_id || '',
    (selected?._id as string) || '',
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
        <PageHeader title="Conversations">
          <></>
        </PageHeader>
        {!isLoading && !sessionList && (
          <div className="flex h-full justify-center items-center flex-col gap-2 p-5">
            <SearchNotFound />
            <p className="text-gray-700">No conversation found</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 10 }, (_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </div>
        )}

        {sessionList && !sessionList.length && (
          <div className="flex h-full justify-center items-center flex-col gap-2 p-5">
            <SearchNotFound />
            <p className="text-gray-700">No conversations found</p>
          </div>
        )}

        {!isLoading && sessionList && !!sessionList.length && (
          <div className="grid grid-cols-[minmax(100px,300px)_minmax(400px,1fr)_minmax(100px,400px)] gap-2">
            <Card className="p-4 flex flex-col overflow-auto max-h-[80vh]">
              {!isLoading && (
                <>
                  <div className="relative mb-4">
                    <Search className="absolute left-2 top-3 h-4 w-4  text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" disabled />
                  </div>
                  {sessionList &&
                    !!sessionList.length &&
                    sessionList.map((session: any, idx: number) => (
                      <>
                        <div
                          className={cn(
                            'flex items-center gap-1 cursor-pointer p-2 rounded-xl py-4 hover:bg-purple-50',
                            { 'bg-purple-200': selected._id === session._id },
                          )}
                          onClick={() => setSelected(session)}
                        >
                          <User className="h-6 w-6 stroke-purple-500 " />
                          <p className="truncate w-min text-sm font-medium" key={idx}>
                            {session._id}
                          </p>
                        </div>
                        <Separator className="my-2" />
                      </>
                    ))}
                </>
              )}
            </Card>
            <Card className="px-4 py-2 overflow-auto max-h-[80vh] ">
              {!isDetailLoading &&
                !!sessionDetail?.session_info.length &&
                sessionDetail?.session_info.map((session: any, idx: number) => (
                  <div className="flex flex-col py-2 gap-3 ">
                    {idx !== 0 && (
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
                <div className="flex h-full justify-center items-center flex-col gap-2 p-5">
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
                {!isDetailLoading && !sessionDetail && (
                  <div className="flex items-center justify-center flex-col gap-2 p-5">
                    <SearchNotFound className="w-20 h-20" />
                    <p className="text-gray-700">No conversation found</p>
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

                {!isConvAnalysisLoading && (
                  <div className="flex  flex-col gap-2 py-2">
                    <h2 className="text-md font-semibold mb-2">Session Data Collection</h2>
                    {conversationDetail && (
                      <div className="flex flex-col gap-2">{objectToHtml(conversationDetail)}</div>
                    )}
                  </div>
                )}
                {!isConvAnalysisLoading && !conversationDetail && (
                  <div className="flex items-center justify-center flex-col gap-2 p-5">
                    <SearchNotFound className="w-20 h-20" />
                    <p className="text-gray-700">No conversation found</p>
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

                {!isSessionAnalysisLoading && (
                  <div className="flex  flex-col gap-2 py-2">
                    <h2 className="text-md font-semibold mb-2">Session Analytics</h2>
                    {sessionAnalysis && (
                      <div className="flex flex-col gap-2">{objectToHtml(sessionAnalysis)}</div>
                    )}
                  </div>
                )}
                {!isSessionAnalysisLoading && !sessionAnalysis && (
                  <div className="flex items-center justify-center flex-col gap-2 p-5">
                    <SearchNotFound className="w-20 h-20" />
                    <p className="text-gray-700">No conversation found</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

{
  /* <div className="grid grid-cols-[1fr_400px] gap-2"> */
}
{
  /* Conversation Detail */
}
// <Card className="px-4 py-2 overflow-auto max-h-[80vh] ">
//     {!isDetailLoading &&
//         !!sessionDetail?.session_info.length &&
//         sessionDetail?.session_info.map((session: any) => (
//             <div className="flex flex-col py-2 gap-3 ">
//                 <UserChatRow
//                     chat={session.user}
//                     name="User"
//                     time_stamp={formatTimestampToDayTime(session.timestamp)}
//                 />
//                 <AssistantChatRow
//                     chat={session.assistant}
//                     time_stamp={formatTimestampToDayTime(session.timestamp)}
//                 />
//             </div>
//         ))}
//     {((sessionDetail &&
//         sessionDetail?.session_info.length === 0 &&
//         !sessionDetail?.session_info.length) ||
//         (!sessionDetail && !isDetailLoading)) && (
//             <div className="flex h-full justify-center items-center flex-col gap-2 p-5">
//                 <SearchNotFound />
//                 <p className="text-gray-700">No conversation found</p>
//             </div>
//         )}
//     {isDetailLoading && !sessionDetail && (
//         <div className="flex flex-col gap-2">
//             <Skeleton className="h-8 w-[48%]" />
//             <Skeleton className="h-8 w-[48%] self-end" />
//             <Skeleton className="h-8 w-[48%]" />
//             <Skeleton className="h-8 w-[48%] self-end" />
//             <Skeleton className="h-8 w-[48%]" />
//             <Skeleton className="h-8 w-[48%] self-end" />
//             <Skeleton className="h-8 w-[48%]" />
//             <Skeleton className="h-8 w-[48%] self-end" />
//         </div>
//     )}
// </Card>

//     <div className="flex flex-col gap-2.5">
//         {/* Session Info */}
//         <Card className="px-4 py-2 overflow-auto max-h-500 h-max">
//             {isDetailLoading && (
//                 <div className="flex  h-full justify-center flex-col gap-2">
//                     <Skeleton className="h-6 w-full" />
//                     <Skeleton className="h-6 w-full" />
//                     <Skeleton className="h-6 w-full" />
//                     <Skeleton className="h-6 w-full" />
//                 </div>
//             )}

//             {!isDetailLoading && (
//                 <div className="flex  flex-col gap-2 py-2">
//                     <h2 className="text-md font-semibold mb-2">Session Info</h2>
//                     {sessionDetail && (
//                         <div className="flex flex-col gap-2">
//                             {objectToHtml({
//                                 'Total time of conversation': sessionDetail?.total_time_of_conversation
//                                     ? formatDuration(sessionDetail?.total_time_of_conversation)
//                                     : formatDuration('0.0'),
//                                 Conversion: sessionDetail?.conversion
//                                     ? toTitleCase(sessionDetail?.conversion)
//                                     : 'n/a',
//                                 'Time to Conversion': sessionDetail?.conversion_duration
//                                     ? formatDuration(sessionDetail?.conversion_duration)
//                                     : formatDuration('0.0'),
//                             })}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {!isDetailLoading && !sessionDetail && (
//                 <div className="flex items-center  justify-center flex-col gap-2 p-2.5">
//                     <SearchNotFound className="w-20 h-20" />
//                     <p className="text-gray-700">No conversation found</p>
//                 </div>
//             )}
//         </Card>

//         {/* Session Data Collection */}
//         <Card className="px-4 py-2 overflow-auto max-h-500 h-max">
//             {isConvAnalysisLoading && (
//                 <div className="flex  h-full justify-center flex-col gap-2">
//                     <Skeleton className="h-6 w-full" />
//                     <Skeleton className="h-6 w-full" />
//                     <Skeleton className="h-6 w-full" />
//                     <Skeleton className="h-6 w-full" />
//                 </div>
//             )}

//             {!isConvAnalysisLoading && (
//                 <div className="flex  flex-col gap-2 py-2">
//                     <h2 className="text-md font-semibold mb-2">Session Data Collection</h2>
//                     {conversationDetail && (
//                         <div className="flex flex-col gap-2">{objectToHtml(conversationDetail)}</div>
//                     )}
//                 </div>
//             )}
//             {!isConvAnalysisLoading && !conversationDetail && (
//                 <div
//                     className="flex items-center justify-center flex-col gap-2 p-2.5"
//                 >
//                     <SearchNotFound className="w-20 h-20" />
//                     <p className="text-gray-700">No conversation found</p>
//                 </div>
//             )}
//         </Card>

//         {/* Session Analytics */}
//         <Card className="px-4 py-2 overflow-auto max-h-500 h-max">
//             {isSessionAnalysisLoading && (
//                 <div className="flex  h-full justify-center flex-col gap-2">
//                     <Skeleton className="h-6 w-full" />
//                     <Skeleton className="h-6 w-full" />
//                     <Skeleton className="h-6 w-full" />
//                     <Skeleton className="h-6 w-full" />
//                 </div>
//             )}

//             {!isSessionAnalysisLoading && (
//                 <div className="flex  flex-col gap-2 py-2">
//                     <h2 className="text-md font-semibold mb-2">Session Analytics</h2>
//                     {sessionAnalysis && (
//                         <div className="flex flex-col gap-2">{objectToHtml(sessionAnalysis)}</div>
//                     )}
//                 </div>
//             )}
//             {!isSessionAnalysisLoading && !sessionAnalysis && (
//                 <div className="flex items-center justify-center flex-col gap-2 p-2.5">
//                     <SearchNotFound className="w-20 h-20" />
//                     <p className="text-gray-700">No conversation found</p>
//                 </div>
//             )}

//         </Card>
//     </div>
// </div>

export default Conversations;
