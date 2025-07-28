import { useState } from 'react';

import { HelpIcon } from '@/assets/icons';
import { Button } from '@/components/ui/button';

import { CustomDialog } from './CustomDialog';

interface IHelpDialog {
  title: string;
  body: string;
  image?: string;
}

export const HelpDialog = ({ title, body, image }: IHelpDialog) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleModal = () => {
    setOpen(!open);
  };
  return (
    <>
      <HelpIcon className="cursor-pointer help-icon-form" onClick={toggleModal} />
      <CustomDialog
        isOpen={open}
        onClose={toggleModal}
        body={
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <div className="flex flex-col items-center justify-center gap-5">
              <p className="text-sm font-normal text-black/80 text-center">{body}</p>
              {image && <img src={image} alt="help" className="object-contain" />}
              <Button variant={'purple'} onClick={toggleModal}>
                Got it!
              </Button>
            </div>
          </div>
        }
      />
    </>
  );
};
