import { handleSuccess } from '@/speech-manager';

import { IChatBoteMessageContent } from '../types';
import { generateUUID, getSessionId } from '../utils';

export const webSocketService = (
  socketUrlLink: string,
  setMessages: (args: any) => void,
  setMessageTypeing: (args: boolean) => void,
  ref: any,
  setSocketConnecting: (args: boolean) => void,
  setSocketConnectionError: (args: boolean) => void,
  SetSocketOnline: (args: boolean) => void,
  setSocketDisconnected: (args: boolean) => void,

  messages: IChatBoteMessageContent[],
  setUserMessageProcessing: (args: boolean) => void,
) => {
  const sessionId = getSessionId();
  let responseId: string = generateUUID();
  let isGreetingMessage: boolean = true;
  const socket: WebSocket = new WebSocket(socketUrlLink + `/?session_id=${sessionId}`);

  // Connection opened
  socket.addEventListener('open', () => {
    SetSocketOnline(true);
    setSocketConnecting(false);
    setSocketDisconnected(false);
    setSocketConnectionError(false);
  });

  let isUserMessage: boolean = false;
  // Listen for messages
  socket.addEventListener('message', (event) => {
    const response = event.data;
    if (
      response === 'end of the chain' ||
      response === 'end of the greeting message' ||
      response === 'end of audio' ||
      response === 'end user message'
    ) {
      if (response === 'end of the greeting message') isGreetingMessage = false;
      isUserMessage = false;
      setUserMessageProcessing(false);
      if (
        response === 'end of the chain' ||
        response === 'end of the greeting message' ||
        response === 'end of audio'
      ) {
        setMessageTypeing(false);
      }
      responseId = generateUUID();
    } else {
      const firstMessage: IChatBoteMessageContent | any = messages.length > 0 ? messages[0] : {};
      if (firstMessage && firstMessage.content === response) {
        return;
      }
      if (response instanceof Blob) {
        return handleSuccess(response);
      }

      if (response === 'start user message') {
        isUserMessage = true;
        return;
      }
      if (response === 'starting audio') {
        return;
      }

      const bot = {
        type: isUserMessage ? 'user' : 'bot',
        content: response,
        uuid: responseId,
        isActionButton: isGreetingMessage,
      };
      setMessages((prev: IChatBoteMessageContent[]) => [...prev, bot]);
    }
    ref.current.scrollIntoView({ behavior: 'smooth' });
  });

  // Connection error
  socket.addEventListener('error', () => {
    setSocketConnectionError(true);
  });

  socket.addEventListener('close', () => {
    SetSocketOnline(false);
    setSocketDisconnected(true);
    setSocketConnecting(true);
    setTimeout(() => {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  });

  return socket;
};
