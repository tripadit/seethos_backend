import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import StepOneComponent from './Steps/StepOne';
import StepTwoComponent from './Steps/StepTwo';

interface IAddDomainModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const steps = [
  {
    title: 'Add Domain',
    description: 'Add a domain to your account',
  },
  {
    title: 'Configure DNS',
    description: 'Add DNS records to your domain',
  },
];
export default function AddDomainDialog({ open, setOpen }: IAddDomainModalProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [domain, setDomain] = useState<any>();
  const onNext = (domain?: string) => {
    if (domain) {
      setDomain(domain);
    }
    if (activeStep === 2) {
      setOpen(false);
      setActiveStep(1);
      return;
    }
    setActiveStep(activeStep + 1);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setActiveStep(1);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{steps[activeStep - 1].title}</DialogTitle>
            <DialogDescription>{steps[activeStep - 1].description}</DialogDescription>
          </DialogHeader>

          <div className="flex w-full gap-6 items-center justify-center">
            {steps.map((_, index) => (
              <>
                {index !== 0 && (
                  <div className={cn(activeStep > index ? 'text-purple-700' : 'text-gray-500')}>
                    →
                  </div>
                )}
                <div
                  className={cn(
                    ' flex items-center justify-center text-white w-6 h-6 ring-2 ring-offset-2 ring-purple-500 rounded-full bg-purple-500',
                    {
                      'bg-white text-[#898989] ring-[#898989]': activeStep < index + 1,
                    },
                  )}
                >
                  {index + 1}
                </div>
              </>
            ))}
          </div>
          <div className="my-4">
            {activeStep === 1 && <StepOneComponent onNext={onNext} />}
            {activeStep === 2 && <StepTwoComponent domain={domain} onNext={onNext} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
