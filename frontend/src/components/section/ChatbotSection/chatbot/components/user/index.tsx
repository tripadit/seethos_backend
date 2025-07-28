import './style.css';

import { UserCircle } from 'lucide-react';

import { IChatBoteMessageContent } from '../../types';
export const UserMessage = (props: IChatBoteMessageContent) => {
  const { content } = props;
  return (
    <div className="user-conatiner">
      <div className="user-heading">
        <UserCircle className="text-purple-500" size={20} />
        <h2 className="user-name">You</h2>
      </div>
      <div className="user-message">{content}</div>
    </div>
  );
};
