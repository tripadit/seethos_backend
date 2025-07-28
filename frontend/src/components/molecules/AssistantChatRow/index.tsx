export const AssistantChatRow = ({
  name = 'Chatbot',
  time_stamp,
  chat,
}: {
  name?: string;
  time_stamp?: string;
  chat?: string;
}) => {
  return (
    <div className="self-end flex flex-col gap-1 max-w-[80%]">
      <div className="flex justify-between gap-2">
        <p className="text-sm text-gray-700">{name}</p>
        <p className="text-sm text-gray-700">{time_stamp}</p>
      </div>
      <div className="self-end max-w-600 text-white break-words text-base font-normal px-[14px] py-[10px] rounded-b-lg rounded-tl-lg bg-purple-500">
        {chat}
      </div>
    </div>
  );
};
