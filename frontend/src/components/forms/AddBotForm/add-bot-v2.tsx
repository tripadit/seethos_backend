import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { CPUIcon, DraftIcon } from '@/assets/icons';
import { BotProgressDialog } from '@/components/dialog/BotProgressDialog';
import { UpgradeDialog } from '@/components/dialog/UpgradeSubscriptionDialog';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { CONVERSATION_START } from '@/global/appConstants';
import {
  addBotSchema,
  useAddBot,
  useAddSitemap,
  // useDeleteChatBot,
  useDeployChatbot,
  useFetchChatbot,
  useGetCurrentUserInfo,
  useUpdateBot,
  useUpdateChatBot,
} from '@/hooks/api';
import { useCheckAccount } from '@/hooks/useCheckAccount';
import { ensureHTTPS } from '@/lib/utils';
import { routes } from '@/routes/routes';
import { useStore } from '@/store/store';

import { PreviewChatModal, Stepper } from '../../molecules';
import { SubHeading } from '../../molecules/Header/SubHeading';
import { Button } from '../../ui/button';
import { ChatbotStep, CreateBotFormStep, getStepFromParam, hasValue, STEPS } from './helpers';
import { CallToAction } from './steps/CallToAction';
import { CompanyDetails } from './steps/CompanyDetails';
import { DataCollection } from './steps/DataCollection';
import { Training } from './steps/Training';

