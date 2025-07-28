import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CompletedIcon, CreatingIcon, DeployIcon, TraningIcon } from '@/assets/icons';
import { CustomDialog } from '@/components/dialog';
import {
  HorizontalStepper,
  IHorizontalSteps,
} from '@/components/molecules/Stepper/HorizontalStepper';
import { Button } from '@/components/ui/button';
import { ChatbotStep } from '@/pages/assistant/constant/addAssistance';
import { routes } from '@/routes/routes';

export const AssistantProgressDialog = ({
  isOpen,
  onClose,
  step,
  error = '',
  botId,
  isProgressCompleted,
  isEditMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  error?: string;
  step: ChatbotStep;
  botId: string;
  isEditMode?: boolean;
  isProgressCompleted?: boolean;
}) => {
  const [activeStep, setActiveStep] = useState<ChatbotStep>(step);

  const navigate = useNavigate();

  useEffect(() => {
    setActiveStep(step);
  }, [step]);

  const ADD_STEPS: IHorizontalSteps[] = [
    {
      index: 1,
      title: 'Creating',
    },
    {
      index: 2,
      title: 'Training',
    },
    {
      index: 3,
      title: 'Deploying',
    },
    {
      index: 4,
      title: 'Done',
    },
  ];

  const EDIT_STEPS: IHorizontalSteps[] = [
    {
      index: 1,
      title: 'Updating',
    },
    {
      index: 2,
      title: 'Training',
    },
    {
      index: 3,
      title: 'Deploying',
    },
    {
      index: 4,
      title: 'Done',
    },
  ];

  const PROGRESSDATA = [
    {
      icon: <CreatingIcon />,
      title: 'Creating Your AI Assistant',
    },

    {
      icon: <TraningIcon />,
      title: 'Training Your AI Assistant',
    },
    {
      icon: <DeployIcon />,
      title: 'Deploying Your AI Assistant',
    },
    {
      icon: <CompletedIcon />,
      title: 'AI Assistant Successfully Created',
    },
  ];

  const UPDATE_PROGRESSDATA = [
    {
      icon: <CreatingIcon />,
      title: 'Updating Your AI Assistant',
    },

    {
      icon: <TraningIcon />,
      title: 'Training Your AI Assistant',
    },
    {
      icon: <DeployIcon />,
      title: 'Deploying Your AI Assistant',
    },
    {
      icon: <CompletedIcon />,
      title: 'AI Assistant Successfully Created',
    },
  ];

  const activeData = isEditMode ? UPDATE_PROGRESSDATA[activeStep] : PROGRESSDATA[activeStep];
  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={() => {
        setActiveStep(0);
        onClose();
      }}
      className=" overflow-auto max-w-[579px]"
      body={
        <div className="flex flex-col justify-center items-center gap-5 px-5">
          <div className="flex flex-row justify-center items-center">{activeData.icon}</div>
          <h1 className="text-lg font-semibold text-gray-700 mb-3">{activeData.title}</h1>
          {activeStep === 1 && (
            <p className="text-gray-600 text-sm">
              This task may take a little longer to finish. Thank you for your patience!
            </p>
          )}
          <HorizontalStepper
            steps={isEditMode ? EDIT_STEPS : ADD_STEPS}
            activeStep={activeStep + 1}
            onStepClick={(steps) => {
              if (isProgressCompleted) {
                setActiveStep(steps.index);
              }
            }}
            error={error}
          />
          {error && <p className="text-red-500 text-base font-medium text-center">{error}</p>}
          {error && (
            <div className="flex flex-row gap-5 items-center mt-5">
              <Button variant={'purple'} onClick={onClose}>
                <ChevronRight />
                Go To Detail Page
              </Button>
            </div>
          )}
          {activeStep === ChatbotStep.COMPLETED && (
            <div className="flex flex-row gap-5 items-center mt-5">
              <Button
                variant={'purple'}
                onClick={() =>
                  isEditMode
                    ? navigate(routes.addAssistantSuccess.replace(':id', botId) + '?edit=true')
                    : navigate(routes.addAssistantSuccess.replace(':id', botId))
                }
              >
                <ChevronRight />
                Next
              </Button>
            </div>
          )}
        </div>
      }
    />
  );
};
