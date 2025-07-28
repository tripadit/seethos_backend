import { zodResolver } from '@hookform/resolvers/zod';
import { DownloadIcon, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { AddIcon, CloseIcon, FileIcon, SaveIcon, SyncIcon } from '@/assets/icons';
import { CTooltip, SingleImageUpload } from '@/components/molecules';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { CONVERSATION_END, CONVERSATION_START, FORM_HELPER } from '@/global/appConstants';
import {
  addBotSchema,
  useAddBot,
  useAddSitemap,
  useDeleteChatBot,
  useDeployChatbot,
  useFetchChatbot,
  useGetCurrentUserInfo,
  useScrapeSitemap,
  useUpdateBot,
  useUpdateChatBot,
  useUploadFile,
} from '@/hooks/api';
import { useDeleteFile } from '@/hooks/api/useDeleteFile';
import { cn, convertBytes } from '@/lib/utils';
import { routes } from '@/routes/routes';

import FetchSitemapDialog from '../dialog/FetchSitemapDialog';
import { HelpDialog } from '../dialog/HelpDialog';
import { SubHeading } from '../molecules/Header/SubHeading';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { FormLoader } from '.';

export const AddChatBotForm = ({
  mode,
  botId,
}: {
  mode?: string | null;
  botId?: string | null;
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [file, setFile] = useState<any>();
  const [siteMapURL, setSiteMapURL] = useState<string>('');

  const [companyLogo, setCompanyLogo] = useState<any>();
  const [fetchSitemap, setIsFetchSitemap] = useState<boolean>(false);
  const [siteMapLinks, setSiteMapLinks] = useState<string[]>([]);
  const [trainingLinks, setTrainingLinks] = useState<string[]>([]);
  const [trainFile, setTrainFile] = useState<any[]>([]);
  const [tag, setTag] = useState<string[]>([]);
  const [tagValue, setTagValue] = useState<any>();
  const [questions, setQuestions] = useState<number>(1);
  const [questionValue, setQuestionValue] = useState<string[]>([]);

  const { status: botAddStatus, mutate: addBotFn } = useAddBot();
  const { status: siteMapAddStatus, mutate: addSiteMapFn } = useAddSitemap();
  const { status: botUpdateStatus, mutate: updateBotFn } = useUpdateBot();
  const { status: deploymentStatus, mutate: deployChatbotFn } = useDeployChatbot();
  const { status: chatUpdateStatus, mutate: updateChatbotFn } = useUpdateChatBot();
  const { status: chatdeleteStatus, mutate: deleteChatbotFn } = useDeleteChatBot();
  const { status: uploadStatus, mutateAsync: uploadFileAsynFn } = useUploadFile();
  const { isLoading: isDeletingFile, mutateAsync: deleteFileFn } = useDeleteFile();
  const { isLoading: isScrapeLoading, mutateAsync: scrapeSiteMapFn } = useScrapeSitemap();
  const { data: botDetail, isLoading } = useFetchChatbot(botId as string, {
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
  const { data: personalInfo } = useGetCurrentUserInfo();

  const form = useForm<z.infer<typeof addBotSchema>>({
    resolver: zodResolver(addBotSchema),

    defaultValues: !botDetail
      ? {
          name: '',
          status: true,
          avatar: 'bot-one',
          conversation_end_flow: '',
          conversation_start_flow: CONVERSATION_START[0],
          call_to_action_link: '',
          call_to_action_prompt: '',
          question: [],
          greeting_tags: [],
          files: [],
          company_logo: personalInfo?.data?.company_logo,
          company_name: personalInfo?.data?.company_name ? personalInfo?.data?.company_name : '',
        }
      : {
          ...botDetail,
          greeting_tags: botDetail.greeting_tags,
          avatar: botDetail.avatar,
          company_logo: botDetail.company_logo,
          chatbot_id: botDetail.bot_id,
          files: [],
        },
  });
  const handleQuestionChange = (value: string, index: number) => {
    const updatedValues = [...questionValue];
    updatedValues[index] = value;
    setQuestionValue(updatedValues);
  };

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

  function onSubmit(values: z.infer<typeof addBotSchema>) {
    const isTrainingValid = handleValidation({
      condition: trainFile?.length === 0 && trainingLinks?.length === 0,
      name: 'files',
      options: { message: 'Either Training Files or Training URL is required' },
    });

    const isAvatarValid = handleValidation({
      condition: file == null,
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

    const req = {
      ...values,
      avatar: file,
      company_logo: companyLogo,
      question: questionValue,
      files: trainFile?.map((el: any) => parseInt(el.id)),
      greeting_tags: tag,
    };

    if (typeof req.company_logo === 'string' || req.company_logo === undefined) {
      delete req.company_logo;
    }
    if (!values.files || !!values.files.length) {
      form.setError('files', {
        type: 'manual',
        message: 'Either File or Sitemap is required',
      });
    }

    if (mode === 'edit') {
      if (typeof req.avatar === 'string' || req.avatar === undefined) {
        delete req.avatar;
      }
      updateBotFn(req, {
        onSuccess: () => {
          if (req.status) {
            toast({
              variant: 'success',
              title: 'Updating agent...',
            });
            updateChatbotFn(req.id as string, {
              onSuccess: () => {
                toast({
                  variant: 'success',
                  title: 'Chatbot updated successfully',
                });
                navigate(routes.dashboard);
              },
            });
          }
          if (!req.status) {
            deleteChatbotFn(req.id as string, {
              onSuccess: () => {
                toast({
                  variant: 'success',
                  title: 'Chatbot updated successfully',
                });
                navigate(routes.dashboard);
              },
            });
          }
        },
      });
    } else {
      addBotFn(req, {
        onSuccess: (response) => {
          toast({
            variant: 'success',
            title: 'AI Agent created successfully!',
          });
          if (
            req.status === true &&
            (siteMapURL !== '' || siteMapURL === undefined) &&
            !!trainingLinks.length
          ) {
            addSiteMapFn(
              {
                url: siteMapURL,
                traning_links: trainingLinks,
                chatbot: response.id,
              },
              {
                onSuccess: () => {
                  deployChatbotFn(response.id, {
                    onSuccess: () => {
                      toast({
                        variant: 'success',
                        title: 'Chatbot deployed successfully',
                      });
                      req.status && navigate(routes.iframeDetail.replace(':id', response.id));
                      !req.status && navigate(routes.dashboard);
                    },
                  });
                },
              },
            );
          }
          if (req.status === true && siteMapURL === '' && !trainingLinks.length) {
            deployChatbotFn(response.id, {
              onSuccess: () => {
                toast({
                  variant: 'success',
                  title: 'Chatbot deployed successfully',
                });
                req.status && navigate(routes.iframeDetail.replace(':id', response.id));
                !req.status && navigate(routes.dashboard);
              },
            });
          }
        },
      });
    }
  }

  const handleChangeTag = (e: { target: { value: any } }) => {
    setTagValue(e.target.value);
  };

  const addTags = () => {
    const tagCount = (form.watch('greeting_tags') ?? []).length;
    if (tagCount >= 3) {
      toast({
        variant: 'destructive',
        title: 'You may only set upto 3 greeting buttons, please remove one to add a new button',
      });
      return;
    }
    setTag([...tag, tagValue]);
    form.setValue('greeting_tags', [...tag, tagValue]);
    setTagValue('');
  };

  const handleRemoveTag = (idx: number) => {
    const newTag = [...tag];
    newTag.splice(idx, 1);
    setTag(newTag);
    form.setValue('greeting_tags', newTag);
  };

  const toggleSiteMapDialog = () => {
    setIsFetchSitemap(!fetchSitemap);
  };

  const handleScrapeSiteMaps = () => {
    setTrainingLinks([]);
    setSiteMapLinks([]);
    if (siteMapURL) {
      scrapeSiteMapFn(siteMapURL, {
        onSuccess: (data: any) => {
          setSiteMapLinks(data?.data?.links || []);
          toggleSiteMapDialog();
        },
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 h-screen md:space-y-4 w-full"
        >
          <SubHeading
            // isLoading={mode === 'edit' && isLoading}
            title={mode === 'edit' ? 'Edit Agent' : 'Add a new agent'}
            onBackPress={() => navigate(routes.dashboard)}
          >
            {mode !== 'edit' && (
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  isLoading={
                    botAddStatus === 'loading' || deploymentStatus === 'loading' ? true : false
                  }
                  className="bg-purple-500 text-white gap-3"
                >
                  <SaveIcon /> Save
                </Button>
              </div>
            )}
            {mode === 'edit' && (
              <Button
                type="submit"
                isLoading={
                  botUpdateStatus === 'loading' ||
                  chatUpdateStatus === 'loading' ||
                  chatdeleteStatus === 'loading'
                    ? true
                    : false
                }
                className="bg-purple-500 text-white gap-3"
              >
                Update
              </Button>
            )}
          </SubHeading>
          {mode === 'edit' && isLoading && <FormLoader />}
          {(mode !== 'edit' || !isLoading) && (
            <div className="overflow-auto mt-header">
              <div className="max-w-7xl mt-6 mb-8">
                <div className="grid md:grid-cols-2 grid-cols-1 md:gap-24 gap-3">
                  {/** left */}
                  <div className="flex flex-col gap-6">
                    {/* Company Name */}
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-[170px_1fr]">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row w-min whitespace-nowrap gap-1 items-center">
                              <span>Company Name</span>
                              <HelpDialog
                                title={FORM_HELPER.company_name.title}
                                body={FORM_HELPER.company_name.body}
                              />
                            </div>
                          </FormLabel>
                          <div className="m-0 md:max-w-sm w-full">
                            <FormControl>
                              <Input
                                placeholder="Enter company name"
                                className="m-0 md:max-w-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Company logo */}
                    <FormField
                      control={form.control}
                      name="company_logo"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-[170px_1fr]">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row w-min whitespace-nowrap gap-1 items-center">
                              <span>Company Logo</span>
                              <HelpDialog
                                title={FORM_HELPER.chatbot_avatar.title}
                                body={FORM_HELPER.chatbot_avatar.body}
                                image={FORM_HELPER.chatbot_avatar.image}
                              />
                            </div>
                          </FormLabel>
                          <div className="flex flex-col gap-4">
                            <FormControl>
                              <div className="flex gap-2">
                                <div className="flex space-x-2">
                                  <FormLabel htmlFor="custom-icon">
                                    <div className="flex flex-col gap-1">
                                      <SingleImageUpload
                                        title="Choose File"
                                        onImageUpload={(file) => {
                                          setCompanyLogo(file[0]);
                                          form.clearErrors('company_logo');
                                        }}
                                        className="h-[50px] bg-white border border-neutral-300"
                                      ></SingleImageUpload>
                                      <div className="text-sm font-medium text-gray-500 flex gap-2 items-center">
                                        <p>Max 3 mb</p>
                                      </div>
                                    </div>
                                  </FormLabel>
                                </div>
                                {((companyLogo &&
                                  typeof companyLogo !== 'string' &&
                                  URL.createObjectURL(companyLogo)) ||
                                  field.value) && (
                                  <img
                                    src={
                                      (companyLogo &&
                                        typeof companyLogo !== 'string' &&
                                        URL.createObjectURL(companyLogo)) ||
                                      field.value
                                    }
                                    className="w-12 h-12"
                                  />
                                )}
                              </div>
                            </FormControl>
                            {form.formState.errors!.company_logo?.message && (
                              <p className="text-sm font-medium text-destructive">
                                {form.formState.errors!.company_logo?.message?.toString()}
                              </p>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Chatbot Avatar */}
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-[170px_1fr]">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row w-min whitespace-nowrap gap-1 items-center">
                              <span>Agent Avatar</span>
                              <HelpDialog
                                title={FORM_HELPER.chatbot_avatar.title}
                                body={FORM_HELPER.chatbot_avatar.body}
                                image={FORM_HELPER.chatbot_avatar.image}
                              />
                            </div>
                          </FormLabel>
                          <div className="flex flex-col gap-4">
                            <p className="text-gray-500 text-base font-normal">
                              Select avatar for your agent or upload your custom
                            </p>
                            <FormControl>
                              <RadioGroup
                                className="m-0 mt-2 md:max-w-sm w-full flex gap-5"
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                {/** V2 */}
                                {/* <div className="flex space-x-2">
                              <RadioGroupItem value="bot-blue" id="bot-one" />
                              <FormLabel htmlFor="bot-one">
                                <BotBlueIcon />
                              </FormLabel>
                            </div>
                            <div className="flex space-x-2">
                              <RadioGroupItem value="bot-green" id="bot-two" />
                              <FormLabel htmlFor="bot-two">
                                <BotGreenIcon />
                              </FormLabel>
                            </div> */}
                                <div className="flex space-x-2">
                                  <RadioGroupItem value="custom-icon" id="custom-icon" />
                                  <FormLabel htmlFor="custom-icon">
                                    <div className="flex flex-col gap-1">
                                      <SingleImageUpload
                                        title="Choose File"
                                        onImageUpload={(file) => {
                                          setFile(file[0]);
                                          form.clearErrors('avatar');
                                        }}
                                        className="h-[50px] bg-white border border-neutral-300"
                                      ></SingleImageUpload>
                                      {file && (
                                        <p className="truncate max-w-[130px] text-gray-600">
                                          {file?.name}
                                        </p>
                                      )}
                                    </div>
                                  </FormLabel>
                                </div>
                                {mode === 'edit' &&
                                  botDetail &&
                                  field.value === botDetail.avatar && (
                                    <img src={field.value} className="w-12 h-12" />
                                  )}
                              </RadioGroup>
                            </FormControl>
                            {form.formState.errors!.avatar?.message && (
                              <p className="text-sm font-medium text-destructive">
                                {form.formState.errors!.avatar?.message?.toString()}
                              </p>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Agent Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-[170px_1fr]">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row w-min whitespace-nowrap gap-1 items-center">
                              <span>Assistant Name</span>
                              <HelpDialog
                                title={FORM_HELPER.chatbot_name.title}
                                body={FORM_HELPER.chatbot_name.body}
                              />
                            </div>
                          </FormLabel>
                          <div className="m-0 md:max-w-sm w-full">
                            <FormControl>
                              <Input placeholder="Enter assistant name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Website link/Sitemap URL */}
                    {mode !== 'edit' && (
                      <>
                        <FormItem className="grid grid-cols-[170px_1fr]">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row w-min whitespace-nowrap gap-1 items-center">
                              <span>Easy Onboarding Training URL</span>
                              <HelpDialog
                                title={FORM_HELPER.company_name.title}
                                body={FORM_HELPER.company_name.body}
                              />
                            </div>
                          </FormLabel>

                          <div className="m-0 md:max-w-sm w-full">
                            <FormControl>
                              <div className="flex flex-col gap-3">
                                <Input
                                  placeholder="Enter your link for AI Easy Onboarding"
                                  className="m-0 md:max-w-sm"
                                  value={siteMapURL}
                                  disabled={siteMapAddStatus === 'loading'}
                                  onChange={(e) => {
                                    setSiteMapURL(e.target.value);
                                  }}
                                />
                                <div className="flex gap-2">
                                  <CTooltip text="Fetch sitemaps">
                                    <Button
                                      variant="purple"
                                      type="button"
                                      className="w-max"
                                      onClick={handleScrapeSiteMaps}
                                      isLoading={isScrapeLoading}
                                      disabled={
                                        !siteMapURL ||
                                        isScrapeLoading ||
                                        siteMapAddStatus === 'loading'
                                      }
                                    >
                                      <SyncIcon className={cn({ hidden: isScrapeLoading })} />
                                      {isScrapeLoading ? 'Fetching' : 'Start Training'}
                                    </Button>
                                  </CTooltip>
                                  {!!siteMapLinks.length && (
                                    <CTooltip text="View sitemaps">
                                      <Button
                                        variant="purple"
                                        type="button"
                                        className="w-max"
                                        onClick={toggleSiteMapDialog}
                                        isLoading={isScrapeLoading}
                                        disabled={!siteMapURL || isScrapeLoading}
                                      >
                                        View Links
                                      </Button>
                                    </CTooltip>
                                  )}
                                </div>
                                {form.formState.errors.files?.message && (
                                  <p className="text-sm font-medium text-destructive">
                                    {form.formState.errors.files?.message}
                                  </p>
                                )}
                              </div>
                            </FormControl>
                          </div>
                        </FormItem>
                      </>
                    )}

                    {/* Files to train bot */}
                    {mode !== 'edit' && (
                      <div className="grid grid-cols-[170px_1fr] gap-3">
                        <FormLabel className="min-w-170">
                          <div className="form-label-help flex flex-row w-min whitespace-nowrap gap-1 items-center">
                            <span>Retraining Files</span>
                            <HelpDialog
                              title={FORM_HELPER.company_name.title}
                              body={FORM_HELPER.company_name.body}
                            />
                          </div>
                        </FormLabel>
                        <div className="flex flex-col gap-4 m-0 p-0 md:max-w-sm">
                          <p className="text-gray-500 text-base font-normal">
                            Browse and chose the files you want to upload from your computer to
                            train your bot about your project.
                          </p>
                          <div className="flex flex-col gap-2  flex-wrap">
                            <SingleImageUpload
                              isLoading={uploadStatus === 'loading' ? true : false}
                              title={'Choose File'}
                              multiple
                              accept={{
                                'application/pdf': [],
                                'application/vnd.ms-excel': [],
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                                  [],
                                'application/docx': [],
                                'text/plain': [],
                                'application/msword': [],
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                                  [],
                              }}
                              onImageUpload={async (file: File[]) => {
                                let res: any[] = [...trainFile];

                                for (let i = 0; i < file.length; i++) {
                                  const item = file[i];

                                  await uploadFileAsynFn(item, {
                                    onSuccess: (response: any) => {
                                      res.push({ ...response });
                                      toast({
                                        variant: 'success',
                                        title: 'File uploaded succesfully!',
                                      });
                                    },
                                  });
                                }

                                setTrainFile(res);
                                form.clearErrors('files');
                              }}
                              className="h-[46px] border border-neutral-300"
                            >
                              {/* <Icon source={UploadImageIcon} isSvg size={20} className="text-gray-500" /> */}
                            </SingleImageUpload>
                            {trainFile && !!trainFile.length && (
                              <>
                                <p className="text-sm font-semibold">Added Files</p>
                                {trainFile.map((file: any, idx: number) => (
                                  <Card className="p-4 flex items-center w-full gap-2" key={idx}>
                                    <FileIcon />
                                    <div className="flex items-end justify-between flex-1">
                                      <div>
                                        <h4>{file.name || `File ${idx + 1}`}</h4>
                                        <p>{convertBytes(file.size)}</p>
                                      </div>
                                    </div>
                                    <a
                                      href={file?.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs"
                                    >
                                      <Button variant={'ghost'}>
                                        <DownloadIcon className="[&>path]:stroke-gray-500 cursor-pointer" />
                                      </Button>
                                    </a>
                                    <Button
                                      variant={'ghost'}
                                      isLoading={isDeletingFile}
                                      disabled={isDeletingFile}
                                      onClick={async () => {
                                        await deleteFileFn({ id: file.id });
                                        const items = [...trainFile];
                                        const newItems = items.filter(
                                          (item) => item.id !== file.id,
                                        );
                                        setTrainFile(newItems);
                                      }}
                                    >
                                      <Trash size={14} />
                                    </Button>
                                  </Card>
                                ))}
                              </>
                            )}
                            {form.formState.errors.files?.message && (
                              <p className="text-sm font-medium text-destructive">
                                {form.formState.errors.files?.message}
                              </p>
                            )}
                          </div>
                          <FormMessage />
                        </div>
                      </div>
                    )}

                    {/* Bot Status */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="justify-start">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row w-min whitespace-nowrap gap-1 items-center">
                              <span>Status</span>
                              <HelpDialog
                                title={FORM_HELPER.status.title}
                                body={FORM_HELPER.status.body}
                              />
                            </div>
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <p className="text-gray-700 text-base font-medium">Online</p>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="rotate-180"
                              />
                              <p className="text-gray-700 text-base font-medium">Offline</p>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/** right */}
                  <div className="flex flex-col gap-6">
                    {/* Greeting Message */}
                    <FormField
                      control={form.control}
                      name="greeting_message"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-[170px_1fr]">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row w-min whitespace-nowrap gap-1 items-center">
                              <span>Greeting Message</span>
                              <HelpDialog
                                title={FORM_HELPER.greeting_message.title}
                                body={FORM_HELPER.greeting_message.body}
                                image={FORM_HELPER.greeting_message.image}
                              />
                            </div>
                          </FormLabel>
                          <FormControl>
                            <div className="m-0 md:max-w-sm w-full">
                              <Textarea
                                defaultValue=""
                                placeholder="Enter a greeting message..."
                                className="m-0  h-32"
                                {...field}
                              />
                              <FormMessage />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/** V2 */}
                    {/* <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                     <FormItem className='grid grid-cols-[170px_1fr]'>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <div className="m-0 md:max-w-sm w-full">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="m-0 md:max-w-sm">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              {LANGUAGES.map((language, idx) => (
                                <SelectItem value={language} key={idx}>
                                  {language}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                /> */}

                    {/* Greeting Questions */}
                    <div className="grid grid-cols-[170px_1fr] gap-3">
                      <FormLabel className="min-w-170">
                        <div className="form-label-help flex flex-row w-min whitespace-nowrap gap-1 items-center">
                          <span>Greeting Questions</span>
                          <HelpDialog
                            title={FORM_HELPER.greeting_button.title}
                            body={FORM_HELPER.greeting_button.body}
                            image={FORM_HELPER.greeting_button.image}
                          />
                        </div>
                      </FormLabel>
                      <div className="flex gap-3 md:max-w-sm w-full">
                        <div className="flex flex-col gap-1 w-full">
                          <Input
                            value={tagValue}
                            disabled={tag.length >= 3}
                            onChange={handleChangeTag}
                          />
                          <div className="text-sm font-medium text-gray-500 flex gap-2 items-center">
                            <p>Max 3 Questions</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          type="button"
                          disabled={!tagValue || tag.length >= 3}
                          onClick={addTags}
                        >
                          <p className="text-gray-500 text-2xl">+</p>
                        </Button>
                      </div>
                    </div>
                    {tag && !!tag.length && (
                      <div className="flex justify-between">
                        <div></div>
                        <div className="md:max-w-sm flex flex-col  h-max gap-2 flex-wrap w-full">
                          <div className="flex gap-2.5">
                            {tag?.map(
                              (value, idx) =>
                                value !== '' && (
                                  <Badge
                                    className="py-2 px-3  flex items-center gap-2 w-max"
                                    variant="count"
                                    key={idx}
                                  >
                                    <p className="max-w-[150px] md:max-w-xs truncate ">{value}</p>
                                    <CloseIcon
                                      onClick={() => handleRemoveTag(idx)}
                                      className="cursor-pointer text-purple-500"
                                    />
                                  </Badge>
                                ),
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Data Collection */}
                    <div className="grid grid-cols-[170px_1fr] gap-3">
                      <FormLabel className="min-w-170">
                        <div className="form-label-help flex flex-row w-min whitespace-nowrap gap-1 items-center">
                          <span>Data Collection</span>
                          <HelpDialog
                            title={FORM_HELPER.company_name.title}
                            body={FORM_HELPER.company_name.body}
                          />
                        </div>
                      </FormLabel>
                      <div className="md:max-w-sm w-full flex flex-col gap-4">
                        {Array.from({ length: questions }, (_, index) => index).map((idx) => (
                          <div className="flex items-center gap-3" key={idx}>
                            <Input
                              placeholder="Tell me more about your company?"
                              className="m-0 "
                              value={questionValue[idx] || ''}
                              onChange={(e) => handleQuestionChange(e.target.value, idx)}
                            />
                          </div>
                        ))}

                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => setQuestions(questions + 1)}
                        >
                          <AddIcon className="question-add-icon" width={16} height={16} />
                          <p className="text-purple-500 text-base font-medium">Add an Item </p>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="call_to_action_link"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-[170px_1fr]">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row flex-wrap gap-1 items-center">
                              <span className="flex-1">Call To Action(CTA) Link</span>
                              <HelpDialog
                                title={FORM_HELPER.call_to_action.title}
                                body={FORM_HELPER.call_to_action.body}
                              />
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              defaultValue=""
                              placeholder="https://www.demo.ai"
                              className="m-0 md:max-w-sm  h-32"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="call_to_action_prompt"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-[170px_1fr]">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row  items-center">
                              <span className="flex-1">Call To Action(CTA) Prompt</span>
                              <HelpDialog
                                title={FORM_HELPER.call_to_action.title}
                                body={FORM_HELPER.call_to_action.body}
                              />
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              defaultValue=""
                              placeholder="CTA objective is to get user to schedule a meeting."
                              className="m-0 md:max-w-sm  h-32"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="conversation_start_flow"
                      render={({ field,formState }) => (
                        <FormItem className="grid grid-cols-[170px_1fr]">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row  items-center">
                              <span className="flex-1">Conversation Start Flow</span>
                              <HelpDialog
                                title={FORM_HELPER.call_to_action.title}
                                body={FORM_HELPER.call_to_action.body}
                              />
                            </div>
                          </FormLabel>
                          <FormControl>
                            <div className="m-0 md:max-w-sm w-full">
                              <Select onValueChange={field.onChange} defaultValue={field.value ?? formState.defaultValues?.conversation_start_flow}>
                                <SelectTrigger className="m-0 w-full">
                                  <div className="flex items-center gap-3">
                                    <SelectValue placeholder="Select ..." />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {CONVERSATION_START.map((conversation, idx) => (
                                    <SelectItem  value={conversation} key={idx}>
                                      {conversation}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    /> */}
                    <FormField
                      control={form.control}
                      name="conversation_end_flow"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-[170px_1fr]">
                          <FormLabel className="min-w-170">
                            <div className="form-label-help flex flex-row  items-center">
                              <span className="flex-1">End of Conversation Flow</span>
                              <HelpDialog
                                title={FORM_HELPER.call_to_action.title}
                                body={FORM_HELPER.call_to_action.body}
                              />
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="m-0 md:max-w-sm ">
                                <div className="flex items-center gap-3">
                                  <SelectValue placeholder="Select ..." />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {CONVERSATION_END.map((conversation, idx) => (
                                  <SelectItem value={conversation} key={idx}>
                                    {conversation}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/** V2 */}
                    {/* <div className='flex justify-between'>
                  <FormLabel>DNS Verification</FormLabel>
                  <div className='md:max-w-sm w-full'>
                    <Input className='md:max-w-sm w-full' placeholder='Enter your domain name here' />
                    {true && <div>

                      <p className='text-sm text-gray-500'>This domain has been verified</p>
                    </div>}
                  </div>
                </div> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
      <FetchSitemapDialog
        siteMapUrl={siteMapURL}
        trainingLinks={trainingLinks}
        setTrainingLinks={setTrainingLinks}
        siteMapLinks={siteMapLinks}
        isOpen={fetchSitemap}
        onClose={toggleSiteMapDialog}
      />
    </>
  );
};

//Link to a calender