export const AddBotFormV2 = ({ mode, botId }: { mode?: string | null; botId?: string | null }) => {
  const { toast } = useToast();

  const [botMode, setBotMode] = useState<string>(mode as string);
  const setBotStep = useStore((state: any) => state.setBotStep);
  const resetBotStep = useStore((state: any) => state.resetBotStep);
  const navigate = useNavigate();
  const [file, setFile] = useState<any>();
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [siteMapURL, setSiteMapURL] = useState<string>('');
  const [trainingState, setTrainingState] = useState<ChatbotStep>(ChatbotStep.CREATING);
  const [error, setError] = useState<string>('');
  const [companyLogo, setCompanyLogo] = useState<any>();
  const [fetchSitemap, setIsFetchSitemap] = useState<boolean>(false);
  const [siteMapLinks, setSiteMapLinks] = useState<string[]>([]);
  const [trainingLinks, setTrainingLinks] = useState<string[]>([]);
  const [trainFile, setTrainFile] = useState<any[]>([]);
  const [tag, setTag] = useState<string[]>([]);
  const [tagValue, setTagValue] = useState<any>();
  const [questions, setQuestions] = useState<number>(2);
  const [questionValue, setQuestionValue] = useState<string[]>(['name', 'email']);
  const [openProgressModal, setOpenProgressModal] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<CreateBotFormStep>(
    CreateBotFormStep['Company Details'],
  );
  const [createdBotId, setCreatedBotId] = useState<string>('');
  const [formState, setFormState] = useState<CreateBotFormStep>(
    botMode === 'edit' ? CreateBotFormStep['Call To Action'] : CreateBotFormStep['Company Details'],
  );
  const { status: siteMapAddStatus, mutate: addSiteMapFn } = useAddSitemap();
  const { status: botAddStatus, mutate: addBotFn } = useAddBot();
  // const { status: chatdeleteStatus, mutate: deleteChatbotFn } = useDeleteChatBot();
  const { status: botUpdateStatus, mutate: updateBotFn } = useUpdateBot();
  const { status: deploymentStatus, mutate: deployChatbotFn } = useDeployChatbot();
  const { status: chatUpdateStatus, mutate: updateChatbotFn } = useUpdateChatBot();
  const { data: personalInfo } = useGetCurrentUserInfo();
  const { data: botDetail } = useFetchChatbot(botId as string, {
    onSuccess: (response: any) => {
      form.reset({
        ...response,
        question: response?.question?.split(','),
        files: [],
      });
      response.company_logo && setCompanyLogo(response.company_logo);
      response.greeting_tags && setTag(response.greeting_tags[0].split(','));
      if (response?.question) {
        setQuestions(response?.question.split(',').length);
        setQuestionValue(response?.question.split(','));
      }

      if (response?.traning_links) {
        setTrainingLinks(response?.traning_links[0].split(','));
        setSiteMapLinks(response?.traning_links[0].split(','));
      }

      if (response.file) {
        setTrainFile(response.file);
      }
    },
  });

  const { data: createdBot, refetch: refetchCreatedBot } = useFetchChatbot(createdBotId);
  const { checkAccount, showDialog, handleCloseDialog } = useCheckAccount();
  const handleStepClick = (step: keyof typeof CreateBotFormStep) => {
    setActiveStep(CreateBotFormStep[step]);
  };

  const toogleBotStep = (step: number) => {
    if (activeStep >= formState) {
      setFormState(activeStep + 1);
      setBotStep(step);
    }
  };

  const form = useForm<z.infer<typeof addBotSchema>>({
    resolver: zodResolver(addBotSchema),
    defaultValues: !botDetail
      ? {
          name: '',
          status: true,
          avatar: '4',
          conversation_end_flow: '',
          conversation_start_flow: CONVERSATION_START[0],
          call_to_action_link: '',
          call_to_action_prompt: '',
          question: [],
          greeting_tags: [],
          files: [],
          company_logo: personalInfo?.data?.company_logo,
          company_name: personalInfo?.data?.company_name ? personalInfo?.data?.company_name : '',
          agent_role: '',
        }
      : {
          ...botDetail,
          greeting_tags: botDetail.greeting_tags,
          avatar: botDetail.avatar,
          company_logo: botDetail.company_logo,
          chatbot_id: botDetail.bot_id,
          files: [],
          agent_role: botDetail.agent_role ? botDetail.agent_role : 'Sales',
        },
  });

  const handleValidation = ({
    condition,
    name,
    options,
  }: {
    condition: boolean;
    name: any;
    options: Record<string, any>;
  }) => {
    if (condition) {
      form.setError(name, options);
      return false;
    } else {
      form.clearErrors(name);
      return true;
    }
  };

  useEffect(() => {
    if (trainingLinks.length) {
      handleValidation({
        condition: trainingLinks?.length === 0 && botMode !== 'edit',
        name: 'files',
        options: { message: 'Either Training Files or Training URL is required' },
      });
    }
  }, [trainingLinks]);

  useEffect(() => {
    if (personalInfo) {
      form.setValue('company_name', personalInfo?.data?.company_name);
      form.setValue('company_logo', personalInfo?.data?.company_logo);
    }
  }, [personalInfo]);

  useEffect(() => {
    let intervalId: number | undefined;
    if (createdBot && createdBotId && !isDraft) {
      if (createdBot.traning_status === 'UNTRAINED') {
        setTrainingState(ChatbotStep.CREATING);
      }
      if (createdBot.traning_status === 'TRAINING') {
        setTrainingState(ChatbotStep.TRAINING);
      }
      if (createdBot.traning_status === 'TRAINED') {
        setTrainingState(ChatbotStep.COMPLETED);
      }
      refetchCreatedBot();
      if (!error && !isDraft) {
        intervalId = setInterval(() => {
          refetchCreatedBot();
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
  }, [createdBot, createdBotId, refetchCreatedBot]);

  useEffect(() => {
    botMode === 'edit' ? setBotStep(3) : setBotStep(formState);
    if (Object.keys(form.formState.errors).length > 0) {
      setActiveStep(parseInt(getStepFromParam(Object.keys(form.formState.errors)[0])));
    }
    return () => {
      resetBotStep();
    };
  }, [form.formState.errors]);

  function onSubmit(values: z.infer<typeof addBotSchema>) {
    const isTrainingValid = handleValidation({
      condition: trainFile?.length === 0 && trainingLinks?.length === 0 && botMode !== 'edit',
      name: 'files',
      options: { message: 'Either Training Files or Training URL is required' },
    });

    const isAvatarValid = handleValidation({
      condition:
        file == null &&
        (form.getValues('avatar') === undefined ||
          form.getValues('avatar') === '' ||
          form.getValues('avatar') === null),
      name: 'avatar',
      options: { message: 'Avatar is required' },
    });

    const isCompanyLogoValid =
      personalInfo?.data.company_logo === '' || personalInfo?.data.company_logo === null
        ? handleValidation({
            condition: companyLogo == null,
            name: 'company_logo',
            options: { message: 'Company Logo is required' },
          })
        : true;

    if (!isTrainingValid || !isAvatarValid || !isCompanyLogoValid) {
      return;
    }
    const formFile = form.getValues('avatar');
    let req: any = {
      ...values,
      call_to_action_link: ensureHTTPS(values.call_to_action_link || ''),
      company_logo: companyLogo,
      question: questionValue,
      files: trainFile?.map((el: any) => parseInt(el.id)),
      greeting_tags: tag,
    };
    if (formFile !== 'custom-icon' && formFile) {
      delete req.avatar;
      req = { ...req, default_avatar: formFile };
    } else {
      req = { ...req, avatar: file };
    }

    if (
      typeof req.company_logo === 'string' ||
      req.company_logo === undefined ||
      req.company_logo === null
    ) {
      delete req.company_logo;
    }
    if (!values.files || !!values.files.length) {
      form.setError('files', {
        type: 'manual',
        message: 'Either File or Sitemap is required',
      });
    }

    checkAccount(() => {
      if (botMode === 'edit') {
        if (typeof req.avatar === 'string' || req.avatar === undefined) {
          delete req.avatar;
        }
        setOpenProgressModal(true);
        setCreatedBotId(botId as string);
        updateBotFn(req, {
          onSuccess: () => {
            if (req.status) {
              toast({
                variant: 'success',
                title: 'Updating agent...',
              });

              !botDetail.container_id &&
                deployChatbotFn(botId as string, {
                  onSuccess: () => {
                    toast({
                      variant: 'success',
                      title: 'Chatbot updated successfully',
                    });
                    navigate(routes.dashboard);
                  },
                  onError: () => {
                    setError('Error Deploying Chatbot');
                  },
                });
              botDetail.container_id &&
                updateChatbotFn(req.id as string, {
                  onError: () => {
                    setError('Error updating Chatbot');
                  },
                });
            }
            if (!req.status) {
              navigate(routes.dashboard);
            }
          },
          onError: () => {
            setError('Error updating Chatbot');
          },
        });
      } else {
        !isDraft && setOpenProgressModal(true);
        addBotFn(req, {
          onSuccess: (botResponse) => {
            setBotMode('edit');
            setCreatedBotId(botResponse.id);
            if (
              req.status === true &&
              (siteMapURL !== '' || siteMapURL === undefined) &&
              !!trainingLinks.length
            ) {
              addSiteMapFn(
                {
                  url: ensureHTTPS(siteMapURL),
                  traning_links: trainingLinks,
                  chatbot: botResponse.id,
                },
                {
                  onSuccess: () => {
                    !isDraft &&
                      deployChatbotFn(botResponse.id, {
                        onSuccess: () => {
                          !req.status && navigate(routes.dashboard);
                        },
                        onError: (err) => {
                          setError(err.error || 'Error Deploying Chatbot');
                        },
                      });
                    isDraft && navigate(routes.dashboard);
                    !isDraft && setIsDraft(false);
                  },
                },
              );
            }
            if (req.status === true && siteMapURL === '' && !trainingLinks.length) {
              !isDraft &&
                deployChatbotFn(botResponse.id, {
                  onSuccess: () => {
                    !req.status && navigate(routes.dashboard);
                  },
                  onError: () => {
                    setError('Error Deploying Chatbot');
                  },
                });
              isDraft && navigate(routes.dashboard);
            }
          },
        });
      }
    });
  }

  const isNextDisabled = (activeStep: number): boolean => {
    switch (activeStep) {
      case 0:
        if (
          hasValue(form.getValues('name')) &&
          (file || form.getValues('avatar')) &&
          (companyLogo || form.getValues('company_logo')) &&
          hasValue(form.getValues('company_name'))
        ) {
          return false;
        } else {
          return true;
        }
      case 1:
        if (
          hasValue(form.getValues('greeting_message')) &&
          (tag.length === 0
            ? false
            : tag.every((item) => item === '')
              ? false
              : tag.some((item) => item === '')
                ? true
                : true) &&
          (botMode !== 'edit' ? siteMapURL || trainFile.length > 0 : true)
        ) {
          return false;
        } else {
          return true;
        }
      case 2:
        if (questionValue.length === 0) {
          return true;
        } else if (questionValue.every((item) => item === '')) {
          return true;
        } else if (questionValue.some((item) => item === '')) {
          return false;
        } else {
          return false;
        }
      case 3:
        return true;
      default:
        return true;
    }
  };

  const getVariants = () => {
    switch (botDetail?.traning_status) {
      case 'UNTRAINED':
        return 'destructive';
      case 'TRAINING':
        return 'warning';
      case 'TRAINED':
        return 'success';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <>
            <SubHeading title={botMode === 'edit' ? 'Edit Agent' : 'Add a new agent'}>
              <div className="flex items-center gap-4">
                {botDetail?.traning_status && (
                  <Badge variant={getVariants()}>{botDetail?.traning_status}</Badge>
                )}
                {botMode !== 'edit' && (
                  <div className="flex items-center gap-3">
                    {activeStep === 3 && (
                      <>
                        <Button
                          type="submit"
                          variant="outline"
                          isLoading={
                            botAddStatus === 'loading' || deploymentStatus === 'loading'
                              ? true
                              : false
                          }
                          className="gap-3"
                          onClick={() => setIsDraft(true)}
                        >
                          <DraftIcon />
                          Save as Draft
                        </Button>
                        <Button
                          type="submit"
                          isLoading={
                            botAddStatus === 'loading' || deploymentStatus === 'loading'
                              ? true
                              : false
                          }
                          className="bg-purple-500 text-white gap-3"
                        >
                          <CPUIcon /> Deploy
                        </Button>
                      </>
                    )}
                  </div>
                )}
                {botMode === 'edit' && activeStep === 3 && (
                  <Button
                    type="submit"
                    isLoading={
                      botUpdateStatus === 'loading' || chatUpdateStatus === 'loading'
                        ? // chatdeleteStatus === 'loading'
                          true
                        : false
                    }
                    className="bg-purple-500 text-white gap-3"
                  >
                    Update
                  </Button>
                )}
              </div>
            </SubHeading>

            <div className="max-w-[1600px] m-auto 2xl:mt-6 grid grid-cols-12 py-4">
              <Stepper
                steps={STEPS}
                activeStep={activeStep + 1}
                onStepClick={(step) => {
                  if (activeStep >= CreateBotFormStep[step] || !isNextDisabled(activeStep)) {
                    handleStepClick(step);
                  }
                }}
                className="col-span-2 mt-2 ml-2"
              />

              <div className="col-span-5 flex flex-col justify-between">
                {activeStep === CreateBotFormStep['Company Details'] && (
                  <CompanyDetails
                    form={form}
                    botDetail={botDetail}
                    mode={botMode}
                    file={file}
                    setFile={setFile}
                    companyLogo={companyLogo}
                    setCompanyLogo={setCompanyLogo}
                  />
                )}
                {activeStep === CreateBotFormStep['Training'] && (
                  <Training
                    form={form}
                    botDetail={botDetail}
                    mode={botMode}
                    tag={tag}
                    setTag={setTag}
                    tagValue={tagValue}
                    setTagValue={setTagValue}
                    siteMapURL={siteMapURL}
                    setSiteMapURL={setSiteMapURL}
                    siteMapLinks={siteMapLinks}
                    setSiteMapLinks={setSiteMapLinks}
                    fetchSitemap={fetchSitemap}
                    setIsFetchSitemap={setIsFetchSitemap}
                    trainFile={trainFile}
                    setTrainFile={setTrainFile}
                    trainingLinks={trainingLinks}
                    setTrainingLinks={setTrainingLinks}
                    siteMapAddStatus={siteMapAddStatus}
                  />
                )}
                {activeStep === CreateBotFormStep['Data Collection'] && (
                  <DataCollection
                    questions={questions}
                    setQuestions={setQuestions}
                    questionValue={questionValue}
                    setQuestionValue={setQuestionValue}
                  />
                )}
                {activeStep === CreateBotFormStep['Call To Action'] && (
                  <CallToAction form={form} botDetail={botDetail} mode={botMode} />
                )}
                <div className="flex gap-2 items-center justify-center">
                  {activeStep !== 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveStep(activeStep - 1);
                      }}
                      type="button"
                      disabled={activeStep <= 0}
                      className="mt-10 "
                    >
                      Previous
                    </Button>
                  )}
                  {activeStep !== 3 && (
                    <Button
                      variant="purple"
                      onClick={() => {
                        setActiveStep(activeStep + 1);
                        toogleBotStep(activeStep + 1);
                      }}
                      type="button"
                      disabled={isNextDisabled(activeStep)}
                      className="mt-10 "
                    >
                      Next
                    </Button>
                  )}
                  {activeStep === 3 && (
                    <Button
                      variant="purple"
                      type="submit"
                      className="mt-10 "
                      isLoading={
                        botUpdateStatus === 'loading' || chatUpdateStatus === 'loading'
                          ? // chatdeleteStatus === 'loading'
                            true
                          : false
                      }
                    >
                      {botMode !== 'edit' && (
                        <>
                          <CPUIcon />
                          Deploy
                        </>
                      )}
                      {botMode === 'edit' && <>Update</>}
                    </Button>
                  )}
                </div>
              </div>

              <div className="col-span-5 px-4">
                <PreviewChatModal file={file} companyLogo={companyLogo} tag={tag} />
              </div>
            </div>
          </>
        </form>
      </Form>

      <BotProgressDialog
        isOpen={openProgressModal}
        onClose={() => {
          setError('');
          setOpenProgressModal(false);
        }}
        botId={createdBotId}
        step={trainingState}
        error={error}
      />
      {/* Render the dialog conditionally */}
      {showDialog && <UpgradeDialog onClose={handleCloseDialog} />}
    </div>
  );
};
