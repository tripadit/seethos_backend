import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { LANDING_CALENDLY_URL } from '@/lib/utils';

import { CustomDialog } from './CustomDialog';

export const SignUpDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleModal = () => {
    setOpen(!open);
  };
  return (
    <>
      <Button className="p-0 font-semibold text-purple-500" type="button" onClick={toggleModal}>
        {' '}
        Sign up{' '}
      </Button>
      <CustomDialog
        isOpen={open}
        onClose={toggleModal}
        body={
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-xl font-semibold text-gray-700">Discover More with Us!</h1>
            <div className="flex flex-col items-center justify-center gap-5">
              <p className="text-sm font-normal text-black/80 text-center">
                Begin your journey with a discovery call. Click to schedule a meeting and unlock the
                possibilities that await you.
              </p>
              <div className="flex gap-5 mt-3 items-center">
                <Button
                  variant={'purple'}
                  onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};
