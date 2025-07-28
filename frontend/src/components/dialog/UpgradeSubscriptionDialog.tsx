import { WarningIcon } from '@/assets/icons';
import { LANDING_CALENDLY_URL } from '@/lib/utils';

import { Button } from '../ui/button';
import { CustomDialog } from './CustomDialog';

interface IUpgradeDialogProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const UpgradeDialog = ({ onClose }: IUpgradeDialogProps) => {
  return (
    <>
      <CustomDialog
        isOpen={true}
        onClose={onClose}
        body={
          <div className="flex flex-col items-center justify-center gap-2">
            <WarningIcon />
            <h1 className="text-xl font-semibold text-gray-700">Demo Account Restriction</h1>
            <div className="flex flex-col items-center justify-center  max-w-[412px]">
              <p className="text-sm font-normal text-gray-500 text-center">
                Creating and editing features are restricted in demo accounts. Upgrade to a premium
                plan for full access.
              </p>
              <p className="text-sm font-normal text-gray-500 text-center">
                Contact <strong>contact@unreal.ai</strong> for assistance.
              </p>
            </div>
            <Button
              variant={'unrealPrimary'}
              className="max-w-[80%] w-full mt-4"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Get Started
            </Button>
          </div>
        }
      />
    </>
  );
};
