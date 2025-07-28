import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { ASSISTANCEASSIST } from '@/assets/assistance';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { PageHeader, Stepper } from '@/components/molecules';
import { Badge } from '@/components/ui/badge';
import { useGetCurrentUserInfo } from '@/hooks/api';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { useTabs } from '@/hooks/useTabs';

import { AssistantFaq } from '../components/addAssistance/assistantFab';
import { AssistanceAvatar } from '../components/addAssistance/form/assistanceAvatar';
import { AssistanTraning } from '../components/addAssistance/form/assistanTraning';
import { BusinessDetails } from '../components/addAssistance/form/businessDetails';
import { DataCollection } from '../components/addAssistance/form/dataCollection';
import { AssistanceGreeting } from '../components/addAssistance/form/greeting';
import { PreviewChatBot } from '../components/addAssistance/preview';
import { AddAssistanceProgressBar } from '../components/addAssistance/progressBar';
import { AssistantProgressDialog } from '../components/addAssistance/status';
import { ChatbotStep } from '../constant/addAssistance';
import { CreateBotFormStep, STEPS } from '../constant/common';
import {
  useAddAssistantSitemap,
  useCreateAssistant,
  useDeployAssistant,
  useGetAssistantDetail,
  useUpdateAssistant,
  useUpdateAssistantData,
} from '../hooks/addAssistance';
import { tranformCreateAssistantFormToApi } from '../utils/addAssistance';

const BusinessDetailsSchema = z.object({
  location: z.string({ required_error: 'Please enter location.' }).min(1, 'Please enter location.'),
  company_name: z
    .string({ required_error: 'Please enter business name.' })
    .min(1, 'Please enter business name.'),
  company_logo: z
    .any()
    .nullish()
    .refine(
      (file) => {
        if (!file) return false;
        return true;
      },
      {
        message: 'Please upload a business logo.',
      },
    )
    .refine(
      (file) => {
        if (file instanceof File) {
          // Assuming file is a File object
          const fileSizeInMB = file.size / (1024 * 1024);
          return fileSizeInMB <= 3;
        }
        return true;
      },
      {
        message: 'File size should be less than or equal to 2MB.',
      },
    ),
  ideal_customer_profile: z
    .string({ required_error: 'Please enter ideal customer profile.' })
    .min(1, 'Please enter ideal customer profile.'),
  company_description: z
    .string({ required_error: 'Please enter company description.' })
    .min(1, 'Please enter company description.'),
});

const AssistanceAvatarFormSchema = z.object({
  default_avatar: z
    .any()
    .nullish()
    .refine(
      (file) => {
        if (!file) return false;
        return true;
      },
      {
        message: 'Please select an assistance avatar.',
      },
    ),
  name: z
    .string({ required_error: 'Please enter or select assistance name.' })
    .min(1, 'Please enter or select assistance name.'),
});
const AssistanceTraningFormSchema = z.object({
  sitemap_url: z
    .string()
    .optional()
    .refine(
      (url) => {
        if (url) {
          try {
            const parsedUrl = new URL(url as string);
            return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
          } catch (_) {
            return false;
          }
        }
        return true;
      },
      {
        message: 'Sitemap URL must be a valid URL starting with http:// or https://.',
      },
    ),
  sitemap_urls: z.array(z.string()).default([]),
  traning_links: z.array(z.string()).default([]),
  files: z.array(z.string()).optional().default([]),
  training_files: z
    .array(
      z.object({
        account: z.string(),
        created_at: z.string(),
        file: z.string(),
        id: z.string(),
        name: z.string(),
        size: z.string(),
        type: z.string(),
        updated_at: z.string(),
      }),
    )
    .default([]),
  agent_role: z
    .string({ required_error: 'Please select an agent role' })
    .min(1, 'Please select an assistant role'),
});

