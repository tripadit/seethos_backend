import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import React from 'react';

import { ASSISTANCEASSIST } from '@/assets/assistance';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface AssistantFaqProps {
  title: string;
  description: string;
}
export const AssistantFaq = ({ description, title }: AssistantFaqProps) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    setLoading(true);
    setOpen(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(true);
    }, 1000);
  }, [description]);

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <div
            className="fixed bottom-10 rounded-full right-6 h-[72px] w-[72px] cursor-pointer"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <img src={ASSISTANCEASSIST.AssistanceAvatar3} />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          sideOffset={10}
          className="max-w-[217px] bg-[#101828] p-3 text-white border-none cursor-pointer"
        >
          {loading ? (
            <div className="custom-fab-loader"></div>
          ) : (
            <div
              className="text-xs flex flex-col gap-1"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <h1 className="font-semibold">{title}</h1>
              <p className="font-normal">{description}</p>
            </div>
          )}
          <TooltipPrimitive.Arrow className={clsx('fill-[#101828]')} fontSize={24} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/* HTML:  */
