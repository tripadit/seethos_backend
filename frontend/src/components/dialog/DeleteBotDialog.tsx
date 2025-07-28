import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface IDeleteBotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actions?: React.ReactNode;
}

export const DeleteBotDialog = ({ isOpen, onClose, actions }: IDeleteBotDialogProps) => {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete this assistant?</DialogTitle>
            <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
          </DialogHeader>

          <DialogFooter>{actions}</DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
