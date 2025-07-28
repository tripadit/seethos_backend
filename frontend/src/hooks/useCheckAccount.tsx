import { useState } from 'react';

import { useStore } from '@/store/store';

export const useCheckAccount = () => {
  const [showDialog, setShowDialog] = useState(false);
  const isDemoAccount = useStore((state) => state?.isDemoAccount);

  const checkAccount = (trigger?: VoidFunction) => {
    if (isDemoAccount) {
      setShowDialog(true);
      return true;
    } else {
      trigger?.();
      return false;
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return {
    checkAccount,
    showDialog,
    handleCloseDialog,
  };
};
