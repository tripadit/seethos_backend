import moment from 'moment';

export interface IEmailHistoryItem {
  id: string;
  subject: string;
  from_email: string;
  body: string;
  created_at: string;
}

export default function EmailHistoryCard({ item }: { item: IEmailHistoryItem }) {
  return (
    <div className="border border-gray-200 bg-[#FBFBFB] flex flex-col gap-2 px-5 py-4 rounded-md">
      <div className="flex flex-col md:flex-row w-full justify-between">
        <div>
          {' '}
          <span className="text-sm font-medium mr-1 text-black">Form:</span>
          <span>{item.from_email}</span>
        </div>
        <div className="text-xs text-charcoal">
          {moment(item.created_at).format('dddd hh:mm A')}
        </div>
      </div>
      <div className="font-semibold">
        <span className="mr-1">Subject:</span>
        <span>{item.subject}</span>
      </div>
      <div>
        <span dangerouslySetInnerHTML={{ __html: item.body }} />
      </div>
    </div>
  );
}
