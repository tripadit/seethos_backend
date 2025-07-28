import { X } from 'lucide-react';
import React from 'react';

import { CustomDialog } from '@/components/dialog';
import { Button } from '@/components/ui/button';

import { useDeleteSenderEmail, useGetSenderEmailList } from '../../../hooks/campaignManagement';

export const SenderEmailsList = ({ isViewMode }: { isViewMode?: boolean }) => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [currentRecord, setCurrenRecord] = React.useState<number>();
  const { data } = useGetSenderEmailList();
  const deleteSenderEmail = useDeleteSenderEmail();

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleDeleteSenderEmail = async () => {
    await deleteSenderEmail.mutateAsync(currentRecord as number);

    handleCloseModal();
  };
  return (
    <div className="flex flex-col">
      <p className="text-base text-[#667085] font-normal">Add your sender emails here.</p>
      {data?.data && data.data.length > 0 && (
        <div className="flex flex-col gap-1 py-1">
          {data.data.map((item, index: number) => (
            <div
              onClick={() => {
                if (!isViewMode) {
                  setOpenModal(true);
                  setCurrenRecord(item.id);
                }
              }}
              className="flex flex-row justify-between gap-5 w-full cursor-pointer hover:bg-gray-100 p-2 rounded-sm"
            >
              <div className="flex flex-row gap-2 items-center text-sm text-[#4B5563]">
                <h1 className="font-bold">{index + 1}.</h1>
                <p>{item.email}</p>
              </div>
              {!isViewMode && <X size={20} />}
            </div>
          ))}
        </div>
      )}
      <CustomDialog
        title="Delete this sender email?"
        body="Are you sure you want to delete this sender email?"
        isOpen={openModal}
        onClose={handleCloseModal}
        actions={
          <>
            <Button variant="secondary" className="mt-5" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              isLoading={deleteSenderEmail.isLoading}
              variant="purple"
              className="mt-5"
              onClick={handleDeleteSenderEmail}
            >
              Confirm
            </Button>
          </>
        }
      ></CustomDialog>
    </div>
  );
};
