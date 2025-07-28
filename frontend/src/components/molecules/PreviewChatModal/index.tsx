import { SendIcon, UserCircleIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { ScalebuildTBLogo } from '@/assets/icons';
import {
  BotBlueImage,
  BotGreenImage,
  BotPreviewImage,
  BoyAvatar,
  GirlAvatar,
} from '@/assets/images';
import { hasValue } from '@/components/forms/AddBotForm/helpers';
import { Card } from '@/components/ui/card';

interface IPreviewChatModal {
  companyLogo?: any;
  tag?: string[];
  file?: any;
}

export const PreviewChatModal = ({ companyLogo, tag, file }: IPreviewChatModal) => {
  const companyName = useWatch({ name: 'company_name' });
  const chatbotName = useWatch({ name: 'name' });
  const fieldCompanyLogo = useWatch({ name: 'company_logo' });
  const greetingMessage = useWatch({ name: 'greeting_message' });
  const bot_avatar = useWatch({ name: 'avatar' });

  const DefaultBotData = [
    {
      id: '4',
      image: BotBlueImage,
    },
    {
      id: '5',
      image: BotGreenImage,
    },
    {
      id: '6',
      image: BoyAvatar,
    },
    {
      id: '7',
      image: GirlAvatar,
    },
  ];

  const getBotImage = useMemo(() => {
    const selectedBot = DefaultBotData.find((item) => item.id === bot_avatar);

    if (selectedBot) {
      return selectedBot.image;
    } else if (file) {
      return URL.createObjectURL(file);
    } else if (!selectedBot && !file && typeof bot_avatar === 'string') {
      return bot_avatar;
    } else {
      return BotPreviewImage;
    }
  }, [bot_avatar, file]);

  return (
    <Card className="flex flex-col gap-2 p-5 cursor-not-allowed select-none">
      <h4 className="text-lg font-semibold text-[#3A3A3A] text-center">
        Preview Model For Your Assistant
      </h4>

      <Card className="py-4 px-2.5">
        <div className="flex gap-3 items-center">
          {(companyLogo && typeof companyLogo !== 'string' && URL.createObjectURL(companyLogo)) ||
          fieldCompanyLogo ? (
            <img
              src={
                (companyLogo &&
                  typeof companyLogo !== 'string' &&
                  URL.createObjectURL(companyLogo)) ||
                fieldCompanyLogo
              }
              className="w-12 h-12"
            />
          ) : (
            <ScalebuildTBLogo className="w-10 h-10" />
          )}

          {/* {companyLogo ? companyLogo :
            <ScalebuildTBLogo className="w-10 h-10" />
          } */}
          <p className="text-sm flex-1  text-wrap truncate font-medium">
            {hasValue(companyName) ? companyName : 'Company Name'}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mt-3 mb-2.5">
            <img src={getBotImage as string} alt="bot-preview" className="w-8 h-8 " />
            <span className="text-sm  font-medium">
              {hasValue(chatbotName) ? chatbotName : 'Chatbot (Bluu)'}
            </span>
          </div>
          <div className="w-max max-w-full text-wrap bg-[#F3F3F3]  p-2.5 rounded-sm rounded-bl-none text-[#3A3A3A] text-base">
            <p className="break-words">
              {hasValue(greetingMessage) ? greetingMessage : 'Hi, Greeting Message'}
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-3 ">
            {tag && !!tag.length ? (
              tag?.map(
                (value, idx) =>
                  value !== '' && (
                    <div
                      key={idx}
                      className="chat-preview-btn py-2 text-white px-4 rounded-3xl flex  w-max min-w-[30%] max-w-[90%] items-center justify-between"
                    >
                      <p className="break-words w-[85%] truncate">{value}</p>{' '}
                      <SendIcon className="text-white rotate-45" />
                    </div>
                  ),
              )
            ) : (
              <>
                <div className="chat-preview-btn py-2 text-white px-4 rounded-3xl flex w-8/12 items-center justify-between">
                  Learn About Us <SendIcon className="text-white rotate-45" />
                </div>
                <div className="chat-preview-btn py-2 text-white px-4 rounded-3xl flex w-8/12 items-center justify-between">
                  Learn about our services <SendIcon className="text-white rotate-45" />
                </div>
                <div className="chat-preview-btn py-2 text-white px-4 rounded-3xl flex w-8/12 items-center justify-between">
                  Schedule a meeting with us <SendIcon className="text-white rotate-45" />
                </div>
              </>
            )}
          </div>

          <div className="ml-auto flex flex-col items-end mt-3">
            <div className="flex w-max items-end gap-2 mb-2">
              <span>You</span>
              <UserCircleIcon className="text-purple-600" />
            </div>
            <div className="w-max bg-purple-600 p-2.5 rounded-sm rounded-br-none text-white text-base">
              How do I start with building my product?
            </div>
          </div>

          <div className="flex justify-between mt-4 items-center border rounded-lg p-3">
            <span className="text-[#7D7D7D] text-sm">Hey, How can we help you?</span>
            <SendIcon className="text-purple-600 rotate-45" />
          </div>
        </div>
      </Card>
    </Card>
  );
};
