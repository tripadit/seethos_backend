import clsx from 'clsx';
import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
interface ICustomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actions?: React.ReactNode;
  title?: string;
  subTitle?: string;
  isHideHeader?: boolean;
  body?: React.ReactNode;
  className?: string;
  isHideCloseIcon?: boolean;
}

export const CustomDialog = (props: ICustomeDialogProps) => {
  const {
    isOpen,
    onClose,
    actions,
    isHideHeader = false,
    subTitle,
    title,
    body,
    className,
    isHideCloseIcon = false,
  } = props;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent isHideCloseIcon={isHideCloseIcon} className={clsx(className)}>
        {!isHideHeader && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {subTitle && <DialogDescription>{subTitle}</DialogDescription>}
          </DialogHeader>
        )}
        {body}
        {actions && <DialogFooter>{actions}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
