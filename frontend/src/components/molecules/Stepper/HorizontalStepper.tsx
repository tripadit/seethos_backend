import clsx from 'clsx';
import { Check } from 'lucide-react';
import { useCallback } from 'react';

export interface IHorizontalSteps {
  title: string;
  index: number;
}

interface IHorizontalStepper {
  // steps: string[]
  steps: IHorizontalSteps[];
  activeStep: number;
  className?: string;
  onStepClick: (step: IHorizontalSteps) => void;
  error?: string;
}
export const HorizontalStepper = (props: IHorizontalStepper) => {
  const isActiveStep = useCallback(
    (activeIndex: number) => {
      return props.activeStep >= activeIndex;
    },
    [props.activeStep],
  );

  return (
    <ol className="flex  w-full">
      {props.steps.map((steps, index) => {
        const isNotLast = index !== props.steps.length - 1;
        const isActive = isActiveStep(steps.index);
        return (
          <div key={steps.index} className={clsx('flex flex-col gap-2 ', { 'w-full': isNotLast })}>
            <li
              className={clsx('w-full flex  items-center', {
                " after:content-[''] after:w-full after:h-1 after:border-b after:border-purple-500 after:border-4 after:inline-block":
                  isNotLast && isActive,
                " after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-4 after:inline-block":
                  isNotLast && !isActive,
                '  ': isNotLast,
                'after:border-red-500': props.error && isNotLast && isActive,
              })}
            >
              <span
                onClick={() => props.onStepClick(steps)}
                className={clsx(
                  'flex items-center justify-center w-8 h-8  rounded-full 0 shrink-0 ',
                  {
                    'bg-purple-700': isActive,
                    'bg-gray-200': !isActive,
                    'bg-red-700': props.error && isActive,
                  },
                )}
              >
                <span
                  className={clsx(
                    ' flex justify-center items-center  h-5 w-5 rounded-full text-white text-sm',
                    {
                      'bg-purple-500': isActive,
                      'bg-gray-400': !isActive,
                      'bg-red-500': props.error && isActive,
                    },
                  )}
                >
                  {isActive ? <Check size={14} /> : <h1>{steps.index}</h1>}
                </span>
              </span>
            </li>
            <p
              className={clsx('text-gray-500 text-sm font-medium', {
                '-ml-3': isNotLast,
                'text-purple-500': isActive,
                'text-red-500': props.error && isActive,
              })}
            >
              {steps.title}
            </p>
          </div>
        );
      })}
    </ol>
  );
};
