import { Mail, PhoneCall } from 'lucide-react';

import { FAQ, PageHeader, SupportFAQs } from '@/components/molecules';

const SupportPage = () => {
  return (
    <>
      <PageHeader title="Hello, how can we help?" isLoading={false}>
        {/* <Button variant='purple'>Submit a request</Button> */}
        <></>
      </PageHeader>
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-semibold text-[#111827]">FAQs</h4>
          <p className="text-sm text-[#111827]">
            We understand that you may have several questions before initiating a partnership with
            us. Here are some of the most asked questions about our services, processes, and more.
          </p>
        </div>

        {FAQ.map((q, i) => (
          <SupportFAQs section={q.section} key={i} questions={q.questions} />
        ))}
      </div>

      <div className="mt-8 flex  flex-col justify-center items-center gap-10 mb-10">
        <div className="flex flex-col text-center gap-2.5">
          <h5 className="text-base font-semibold text-gray-900">You still have a question?</h5>
          <div className="text-sm text-gray-700">
            <p>If you cannot find answers to your question in our FAQ, </p>
            <p>you can always contact us. We will answer to you shortly!</p>
          </div>
        </div>
        <div className="flex gap-10 items-center">
          <div className="w-[415px] flex flex-col gap-3 items-center justify-center h-[134px] border border-gray-200 rounded-xl">
            <PhoneCall />
            <p className="font-semibold">+1 919 576 6153</p>
            <p className="text-sm text-gray-700">We are always happy to help.</p>
          </div>
          <div className="w-[415px] flex flex-col gap-3 items-center justify-center h-[134px] border border-gray-200 rounded-xl">
            <Mail />
            <p className="font-semibold">contact@scalebuild.ai</p>
            <p className="text-sm text-gray-700">The best way to get answer faster.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPage;
