import { useCallback } from 'react';

import { CreateBotFormStep } from '@/components/forms/AddBotForm/helpers';
import { cn } from '@/lib/utils';

interface ISteps {
  index: number;
  title: keyof typeof CreateBotFormStep;
}

interface IStepper {
  // steps: string[]
  steps: ISteps[];
  activeStep: number;
  className?: string;
  onStepClick: (step: keyof typeof CreateBotFormStep) => void;
  itemClassName?: string;
}

export const Stepper = ({ steps, activeStep, className, onStepClick, itemClassName }: IStepper) => {
  const isActiveStep = useCallback(
    (activeIndex: number) => {
      return activeStep >= activeIndex;
    },
    [activeStep],
  );

  return (
    <ol
      className={cn(
        'flex flex-col justify-start  w-max text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base',
        className,
      )}
    >
      {steps.map((step) => (
        <li
          className={cn(
            "flex flex-col md:w-full text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-6 after:h-8 after:border-l-2 after:border-purple-500 after:my-2 after:hidden sm:after:inline-block after:mx-3 last:after:hidden",
            { 'after:border-[#898989]': !isActiveStep(step.index + 1) },
            itemClassName,
          )}
          key={step.index}
        >
          <span className="flex gap-3 items-center after:content-['/'] sm:after:hidden after:text-gray-200 dark:after:text-gray-500">
            <div
              onClick={() => onStepClick(step.title)}
              className={cn(
                'cursor-pointer hover:bg-purple-700 flex items-center justify-center text-white w-6 h-6 ring-2 ring-offset-2 ring-purple-500 rounded-full bg-purple-500',
                {
                  'bg-white text-[#898989] hover:bg-[#898989] hover:text-white  ring-[#898989]':
                    !isActiveStep(step.index),
                },
              )}
            >
              {step.index}
            </div>
            <span
              onClick={() => onStepClick(step.title)}
              className={cn('text-purple-500 hover:text-purple-700 cursor-pointer', {
                'text-[#898989] hover:text-gray-600': !isActiveStep(step.index),
              })}
            >
              {step.title}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
};
