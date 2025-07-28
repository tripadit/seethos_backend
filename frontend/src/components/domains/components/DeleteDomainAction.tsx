import { useState } from 'react';

import { DeleteIcon } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useDeleteDomain } from '../hooks/hooks';

export default function DeleteDomainAction({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const deleteDomain = useDeleteDomain();

  const handleDeleteDomain = () => {
    deleteDomain.mutate(id);
    onClose();
  };
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
        <DeleteIcon className="cursor-pointer" />
      </Button>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete this domain?</DialogTitle>
            <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteDomain}
                isLoading={deleteDomain.isLoading}
              >
                Delete
              </Button>
            </>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
