import React from 'react';

import { useMicVADWrapper } from '@/hooks/useMicVADWrapper';

import { botId, useFetchChatBotInfor } from '../hooks';
import { webSocketService } from '../service';
import { IChatBoteMessageContent } from '../types';
import { generateSessionId, generateUUID, getSessionId } from '../utils';
import { AppContext } from './appConetxt';
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionId, setSessionId] = React.useState<any>(getSessionId());
  const [socket, setSocket] = React.useState<WebSocket>();
  const [messsages, setMessages] = React.useState<IChatBoteMessageContent[]>([]);
  const [socketConnecting, setSocketConnecting] = React.useState<boolean>(true);
  const [messageTypeing, setMessageTypeing] = React.useState<boolean>(false);
  const [socketConnectionError, setSocketConnectionError] = React.useState<boolean>(false);
  const [socketOnline, SetSocketOnline] = React.useState<boolean>(false);
  const [socketDisconnected, setSocketDisconnected] = React.useState<boolean>(false);
  const [retryConnection, setRetryConnection] = React.useState<boolean>(false);
  const [isTyping, setIsTyping] = React.useState<boolean>(false);

  const [userMessageProcessing, setUserMessageProcessing] = React.useState<boolean>(false);
  const { data, isLoading, status }: any = useFetchChatBotInfor();
  let ref: any = React.useRef(null);

  const { micVAD, timeLeft, enableVoice, setEnableVoice, setTimeLeft }: any =
    useMicVADWrapper(audioCallBack);

  function audioCallBack(blob: any) {
    if (!messageTypeing && enableVoice) {
      setUserMessageProcessing(true);
      setMessageTypeing(true);
      socket?.send(blob);
    }
  }

  React.useEffect(() => {
    if (!status) {
      SetSocketOnline(false);
      setSocketConnecting(false);
      setSocketDisconnected(true);
      setSocketConnectionError(true);
    }

    if (data?.socket_url && status) {
      if (retryConnection) {
        setRetryConnection(false);
      }

      const socket: WebSocket = webSocketService(
        data.socket_url,
        setMessages,
        setMessageTypeing,
        ref,
        setSocketConnecting,
        setSocketConnectionError,
        SetSocketOnline,
        setSocketDisconnected,
        messsages,
        setUserMessageProcessing,
      );
      setSocket(socket);
    }
  }, [data?.socket_url, socketDisconnected, retryConnection, sessionId]);

  const onMessageSent = (message: string) => {
    setIsTyping(false);
    setMessages((prev: IChatBoteMessageContent[]) => [
      ...prev,
      {
        type: 'user',
        content: message,
        uuid: generateUUID(),
      },
    ]);
  };

  const scrollToBottom = (next: () => void) => {
    next();
  };

  const onReconnect = () => {
    setSocketConnectionError(false);
    setSocketConnecting(true);
    setRetryConnection(true);
  };

  const onMessageEntered = (message: string) => {
    if (message) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  };

  const handleResetChatBot = () => {
    localStorage.removeItem('UNREAL_AI_SESSION_ID');
    localStorage.removeItem('UNREAL_AI_SESSION_ID_TIMESTAMP');
    setTimeout(() => {
      const id = generateSessionId();
      setMessages([]);
      setSocketConnecting(true);
      setSessionId(id);
    });
  };
  return (
    <AppContext.Provider
      value={{
        onMessageSent,
        scrollToBottom,
        chatBot: data,
        socket,
        messageTypeing,
        socketConnecting,
        socketConnectionError,
        messsages,
        socketDisconnected,
        setMessageTypeing,
        socketOnline,
        botId,
        onReconnect,
        onMessageEntered,
        isLoading,
        isTyping,
        ref,
        userMessageProcessing,
        mic: micVAD,
        timer: timeLeft,
        setEnableVoice,
        enableVoice,
        setTimeLeft,
        handleResetChatBot,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
