import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { SearchBlackIcon } from '@/assets/icons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ISearchInput extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (searchTerm: string) => void;
  className?: string;
  inputClassName?: string;
}

export const SearchInput = ({ className, onSearch, inputClassName, ...rest }: ISearchInput) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debounced = useDebouncedCallback(
    // function
    (value) => {
      onSearch(value);
    },
    // delay in ms
    1000,
  );
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debounced(e.target.value);
  };

  return (
    <div className={cn('relative', className)}>
      <SearchBlackIcon className="h-4 w-4 absolute top-3 left-3 text-black" />
      <Input
        value={searchTerm}
        onChange={handleSearchChange}
        className={cn('w-full pl-9 bg-slate-10', inputClassName)}
        placeholder="Search"
        {...rest}
      />
    </div>
  );
};
