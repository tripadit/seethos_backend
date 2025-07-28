import { useNavigate } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteLeadById } from '@/pages/leadGeneration/hooks/leadGeneration';

import { Button } from '../ui/button';

interface IDeleteLeadDialogProps {
  leadId?: string;
  isOpen: boolean;
  toggleDialog: () => void;
  navigateToLeadList?: boolean;
}

export const DeleteLeadDialog = ({
  leadId,
  isOpen,
  toggleDialog,
  navigateToLeadList,
}: IDeleteLeadDialogProps) => {
  const deleteLead = useDeleteLeadById();

  const navigate = useNavigate();

  const deleteLeadById = async (id?: string) => {
    if (id) {
      await deleteLead.mutateAsync(id);
      if (navigateToLeadList) navigate('/dashboard/lead-generation');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={toggleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete this lead?</DialogTitle>
            <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-4">
              <Button variant="outline" onClick={toggleDialog}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteLeadById(leadId);
                  toggleDialog();
                }}
              >
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