const AssistanceGreetingFormSchema = z.object({
  greeting_message: z
    .string({ required_error: 'Please enter greeting message.' })
    .min(1, 'Please enter greeting message.'),
  greeting_tags: z
    .array(z.string())
    .nonempty('Please select one-click easy options.')
    .max(3, 'Please select at most 3 option.'),
  custom_prompt: z.string().optional(),
  color: z
    .string({ required_error: 'Please enter brand color.' })
    .min(6, 'Invalid color code.')
    .refine((color) => /^#[0-9A-F]{6}$/i.test(color), {
      message: 'Invalid hex color code. It must start with a hash (#) and be 6 characters long.',
    }),
  theme: z.string({ required_error: 'Please select theme' }).min(1, 'Please select theme'),
});
const AssistantDataCollectionFormSchema = z.object({
  question: z.array(z.object({ value: z.string() })),
});
export type BusinessDetailsSchemaType = z.infer<typeof BusinessDetailsSchema>;
export type AssistanceAvatarFormSchemaType = z.infer<typeof AssistanceAvatarFormSchema>;
export type AssistanceTraningFormSchemaType = z.infer<typeof AssistanceTraningFormSchema>;
export type AssistanceGreetingFormSchemaType = z.infer<typeof AssistanceGreetingFormSchema>;
export type AssistantDataCollectionFormSchemaType = z.infer<
  typeof AssistantDataCollectionFormSchema
>;

interface IAddAssistanceProps {
  isEditMode?: boolean;
  assistantId?: string;
}

