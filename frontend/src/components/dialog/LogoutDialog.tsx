import { LogOutIcon } from 'lucide-react';
import { useState } from 'react';

import { CheckedLogoutIcon } from '@/assets/icons';
import { Button } from '@/components/ui/button';

import { CTooltip } from '../molecules';
import { CustomDialog } from './CustomDialog';

export const LogoutDialog = ({ onConfirm }: { onConfirm: () => void }) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleModal = () => {
    setOpen(!open);
  };
  return (
    <>
      <CTooltip text="Logout">
        <LogOutIcon onClick={toggleModal} className="text-gray-700 cursor-pointer" />
      </CTooltip>
      <CustomDialog
        isOpen={open}
        onClose={toggleModal}
        body={
          <div className="flex flex-col items-center justify-center gap-2">
            <CheckedLogoutIcon />
            <h1 className="text-xl font-semibold text-gray-700">Logout?</h1>
            <div className="flex flex-col items-center justify-center gap-5">
              <p className="text-sm font-normal text-black/80 text-center">
                Are you sure, you want to log out of this account?
              </p>
              <div className="flex gap-5 mt-3 items-center">
                <Button variant={'outline'} onClick={toggleModal}>
                  Cancel
                </Button>
                <Button variant={'purple'} onClick={onConfirm}>
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};
