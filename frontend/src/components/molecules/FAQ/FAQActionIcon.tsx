import clsx from 'clsx';
import { ChevronDownIcon } from 'lucide-react';

export const CherlovIcon = ({ state, onClick }: { state: boolean; onClick: () => void }) => {
  return (
    <div
      className={clsx('h-full cursor-pointer  p-[4px] select-none', { 'rotate-180': state })}
      onClick={onClick}
    >
      <ChevronDownIcon className="cursor-pointer" />
    </div>
  );
};
