import { ChatWithSales } from '@/assets/icons';
import { FAQ, FAQQuestions } from '@/components/molecules';
import { SectionContainer } from '@/components/molecules/SectionContainer';

import { Button } from '../ui/button';

export const FAQSection = () => {
  return (
    <SectionContainer id="faq" className="py-80.1 mobile:py-10">
      <div className="flex items-center m-auto flex-col gap-10 justify-center ">
        <h2
          data-aos="zoom-in"
          data-aos-offset={'0'}
          data-aos-delay={'100'}
          className="text-black text-48 small:text-38 text-center font-bold "
        >
          Frequently asked questions
        </h2>

        <div
          data-aos="fade-right"
          data-aos-offset={'0'}
          data-aos-delay={'100'}
          className="px-20 mobile:px-0"
        >
          <p className="text-black text-lg mobile:px-0 tablet:text-[16px] text-center px-[40px]">
            {`
            We understand that you may have several questions before initiating a partnership with
            us. Here are some of the most asked questions about our services, processes, and more.
            If you don't find the information you're looking for, please don't hesitate to
            `}
            <span className="text-pink-400 cursor-pointer"> Contact Us.</span>
          </p>
        </div>

        <div className="w-full flex flex-col gap-[40px]">
          {FAQ.map((q, i) => (
            <FAQQuestions delay={i * 100} section={q.section} key={i} questions={q.questions} />
          ))}
        </div>
        <div className="flex items-center flex-col gap-[16px] mobile:gap-[8px] tablet:gap-[8px] mt-[20px]">
          <h2
            data-aos={'fade-up'}
            data-aos-delay={'100'}
            className="text-3xl mobile:text-2xl tablet:text-[24px] text-black font-bold text-center"
          >
            Still have questions?
          </h2>
          <p
            data-aos={'fade-up'}
            data-aos-delay={'200'}
            className="text-black/80 text-lg mobile:text-center mobile:text-sm tablet:text-[16px]"
          >
            Contact us through our chat to clarify all queries.
          </p>
          <div data-aos={'fade-up'} data-aos-delay={'300'}>
            <Button
              variant="gradientOutline"
              className="hover-scale flex items-center w-max px-5 py-6 gap-[10px]  text-lg  font-semibold"
            >
              <div className="btn-gradient-text flex flex-row justify-center items-center gap-3">
                <p className="">Chat With sales</p> <ChatWithSales />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
