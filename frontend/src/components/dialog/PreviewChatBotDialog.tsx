// @ts-nocheck
import clsx from 'clsx';
import { X } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
export const PreviewChatBotDialog = ({
  onClose,
  chatBotDetail,
}: {
  onClose: () => void;
  chatBotDetail: any;
  script?: string;
  isOpen: boolean;
}) => {
  const [loading, setLoading] = React.useState(true);
  const isDark = chatBotDetail?.theme === 'dark';

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <>
      <div
        onClick={() => {
          onClose();
        }}
        className="fixed inset-0 z-50 bg-gray-500 opacity-90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      ></div>
      <div
        className={clsx(
          'fixed left-[50%] overflow-auto top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-background sm:p-6 p-4  duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
          {
            'bg-black': isDark,
            ' border ': !isDark,
          },
        )}
      >
        <div className="flex flex-1  flex-col h-full relative z-[999999] pt-2  gap-8">
          {!chatBotDetail.status && (
            <div
              className={cn(
                'h-[500px] w-full rounded-xl flex flex-col items-center justify-center bg-secondary',
              )}
            >
              <h4 className="text-gray-900 text-xl font-semibold"> Agent is currently disabled.</h4>
              <p className="text-gray-500 text-sm">
                Activate the agent to begin your conversation.
              </p>
            </div>
          )}
          {chatBotDetail.status && (
            <div>
              <h1
                className={clsx('text-base sm:text-2xl text-gray-700 font-semibold text-center', {
                  'text-white': isDark,
                })}
              >
                Say Hello to your new assistant!
              </h1>
              <p
                className={clsx('text-sm font-normal text-gray-500 text-center', {
                  'text-white': isDark,
                })}
              >
                Go ahead and see how your assistant interacts with your clients.
              </p>
            </div>
          )}
          {loading && <Skeleton className="h-[290px]" />}
          <Card
            className={clsx('overflow-auto', {
              'bg-black': isDark,
              'hidden ': loading,
            })}
          >
            <duality-chat-bot
              chatBotId={chatBotDetail.bot_id}
              layout="screen"
              theme={chatBotDetail?.theme}
              wrapperClassName="chat-bot-wrapper-preview"
            />
          </Card>
          <div className="absolute sm:hidden right-0 top-1">
            <X onClick={onClose} />
          </div>
        </div>
      </div>
    </>
  );
};
