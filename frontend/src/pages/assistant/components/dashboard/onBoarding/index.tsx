import React from 'react';

import { ASSISTANCEASSIST } from '@/assets/assistance';
import { CustomDialog } from '@/components/dialog';
import { Button } from '@/components/ui/button';
import { useGetCurrentUserInfo } from '@/hooks/api';
import { useUpdateCompanyDetails } from '@/pages/assistant/hooks/addAssistance';

import { UserOnboardingForm } from './form/userOnBoardingForm';

export const UserAppOnBoarding = () => {
  const [isOnboardInfoOpen, setIsOnboardInfoOpen] = React.useState<boolean>(false);
  const [openWelcomeModal, setOpenWelcomeModal] = React.useState<boolean>(false);
  const [getStartedModal, setGetStartedModal] = React.useState<boolean>(false);
  const updateCompanyDetails = useUpdateCompanyDetails(true);
  const { data } = useGetCurrentUserInfo();

  React.useEffect(() => {
    if (data && data?.data.is_active && data.data?.first_time_login) {
      setOpenWelcomeModal(true);
    }
  }, [data]);
  const handleWelcomNext = () => {
    setOpenWelcomeModal(false);
    setGetStartedModal(true);
  };
  const handleGetStartedNext = () => {
    setGetStartedModal(false);
    setIsOnboardInfoOpen(true);
  };
  const handleUserUpdate = () => {
    const formData = new FormData();
    formData.append('first_time_login', 'false');
    updateCompanyDetails.mutate(formData);
  };
  return (
    <>
      <UserOnboardingForm
        isOpen={isOnboardInfoOpen}
        onClose={() => {
          setIsOnboardInfoOpen(false);
          handleUserUpdate();
        }}
      />
      <CustomDialog
        isOpen={openWelcomeModal}
        onClose={() => {
          setOpenWelcomeModal(false);
          handleUserUpdate();
        }}
        isHideHeader
        className="max-w-[783px] w-full"
        body={
          <div>
            <div className="flex flex-row gap-5">
              <img src={ASSISTANCEASSIST.AiAssistance} className="max-h-[254px] object-contain" />
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex flex-row gap-4">
                    <h1 className="text-40 font-semibold text-gray-900">Hey Charles</h1>
                    <img src={ASSISTANCEASSIST.HiImage} className="object-contain" />
                  </div>
                  <p className="text-lg text-gray-900 font-semibold">
                    I'm Amanda, Unreal AI's virtual Assistant
                  </p>
                </div>
                <p className="text-[#23314F] font-normal text-2xl">
                  I am here to serve you with any query that you might have during your journey
                  here.
                </p>
                <Button variant={'purple'} className="w-fit" onClick={handleWelcomNext}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        }
      />
      <CustomDialog
        isOpen={getStartedModal}
        onClose={() => {
          setGetStartedModal(false);
          handleUserUpdate();
        }}
        isHideHeader
        className="max-w-[783px] w-full"
        body={
          <div>
            <div className="flex flex-row gap-5">
              <img src={ASSISTANCEASSIST.AiAssistance} className="max-h-[254px] object-contain" />
              <div className="flex flex-col gap-1">
                <h1 className="text-40 font-semibold text-gray-900">Welcome to Unreal AI</h1>
                <div className="flex flex-col gap-2">
                  <p className="text-[#23314F] font-normal text-2xl">
                    Let's get started with creating your first AI assistant and seeing how things
                    work at unreal ai.
                  </p>
                  <p className="text-[#23314F] font-normal text-2xl">
                    I’ll be right here if you need me.
                  </p>
                </div>
                <Button variant={'purple'} className="w-fit mt-5" onClick={handleGetStartedNext}>
                  Let's Go!
                </Button>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};
