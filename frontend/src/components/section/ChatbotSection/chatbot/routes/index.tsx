import './style.css';

import clsx from 'clsx';
import { Mic, StopCircle } from 'lucide-react';
import React, { useContext, useEffect } from 'react';
import { useMixpanel } from 'react-mixpanel-browser';
import { useLocation } from 'react-router-dom';

import BotIllustration from '@/assets/ai-bot.png';
import BotSetting from '@/assets/bot-setting.png';
import HumanIllustration from '@/assets/human.png';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { onSpeechStart } from '@/speech-manager';

import {
  AiAssistanceMessage,
  AiLoading,
  AudioProcessing,
  InputField,
  UserMessage,
} from '../components';
import { AppContext } from '../context/appConetxt';
export const Chatbot = ({
  showImages,
  className,
  isSmall = false,
  isbenifitSection = false,
}: {
  showImages?: boolean;
  className?: string;
  isSmall?: boolean;
  isbenifitSection?: boolean;
}) => {
  const mixpanel = useMixpanel();
  const chatbot = useContext(AppContext);
  const location = useLocation();
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollTo(0, ref.current.scrollHeight);
    }, 200);
  }, [chatbot.messsages, chatbot.userMessageProcessing]);

  const handleCallMe = async (e: any) => {
    e.preventDefault();

    window.navigator.permissions.query({ name: 'microphone' as PermissionName }).then(function (
      permissionstatus: any,
    ) {
      permissionstatus.onchange = function () {
        if (this.state == 'denied') {
          toast({
            variant: 'destructive',
            title: 'Please enable your microphone.',
          });
        } else if (this.state == 'prompt') {
          toast({
            variant: 'destructive',
            title: 'Please enable your microphone.',
          });
        }
      };
      if (permissionstatus.state == 'granted') {
        if (!chatbot.enableVoice) {
          chatbot.setTimeLeft(60);
          chatbot.setEnableVoice(true);
          chatbot.mic.start();
        } else {
          chatbot.setEnableVoice(false);
          onSpeechStart();
          chatbot.mic.pause();
        }
      }
      // permissionstatus.onchange();
    });
  };

  return (
    <div
      className={clsx(
        'chatbot-section pb-5 w-full gap-10',
        {
          'gap-2': !showImages,
        },
        className,
      )}
    >
      {!isSmall && (
        <div className="bot-illustration-section flex flex-col h-full justify-between flex-1 items-end">
          {showImages && (
            <div className="image-wrapper">
              <img src={BotIllustration} alt="bot-illustration" className="bot-illustration" />

              <div className="image-setting">
                <img
                  src={BotSetting}
                  className={
                    chatbot.messageTypeing || chatbot.socketConnecting
                      ? 'setting-image animate-bot'
                      : 'setting-image'
                  }
                />
              </div>
            </div>
          )}
          {!chatbot.socketConnecting && (
            <div className="flex flex-col gap-2 items-end w-full justify-end flex-1">
              {chatbot.enableVoice && chatbot.timer < 30 && (
                <div className="font-medium text-base text-primary-700">0:00:{chatbot.timer}</div>
              )}
              {showImages && (
                <Button
                  onClick={handleCallMe}
                  variant={'unrealSecondary'}
                  className="rounded-full h-[35px]"
                >
                  {!chatbot.enableVoice ? (
                    <>
                      <Mic size={18} /> Call Me
                    </>
                  ) : (
                    <>
                      <StopCircle size={18} /> Hang Up
                    </>
                  )}
                </Button>
              )}
              {!showImages && (
                <Button onClick={handleCallMe} variant={'unrealPrimary'}>
                  {!chatbot.enableVoice ? (
                    <>
                      <Mic />
                    </>
                  ) : (
                    <>
                      <StopCircle />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {!chatbot.chatBot?.status && (
        <div className="chatbot-nostatus-container w-full">
          <h2>Sorry, our agent is currently unavailable.</h2>
          <p>We apologize for any inconvenience this may have caused. </p>
          <p>Please check back later, and thank you for your understanding.</p>
        </div>
      )}

      {chatbot.chatBot?.status && !chatbot.isLoading && (
        <div className="chatbot-container w-full">
          {!isbenifitSection && (
            <div className="flex flex-row w-full  gap-5 px-3 py-4 border-b border-b-[#EBEBEB] justify-between items-center ">
              <div className="flex flex-row gap-5 items-center">
                <img
                  src={chatbot.chatBot?.company_logo}
                  alt="company logo"
                  className="h-10 w-10 object-contain"
                />
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold leading-[28px]">
                    {chatbot.chatBot?.company_name}
                  </h1>
                  {chatbot.socketOnline ? (
                    <div className="chatbot_online_wrapper">
                      <div className="chatbot_online_circle"></div>
                      <h2 className="chatbot_online_heading text-[#4D4D4D] leading-[14px]">
                        Online
                      </h2>
                    </div>
                  ) : (
                    <div className="chatbot_online_wrapper">
                      <div className="chatbot_online_circle offline"></div>
                      <h2 className="chatbot_online_heading">Offline</h2>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* <div className="chatbot_online_container gap-5">
            <Button
              onClick={chatbot.handleResetChatBot}
              variant={'unrealSecondary'}
              size={'sm'}
              className="bg-transparent hover:bg-secondary-gradient text-black hover:text-white"
            >
              Reset Chat
            </Button>
           
          </div> */}
          {/* <div > */}
          <div ref={ref} className="chatbot-message-section pb-4 px-3 w-full">
            {chatbot.messsages.map((el) => {
              if (el.type === 'bot') {
                return (
                  <AiAssistanceMessage
                    greeting_tags={chatbot.chatBot?.greeting_tags}
                    avatar={chatbot.chatBot?.avatar}
                    aiAssistanceName={chatbot.chatBot?.name}
                    key={el.uuid}
                    onMessageSent={chatbot.onMessageSent}
                    socket={chatbot.socket}
                    setMessageTypeing={chatbot.setMessageTypeing}
                    isMore={chatbot.messsages.length > 1}
                    isbenifitSection={isbenifitSection}
                    {...el}
                  />
                );
              }
              return <UserMessage key={el.uuid} {...el} />;
            })}
            {chatbot.socketConnectionError && (
              <AiLoading
                content="Connection Error. Please try again."
                isError
                avatar={chatbot.chatBot?.avatar}
                agentName={chatbot.chatBot?.name}
              />
            )}
            {(chatbot.userMessageProcessing || chatbot.mic.userSpeaking) && <AudioProcessing />}
            {chatbot.messageTypeing && (
              <AiLoading agentName={chatbot.chatBot?.name} avatar={chatbot.chatBot?.avatar} />
            )}
            {chatbot.socketDisconnected && (
              <AiLoading
                content="Socket Connection closed.Trying to reconnect."
                agentName={chatbot?.chatBot?.name}
                avatar={chatbot.chatBot?.avatar}
                isError
                onReconnect={chatbot.onReconnect}
              />
            )}
            {chatbot.socketConnecting && (
              <AiLoading
                content="Connecting"
                agentName={chatbot.chatBot?.name}
                avatar={chatbot.chatBot?.avatar}
              />
            )}

            {/* </div> */}
          </div>
          {!chatbot.socketConnecting && (
            <div className="mic-input-wrapper h-[60px]  flex-row items-end">
              {!isSmall && (
                <div className="flex flex-col mobile_action_button ">
                  {chatbot.enableVoice && chatbot.timer < 30 && (
                    <div className="font-medium text-base text-primary-700">
                      0:00:{chatbot.timer}
                    </div>
                  )}
                  <Button
                    onClick={handleCallMe}
                    variant={'unrealSecondary'}
                    className=" h-[38px]   flex flex-row justify-center items-center"
                  >
                    {!chatbot.enableVoice ? (
                      <>
                        <Mic />
                      </>
                    ) : (
                      <>
                        <StopCircle />
                      </>
                    )}
                  </Button>
                </div>
              )}
              {isSmall && (
                <div className="flex flex-col">
                  {chatbot.enableVoice && chatbot.timer < 30 && (
                    <div className="font-medium text-base text-primary-700">
                      0:00:{chatbot.timer}
                    </div>
                  )}
                  <Button
                    onClick={handleCallMe}
                    variant={'gradient'}
                    className=" h-[38px] w-[38px] btn-gradient-withoutpd px-2 flex flex-row justify-center items-center !important"
                  >
                    {!chatbot.enableVoice ? (
                      <>
                        <Mic />
                      </>
                    ) : (
                      <>
                        <StopCircle />
                      </>
                    )}
                  </Button>
                </div>
              )}
              <InputField
                scrollToBottom={() => {}}
                socket={chatbot.socket}
                setMessageTypeing={chatbot.setMessageTypeing}
                onMessageSent={(value: any) => {
                  if (chatbot.messsages.length == 2) {
                    mixpanel.track('User first interaction with chat', {
                      section: 'Hero section',
                      version: location.pathname === '/' ? 'v1' : location.pathname,
                      message: value,
                    });
                  }
                  chatbot.onMessageSent(value);
                }}
                onMessageEntered={chatbot.onMessageEntered}
              />
            </div>
          )}
        </div>
      )}

      {showImages && (
        <div className="human-illustration-section">
          <div className="image-wrapper">
            <img src={HumanIllustration} alt="bot-illustration" className="bot-illustration" />
          </div>
        </div>
      )}
    </div>
  );
};
