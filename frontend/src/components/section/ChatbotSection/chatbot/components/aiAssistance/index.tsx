import './style.css';

import loadable from '@loadable/component';
import DOMPurify from 'dompurify';
import { SendHorizonalIcon } from 'lucide-react';
import { marked } from 'marked';
import React from 'react';
import { useMixpanel } from 'react-mixpanel-browser';
import { useLocation } from 'react-router-dom';

import BotImage from '@/assets/ai-assistant.png';
import { ANIMATION } from '@/assets/animation';
import { Button } from '@/components/ui/button';

import { IChatBoteMessageContent } from '../../types';
const Lottie = loadable(() => import('react-lottie'));

interface IAiAssistanceMessage extends IChatBoteMessageContent {
  aiAssistanceName: string;
  greeting_tags?: string[];
  socket?: WebSocket;
  avatar?: string;
  onMessageSent: (message: string) => void;
  setMessageTypeing: (val: boolean) => void;
  isMore?: boolean;
  isbenifitSection?: boolean;
}

const isMarkdown = (content: string) => {
  // Check for common Markdown syntax elements
  const markdownPatterns = [
    /^#\s/, // Header
    /^-\s|\*\s|1\.\s/, // List item
    /\*\*.*\*\*|__.*__|[*_].*[*_]/, // Bold or italic
    /(```|`)[^`]*\1/, // Code block or inline code
  ];

  return markdownPatterns.some((pattern) => pattern.test(content));
};
export const AiAssistanceMessage = (props: IAiAssistanceMessage) => {
  const mixpanel = useMixpanel();
  const [isHide, setIsHide] = React.useState<boolean>(false);
  const {
    aiAssistanceName,
    content,
    isActionButton,
    greeting_tags = [],
    socket,
    onMessageSent,
    setMessageTypeing,
    isMore,
    avatar,
    isbenifitSection = false,
  } = props;
  const location = useLocation();
  const submitMessage = (inputValue: string) => {
    if (socket && inputValue) {
      onMessageSent(inputValue);
      const payload = JSON.stringify({ type: 'text', content: inputValue });
      setMessageTypeing(true);
      socket.send(payload);
      setIsHide(true);
    }
  };
  const getMessage = (message: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      DOMPurify.sanitize(marked.parse(message) as string),
      'text/html',
    );
    const links = doc.querySelectorAll('a');
    links.forEach((link) => {
      link.setAttribute('target', '_blank');
      link.classList.add('action_link');
    });
    const purifiedMessage = doc.body.innerHTML;
    return purifiedMessage;
  };
  const contentHTML: any = isMarkdown(content) ? getMessage(content) : content;

  return (
    <div className="ai-assitance-conatiner">
      <div className="ai-assistance-heading">
        <img src={avatar ?? BotImage} className="ai-assistance-image" />
        <h2 className="ai-assistance-name">{aiAssistanceName}</h2>
      </div>
      <div className="ai-assitance-message" dangerouslySetInnerHTML={{ __html: contentHTML }} />
      <div className="flex flex-row items-center flex-wrap flex-1 gap-5">
        {!isHide &&
          !isMore &&
          isActionButton &&
          greeting_tags?.length > 0 &&
          greeting_tags[0].split(',').map((el) =>
            !isbenifitSection ? (
              <button
                key={el}
                onClick={() => {
                  mixpanel.track('Chat Bot Greeting Message Track', {
                    section: 'Hero section',
                    greetingMessage: el,
                    version: location.pathname === '/' ? 'v1' : location.pathname,
                  });
                  submitMessage(el);
                }}
                className="w-fit h-[30px] rounded-full action_button"
              >
                {el}
                <SendHorizonalIcon size={14} />
              </button>
            ) : (
              <Button variant={'unrealPrimaryBtn'} className="rounded-full max-h-[30px] text-xs">
                {el}
                <SendHorizonalIcon size={14} />
              </Button>
            ),
          )}
      </div>
    </div>
  );
};

export const AiLoading = ({
  content = 'Typing',
  isError = false,
  avatar,
  agentName,
  onReconnect,
}: {
  content?: string;
  isError?: boolean;
  avatar?: string;
  agentName?: string;
  onReconnect?: () => void;
}) => {
  return (
    <div className="ai-assitance-conatiner">
      <div className="ai-assistance-heading">
        <img src={avatar || BotImage} className="ai-assistance-image" />
        <h2 className="ai-assistance-name">{agentName || 'Agent'}</h2>
      </div>
      <div className="ai-assitance-message">
        {!isError && (
          <p className="thinking-effect">
            {content}
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </p>
        )}
        {isError && <p className="connection-error">{content}</p>}
      </div>
      {onReconnect && (
        <div className="action_button_list">
          <button onClick={onReconnect} className="action_button text-green-400">
            Reconnect
          </button>
        </div>
      )}
    </div>
  );
};

export const AudioProcessing = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ANIMATION.AduioActive,
  };
  return (
    <div className="flex flex-row justify-center items-center py-4">
      <Lottie options={defaultOptions} height={120} width={300} />
    </div>
  );
};