const AddAssistance = ({ isEditMode = false, assistantId }: IAddAssistanceProps) => {
  const [activeStep, setActiveStep] = React.useState<CreateBotFormStep>(
    CreateBotFormStep['Company Details'],
  );
  const [isCreateMode, setIsCreateMode] = React.useState<boolean>(false);
  const [activatedSetps, setActivatedSetps] = React.useState<CreateBotFormStep[]>([
    CreateBotFormStep['Company Details'],
  ]);
  const [checkStatus, setCheckStatus] = React.useState<boolean>(false);
  const [openAssistantProgressDialog, setOpenAssistantProgressDialog] =
    React.useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = React.useState<any>({});
  const [progressState, setProgressState] = React.useState<ChatbotStep>(ChatbotStep.CREATING);
  const [isProgressCompleted, setIsProgressCompleted] = React.useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useTabs(['1', '2'], '1');
  const [traningTab, setTraningTab] = useTabs(['1', '2'], '1');
  const userProfile = useGetCurrentUserInfo();
  const createAssitant = useCreateAssistant();
  const addAssistantSiteMap = useAddAssistantSitemap();
  const deployAssistant = useDeployAssistant();
  const updateDeployAssistant = useUpdateAssistant();
  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();

  const updateAssistant = useUpdateAssistantData(async (data: any) => {
    const res = await updateDeployAssistant.mutateAsync({ id: data?.id });
    if (res) {
      setCheckStatus(true);
      setOpenAssistantProgressDialog(true);
    }
  });
  const assistantDetaills = useGetAssistantDetail({
    id: currentRecord?.id || assistantId,
    enabled: currentRecord?.id != null || assistantId != null,
  });

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  React.useEffect(() => {
    if ((assistantDetaills?.data && !isEditMode) || (assistantDetaills?.data && checkStatus)) {
      let intervalId: any;
      if (assistantDetaills.data?.traning_status === 'TRAINING') {
        setProgressState(ChatbotStep.TRAINING);
      }
      if (assistantDetaills.data?.traning_status === 'TRAINED') {
        clearInterval(intervalId);
        setProgressState(ChatbotStep.DEPLOYING);
        setTimeout(() => {
          setProgressState(ChatbotStep.COMPLETED);
          setIsProgressCompleted(true);
          setCheckStatus(false);
        }, 1000);
      }
      if (assistantDetaills.data?.traning_status !== 'TRAINED') {
        if (!assistantDetaills.error) {
          intervalId = setInterval(() => {
            assistantDetaills.refetch();
          }, 5000);
        } else {
          clearInterval(intervalId);
        }
      }

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, [assistantDetaills.data, checkStatus]);

  const businessDetailsForm = useForm<BusinessDetailsSchemaType>({
    resolver: zodResolver(BusinessDetailsSchema),
    defaultValues: React.useMemo(() => {
      return {
        location: userProfile.data?.data.address || '',
        company_name:
          (assistantDetaills?.data?.company_name || userProfile.data?.data.company_name) ?? '',
        company_logo:
          (assistantDetaills?.data?.company_logo || userProfile.data?.data.company_logo) ?? null,
        ideal_customer_profile: userProfile.data?.data.ideal_customer_profile || '',
        company_description: assistantDetaills?.data?.company_description || '',
      };
    }, [userProfile.data]),
    mode: 'all',
  });

  const assistanceAvatarForm = useForm<AssistanceAvatarFormSchemaType>({
    resolver: zodResolver(AssistanceAvatarFormSchema),
    defaultValues: {},
    mode: 'all',
  });
  const assistanceTraningForm = useForm<AssistanceTraningFormSchemaType>({
    resolver: zodResolver(AssistanceTraningFormSchema),
    defaultValues: {
      training_files: [],
      traning_links: [],
    },
    mode: 'all',
  });

  const assistanceGreetingForm = useForm<AssistanceGreetingFormSchemaType>({
    resolver: zodResolver(AssistanceGreetingFormSchema),
    defaultValues: {
      color: '#7F34A1',
      theme: 'light',
      greeting_tags: ['Just Browsing', 'About Us'],
      custom_prompt: `You are an expert _assistant_role_ named _name_ from _company_name.  Your role is to greet the guests visiting __company_name_'s website.
                    It is your responsibility to ask questions, store the results for further use, and answer questions based on the information you have about _company_name_.
                    If you don't know the answer to a question, please kindly share that you do not know the answer.
            
                    Your tone and approach should always be professional, courteous, and kind throughout the entire conversation.  You want to ask and answer questions in a very human way.  For example, you might tell the guest that they've asked a great question.  Or you might respond by saying that you need to think about the question or look up the answer to their question.
            
                    Begin by introducing yourself, thanking the guest for visiting _company_name's website, ask them to please let you know if there is anything you can "quickly help" them with, and ask __questions_ from the guest, one question for each piece of information.
            
                    Ask all of the _questions_ to the visitor.
            
                    Don't hesitate to ask the _questions_ again if the guest doesn't provide you an answer the first time.
            
                    Ask the guest one question at a time.
            
                    If a guest asks you a question in response to your question, make sure to answer them and then politely ask your question again until you have the answer. 
            
                    Thank the guest when they answer a question.
            
                    If the guest's question is not related to your company or your role, you can simply reply with "That is a great question but I don't know the answer.  I am simply a humble _assistant_role_ for _company_name_ but I can certainly help you with any questions you may have about the company."
            
                    If the guest has not answered _questions_ then ask them again.
            
                    Your output should be as short as a human would prefer and usually much less than 200 words.
            
            
                    Begin the conversation:`,
      greeting_message:
        "Good morning, my name is [FIRST_NAME], I'm [BUSINESS_NAME]'s assistant. Is there anything I can quickly help you with?",
    },
    mode: 'all',
  });

  const assistanceDataCollectionForm = useForm<AssistantDataCollectionFormSchemaType>({
    defaultValues: {
      question: [{ value: 'Name' }, { value: 'Email' }, { value: 'Number' }],
    },
  });
  React.useEffect(() => {
    if (isEditMode && assistantDetaills.data) {
      const assistant = assistantDetaills.data;
      businessDetailsForm.reset({
        location: assistant?.location ?? userProfile.data?.data.address ?? '',
        company_name: assistant.company_name,
        company_logo: assistant.company_logo,
        ideal_customer_profile: assistant?.ideal_customer_profile,
        company_description: assistant.company_description,
      });
      assistanceAvatarForm.reset({
        default_avatar: assistant.avatar,
        name: assistant.name,
      });
      assistanceGreetingForm.reset({
        color: assistant?.color ?? '#7F34A1',
        theme: assistant?.theme ?? 'light',
        custom_prompt: assistant?.custom_prompt,
        greeting_tags:
          assistant.greeting_tags.length > 0 ? assistant.greeting_tags[0].split(',') : [],
        greeting_message: assistant.greeting_message,
      });
      assistanceDataCollectionForm.reset({
        question: assistant.question.split(',').map((item: string) => ({ value: item })),
      });
    }
  }, [assistantDetaills.data]);

  const handleNextBusinessDetails = async (
    tab: '1' | '2' | null,
    isChangeStep?: boolean,
    isBack?: boolean,
  ) => {
    if (selectedTab === '1' && !isChangeStep && !isBack) {
      const result = await businessDetailsForm.trigger();
      if (!result) return;
    }
    if (selectedTab === '2' && !isBack) {
      const result = await assistanceAvatarForm.trigger();
      if (!isEditMode && !currentRecord?.id) {
        const values = assistanceAvatarForm.getValues();
        const greeting = assistanceGreetingForm.getValues();
        const business = businessDetailsForm.getValues();
        assistanceGreetingForm.setValue(
          'greeting_message',
          greeting.greeting_message
            .replace('[FIRST_NAME]', values.name)
            .replace('[BUSINESS_NAME]', business.company_name),
        );
      }
      if (!result) return;
    }

    if (isChangeStep) {
      setActiveStep(CreateBotFormStep['Training']);
      setActivatedSetps([...activatedSetps, CreateBotFormStep['Training']]);
    }
    setSelectedTab(tab);
  };

  const handleStepClick = (step: keyof typeof CreateBotFormStep) => {
    setActiveStep(CreateBotFormStep[step]);
  };

  const handleNextTraningDetails = async (
    tab: '1' | '2' | null,
    isChangeStep: boolean,
    isBack: boolean,
  ) => {
    if (tab == '1' && isChangeStep && isBack) {
      setActiveStep(CreateBotFormStep['Company Details']);
      setSelectedTab('2');
    }
    if (tab == '1' && !isBack && isChangeStep && !isEditMode) {
      const result = await assistanceTraningForm.trigger();
      if (!result) return;
      const values = assistanceTraningForm.getValues();
      if (values.traning_links.length === 0 && values.training_files.length === 0) {
        assistanceTraningForm.setError('sitemap_url', {
          message: 'Either Training URL or Training Files must be present.',
        });
        assistanceTraningForm.setError('files', {
          message: 'Either Training URL or Training Files must be present.',
        });
        return;
      }
      assistanceTraningForm.clearErrors();
      setActiveStep(CreateBotFormStep['Data Collection']);
      setActivatedSetps([...activatedSetps, CreateBotFormStep['Data Collection']]);
    }

    if (tab == '2' && !isBack) {
      const result = await assistanceGreetingForm.trigger();
      if (!result) return;
    }
    if (tab == '2' && isEditMode) {
      setTraningTab('1');
      setActiveStep(CreateBotFormStep['Data Collection']);
    }
    setTraningTab(tab);
  };
  const handleBack = () => {
    setActiveStep(CreateBotFormStep['Training']);
    setTraningTab(isEditMode ? '1' : '2');
  };

  const handleCreateAssistant = async () => {
    const isDemoAccount = checkAccount();
    if (isDemoAccount) {
      return;
    }
    const bussinessDetails = businessDetailsForm.getValues();
    const avatarDetails = assistanceAvatarForm.getValues();
    const greetingDetails = assistanceGreetingForm.getValues();
    const traningDetails = assistanceTraningForm.getValues();
    const dataCollectionDetails = assistanceDataCollectionForm.getValues();
    let poyload: any = {
      ...bussinessDetails,
      ...avatarDetails,
      ...greetingDetails,
      ...dataCollectionDetails,
      training_files: traningDetails.training_files,
      status: true,
    };
    if (!isEditMode) {
      poyload = {
        ...poyload,
        agent_role: traningDetails.agent_role,
      };
    }

    const tranformedPayload = tranformCreateAssistantFormToApi(poyload);
    const formData = new FormData();
    Object.entries(tranformedPayload).forEach(([key, value]) => {
      if (key === 'files') {
        (value as string[]).forEach((id: string) => {
          formData.append('files', id);
        });
        return;
      }
      formData.append(key, value);
    });
    if (currentRecord?.id) {
      setIsCreateMode(false);
    }
    const response =
      currentRecord?.id || isEditMode
        ? await updateAssistant.mutateAsync({
            id: currentRecord?.id || assistantId,
            body: formData,
          })
        : await createAssitant.mutateAsync(formData);

    if (response?.id && !isEditMode && !currentRecord?.id) {
      setIsCreateMode(true);
      setCurrentRecord(response);
      setIsProgressCompleted(false);

      setOpenAssistantProgressDialog(true);
      if (traningDetails.traning_links.length > 0) {
        const sitmapPayload = {
          chatbot: response?.id,
          traning_links: traningDetails.traning_links,
          url: traningDetails.sitemap_url,
        };
        await addAssistantSiteMap.mutateAsync(sitmapPayload);
      }
      const deployAssistantResponse = await deployAssistant.mutateAsync({ id: response?.id });
      if (deployAssistantResponse) {
        if (callbackUrl && callbackUrl !== 'null') {
          navigate(callbackUrl + '?assistant_id=' + response?.id?.toString());
        }
      }
    }
  };
  const progressBarInfo = React.useMemo(() => {
    let message = 'Let’s fill in your business details';
    let progress = 25;
    if (!isEditMode) {
      if (activatedSetps.includes(CreateBotFormStep['Company Details']) && selectedTab === '1') {
        message = `Let's fill in your business details`;
        progress = 25;
      }
      if (activatedSetps.includes(CreateBotFormStep['Company Details']) && selectedTab === '2') {
        message = `Congrats, first step completed. Let's start designing your assistant.`;
        progress = 45;
      }
      if (activatedSetps.includes(CreateBotFormStep['Training'])) {
        message = `You're getting there. Let's Train your Assistant`;
        progress = 60;
      }
      if (activatedSetps.includes(CreateBotFormStep['Training']) && traningTab === '2') {
        message = `Great, you're almost there. Let's Train your Assistant`;
        progress = 80;
      }
      if (activatedSetps.includes(CreateBotFormStep['Data Collection'])) {
        progress = 95;
        message = `You're almost there. Let's quickly finish creating your assistant`;
      }
    }
    return {
      message,
      progress,
    };
  }, [selectedTab, activatedSetps, traningTab]);

  const assistantFabContent = React.useMemo(() => {
    let content = {
      title: 'Need Assistance?',
      description: `Let's get you started by filling up your business details first.`,
    };
    if (!isEditMode) {
      if (activeStep === CreateBotFormStep['Company Details'] && selectedTab === '1') {
        content = {
          title: 'Need Assistance?',
          description: `Let's get you started by filling up your business details first.`,
        };
      }
      if (activeStep === CreateBotFormStep['Company Details'] && selectedTab === '2') {
        content = {
          title: 'Need Assistance?',
          description: `You can click “Generate More Avatars” to get more options for your assistant.You can click “Generate New Names” to get more options for your assistant name.`,
        };
      }
      if (activeStep === CreateBotFormStep['Training'] && traningTab === '1') {
        content = {
          title: 'Need Assistance?',
          description: `Let's start customizing your assistant's.`,
        };
      }
      if (activeStep === CreateBotFormStep['Training'] && traningTab === '2') {
        content = {
          title: 'Need Assistance?',
          description: `You can add traning files or traning links to train your assistant.`,
        };
      }
      if (activeStep === CreateBotFormStep['Data Collection']) {
        content = {
          title: 'Need Assistance?',
          description: `You can add questions to collect data from your customers.`,
        };
      }
    }
    return content;
  }, [selectedTab, activatedSetps, traningTab, activeStep]);

  return (
    <div className="mb-20 relative">
      <PageHeader
        title={isEditMode ? 'Edit Assistant' : 'Create a new assistant'}
        children={
          isEditMode ? (
            assistantDetaills?.data?.traning_status && (
              <div>
                <Badge
                  variant={
                    assistantDetaills?.data?.traning_status === 'TRAINING'
                      ? 'warning'
                      : assistantDetaills?.data?.traning_status === 'UNTRAINED'
                        ? 'destructive'
                        : 'success'
                  }
                  className="capitalize"
                >
                  {assistantDetaills?.data?.traning_status}
                </Badge>
              </div>
            )
          ) : (
            <></>
          )
        }
      />
      {!isEditMode && <AddAssistanceProgressBar progressBarInfo={progressBarInfo} />}
      <div className="flex flex-row mt-10 gap-10">
        <Stepper
          steps={STEPS}
          activeStep={activeStep + 1}
          onStepClick={(step) => {
            if (activatedSetps.includes(CreateBotFormStep[step]) || isEditMode) {
              handleStepClick(step);
              setSelectedTab('1');
              setTraningTab('1');
            }
          }}
          className="col-span-2 mt-2 ml-2 h-[100px]"
          itemClassName="after:h-5"
        />
        <div className="w-full max-w-[649px] mt-1">
          {activeStep === CreateBotFormStep['Company Details'] && (
            <>
              {selectedTab === '1' && (
                <BusinessDetails
                  form={businessDetailsForm}
                  handleNextBusinessDetails={handleNextBusinessDetails}
                />
              )}
              {selectedTab === '2' && (
                <AssistanceAvatar
                  avatar={assistantDetaills?.data?.avatar}
                  form={assistanceAvatarForm}
                  businessDetailsForm={businessDetailsForm}
                  handleNextBusinessDetails={handleNextBusinessDetails}
                  isEidtMode={isEditMode || currentRecord?.id}
                />
              )}
            </>
          )}
          {activeStep === CreateBotFormStep['Training'] && (
            <>
              {traningTab === '1' && (
                <AssistanceGreeting
                  form={assistanceGreetingForm}
                  handleNextTraningDetails={handleNextTraningDetails}
                />
              )}
              {traningTab === '2' && (
                <AssistanTraning
                  form={assistanceTraningForm}
                  handleNextTraningDetails={handleNextTraningDetails}
                />
              )}
            </>
          )}
          {activeStep === CreateBotFormStep['Data Collection'] && (
            <>
              <DataCollection
                handleBack={handleBack}
                form={assistanceDataCollectionForm}
                handleCreateAssistant={handleCreateAssistant}
                isLoading={
                  createAssitant.isLoading ||
                  deployAssistant.isLoading ||
                  updateAssistant.isLoading ||
                  updateDeployAssistant.isLoading
                }
                isUpdateMode={currentRecord?.id || isEditMode}
              />
            </>
          )}
        </div>
        {((activeStep === CreateBotFormStep['Training'] && traningTab === '1') ||
          activeStep === CreateBotFormStep['Data Collection']) && (
          <div className="max-w-[350px] w-full">
            <PreviewChatBot
              isDataCollectionTap={activeStep === CreateBotFormStep['Data Collection']}
              assistanceName={assistanceAvatarForm.watch('name') ?? 'Amanda Murphy'}
              assistanceAvatar={
                assistanceAvatarForm.watch('default_avatar') ?? ASSISTANCEASSIST.AssistanceAvatar1
              }
              greetingMessage={assistanceGreetingForm.watch('greeting_message') ?? ''}
              greetingTags={assistanceGreetingForm.watch('greeting_tags') ?? []}
              brandColor={assistanceGreetingForm.watch('color') ?? '#7F34A1'}
              theme={assistanceGreetingForm.watch('theme') ?? 'light'}
            />
          </div>
        )}
        <AssistantProgressDialog
          isOpen={openAssistantProgressDialog}
          onClose={() => {
            setOpenAssistantProgressDialog(false);
          }}
          step={progressState}
          botId={currentRecord?.id || assistantId}
          isEditMode={isEditMode || (!isCreateMode && currentRecord?.id)}
          isProgressCompleted={isProgressCompleted}
        />
        {!isEditMode && (
          <AssistantFaq
            title={assistantFabContent?.title}
            description={assistantFabContent?.description}
          />
        )}
        {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}
      </div>
    </div>
  );
};

export default AddAssistance;
