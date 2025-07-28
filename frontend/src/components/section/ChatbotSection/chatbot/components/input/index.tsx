import './style.css';

import React from 'react';
interface IInputField {
  socket?: WebSocket;
  onMessageSent: (message: string) => void;
  setMessageTypeing: (val: boolean) => void;
  scrollToBottom: () => void;
  onMessageEntered: (message: string) => void;
}
export const InputField = (props: IInputField) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const submitMessage = () => {
    if (props.socket && inputValue) {
      props.onMessageSent(inputValue);
      props.setMessageTypeing(true);
      const payload = JSON.stringify({ type: 'text', content: inputValue });
      props.socket.send(payload);
      props.scrollToBottom();
      setInputValue('');
    }
  };

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      submitMessage();
    }
  };

  return (
    <div className="ai-assistance-footer">
      <div className="input-wrapper">
        <input
          className={inputValue ? 'ai-assistance-input input-padding' : 'ai-assistance-input'}
          placeholder="Hey, How can we help you?"
          value={inputValue}
          onChange={(e: any) => {
            setInputValue(e.target.value);
            props.onMessageEntered(e.target.value);
          }}
          onKeyDown={onKeyPress}
        />
        {inputValue && (
          <div onClick={submitMessage} className="input_section_send_icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-send-horizontal"
            >
              <path d="m3 3 3 9-3 9 19-9Z" />
              <path d="M6 12h16" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
