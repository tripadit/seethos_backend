import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
interface IToolTip {
  children: React.ReactNode;
  text: React.ReactNode;
  className?: string;
  side?: 'right' | 'left' | 'top' | 'bottom';
  sideOffset?: number;
  arrowClasName?: string;
  isShowArrow?: boolean;
}

export function CTooltip({
  children,
  text,
  className,
  side = 'top',
  sideOffset = 4,
  arrowClasName,
  isShowArrow = false,
}: IToolTip) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={className} side={side} sideOffset={sideOffset}>
          <p>{text}</p>
          {isShowArrow && (
            <TooltipPrimitive.Arrow className={cn('fill-white', arrowClasName)} fontSize={24} />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
