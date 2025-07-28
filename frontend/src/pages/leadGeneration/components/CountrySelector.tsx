'use client';

import { countries } from 'countries-list';
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CountrySelectorProps {
  value?: string;
  onChange?: (country: string) => void;
  disabled?: boolean;
}

// const countriesList = Object.keys(countries);
const countriesList = Object.keys(countries).map(
  // @ts-ignore
  (country: string) => `${country}, ${countries[country].name}`,
);

export function CountrySelector(props: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { value, onChange } = props;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={props.disabled} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] h-[44px] flex justify-between"
        >
          <div className="text-left truncate w-[150px]">
            {value ? (
              countriesList.find((country) => country.split(',')[0] === value)?.split(',')[1]
            ) : (
              <span className="text-gray-300"> Select a country</span>
            )}
          </div>
          <ChevronDown
            className={cn(
              'ml-2 h-4 w-4 shrink-0 opacity-50 transition duration-300',
              open && 'rotate-180',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandList>
            {countriesList.map((country) => (
              <CommandItem
                key={country}
                value={country}
                onSelect={(currentValue) => {
                  onChange && onChange(currentValue === value ? '' : currentValue?.split(',')[0]);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === country.split(',')[0] ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {country?.split(',')[1]}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
