export const UserChatRow = ({
  name = 'Chatbot',
  time_stamp,
  chat,
}: {
  name?: string;
  time_stamp?: string;
  chat?: string;
}) => {
  return (
    <div className="self-start flex flex-col gap-1 max-w-[80%] ">
      <div className="flex justify-between gap-2">
        <p className="text-sm text-gray-700">{name}</p>
        <p className="text-sm text-gray-700">{time_stamp}</p>
      </div>
      <div className="self-start max-w-600  text-base break-words font-normal px-[14px] py-[10px] w-full rounded-b-lg rounded-tr-lg  bg-[#F2F4F7]">
        {chat}
      </div>
    </div>
  );
};
