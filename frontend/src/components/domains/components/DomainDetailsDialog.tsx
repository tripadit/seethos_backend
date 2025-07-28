import { EyeIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import StepTwoComponent from './Steps/StepTwo';

export default function DomainDetailsDialog({ domain }: { domain: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Button
        className="px-4 py-1"
        variant="ghost"
        onClick={(e) => {
          setIsOpen(true);
          e.stopPropagation();
        }}
      >
        <EyeIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
      </Button>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <StepTwoComponent onNext={onClose} domain={domain} />
        </DialogContent>
      </Dialog>
    </>
  );
}
