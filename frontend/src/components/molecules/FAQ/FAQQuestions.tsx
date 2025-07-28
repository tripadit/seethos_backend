import clsx from 'clsx';
import { useState } from 'react';

import { CherlovIcon } from './FAQActionIcon';
import { FAQItems, IFAQItems } from './FAQItem';

export interface IFAQQuestions {
  section: string;
  questions: IFAQItems[];
}

interface IFAQ extends IFAQQuestions {
  delay?: number;
}
export const FAQQuestions = ({ section, questions, delay }: IFAQ) => {
  const [questionOpen, setQuestionOpen] = useState<boolean>(false);

  return (
    <div
      data-aos={'fade-right'}
      data-aos-delay={delay}
      className={clsx(
        'border border-purple-500 rounded-md px-5  cursor-pointer flex flex-col gap-5',
        {
          'py-10': questionOpen,
          'py-5': !questionOpen,
        },
      )}
      onClick={() => setQuestionOpen(!questionOpen)}
    >
      <div className="flex justify-between items-center">
        <h5 className="text-neutral-900 text-xl mobile:text-[16px] tablet:text-[18px] font-bold">
          {section}
        </h5>
        <CherlovIcon state={questionOpen} onClick={() => setQuestionOpen(!questionOpen)} />
      </div>
      {questionOpen && (
        <>
          {questions.map((x, i) => (
            <FAQItems question={x.question} answer={x.answer} key={i} />
          ))}
        </>
      )}
    </div>
  );
};
