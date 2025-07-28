import clsx from 'clsx';
import { SendIcon } from 'lucide-react';

import { ASSISTANCEASSIST } from '@/assets/assistance';
import { Card } from '@/components/ui/card';
import { ASSISTANCEAVATAR } from '@/pages/assistant/constant/addAssistance';
interface PreviewChatBotProps {
  assistanceName: string;
  greetingMessage?: string;
  assistanceAvatar: any;
  greetingTags: string[];
  isDataCollectionTap: boolean;
  brandColor: string;
  theme?: string;
}
export const PreviewChatBot = ({
  greetingMessage,
  assistanceName,
  assistanceAvatar,
  greetingTags,
  isDataCollectionTap = false,
  brandColor,
  theme,
}: PreviewChatBotProps) => {
  const avatar = ASSISTANCEAVATAR.find((item) => item.id === assistanceAvatar);
  const isLight = theme === 'light';
  const messages = [
    {
      type: 'user',
      message:
        "Hi! I'm interested in designing an advertisement for my small business, but I'm not sure where to start.",
    },
    {
      type: 'bot',
      message: `That's exciting! I'd love to help you create a standout ad. Could you tell me a bit more about your business and the message you want to convey?`,
    },
    {
      type: 'user',
      message: `Yes, I run a local bakery and I'd like to mention a special offer for first-time customers, maybe something like "10% off your first purchase of our gluten-free delights.`,
    },
    {
      type: 'bot',
      message: `Got it. That's a great incentive to attract new customers. Before we proceed, could I grab your email address so I can send you a draft of the ad for your feedback?`,
    },
    {
      type: 'user',
      message: `Sure, my email is bakerylover@email.com.`,
    },
    {
      type: 'bot',
      message: `Thanks! And just in case we need to reach you by phone, could you provide your number as well?`,
    },
    {
      type: 'user',
      message: ` Absolutely, it's (555) 123-4567.`,
    },
    {
      type: 'bot',
      message: `Perfect! Thanks for sharing that. I'll get started on the ad design right away and send you a draft as soon as it's ready. If you have any other questions or preferences you'd like to add, feel free to let me know!`,
    },
  ];
  return (
    <Card className="flex flex-col gap-2 p-5 cursor-not-allowed select-none w-full">
      <h4 className="text-lg font-semibold text-[#3A3A3A] text-center">
        Preview Model For Your Assistant
      </h4>

      <Card
        className={clsx('py-4 pt-0 px-2.5 flex flex-col gap-2', {
          'bg-black/90': !isLight,
        })}
      >
        <div className="flex gap-3 items-center py-2 border-b border-b-gray-200">
          <img
            src={avatar?.avatar ?? ASSISTANCEASSIST.AssistanceAvatar1}
            className="w-6 h-6 object-contain rounded-full"
          />
          <p
            className={clsx('text-sm flex-1  text-wrap truncate font-medium', {
              'text-white': !isLight,
            })}
          >
            {assistanceName}
          </p>
        </div>
        <div className="flex flex-col w-full gap-2">
          <div
            className={clsx(
              'w-max max-w-full text-wrap   px-2 py-1 rounded-sm rounded-bl-none text-[10px]',
              {
                'text-white bg-[#F8F8F8]/20': !isLight,
                'text-[#3A3A3A] bg-[#DADADA]': isLight,
              },
            )}
          >
            <p className="break-words">
              {greetingMessage ||
                `Good morning, my name is [FIRST_NAME], I'm [BUSINESS_NAME]'s assistant.  Is there anything I can quickly help you with?`}
            </p>
          </div>
          {!isDataCollectionTap && (
            <div className="flex flex-row flex-wrap items-center gap-2 ">
              {greetingTags?.map(
                (value, idx) =>
                  value !== '' && (
                    <div
                      key={idx}
                      className="py-1  px-2 border rounded-full flex w-fit items-center justify-between text-[10px]"
                      style={{
                        borderColor: brandColor,
                        color: isLight ? brandColor : '#ffffff',
                      }}
                    >
                      <p className="break-words  truncate">{value}</p>
                      <SendIcon className=" rotate-45" size={12} />
                    </div>
                  ),
              )}
            </div>
          )}

          {!isDataCollectionTap && (
            <div className="ml-auto flex flex-col items-end mt-3">
              <div
                className="w-max  px-2 py-1 rounded-sm rounded-br-none text-white text-[10px]"
                style={{
                  backgroundColor: brandColor,
                }}
              >
                How do I start with building my product?
              </div>
            </div>
          )}

          {isDataCollectionTap && (
            <div className="flex flex-col gap-2">
              {messages.map((message, idx) =>
                message.type === 'user' ? (
                  <div key={idx} className="ml-auto flex flex-col items-end max-w-[98%] w-full">
                    <div
                      className=" p-2 py-1 rounded-sm rounded-br-none text-white text-[10px]"
                      style={{
                        backgroundColor: brandColor,
                      }}
                    >
                      {message.message}
                    </div>
                  </div>
                ) : (
                  <div
                    key={idx}
                    className={clsx(
                      'max-w-[98%] w-full text-wrap bg-[#DADADA]  px-2 py-1 rounded-sm rounded-bl-none text-[#3A3A3A] text-[10px]',
                      {
                        'text-white bg-[#F8F8F8]/20': !isLight,
                        'text-[#3A3A3A] bg-[#DADADA]': isLight,
                      },
                    )}
                  >
                    <p className="break-words">{message.message}</p>
                  </div>
                ),
              )}
            </div>
          )}

          <div
            className={clsx('flex justify-between mt-1 items-center border rounded-sm p-2', {
              'border-[#B0B0B0] bg-white/10': !isLight,
            })}
          >
            <span
              className={clsx('text-[#7D7D7D] text-[10px]', {
                'text-white': !isLight,
              })}
            >
              Hey, How can we help you?
            </span>
            <SendIcon className="rotate-45" color={brandColor} size={14} />
          </div>
        </div>
      </Card>
    </Card>
  );
};
