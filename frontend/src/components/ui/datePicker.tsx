import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar, CalendarProps } from '@/components/ui/calendar';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { FormControl } from './form';

export type ICalendarProps = CalendarProps & {
  disabled?: boolean;
  [key: string]: any;
};

export function DatePicker(props: ICalendarProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            disabled={props?.disabled}
            variant={'outline'}
            className={cn(
              'min-w-[150px] w-auto pl-3 text-left font-normal',
              !props.value && 'text-muted-foreground',
            )}
          >
            {props.value ? format(props.value, 'PPP') : <span>Select date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <PopoverClose>
          <Calendar mode="single" selected={props.value} onSelect={props.onChange} initialFocus />
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
